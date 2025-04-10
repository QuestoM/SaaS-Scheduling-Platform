# Scheduling Algorithm for Home Care SaaS Platform

## Overview

This document outlines the scheduling algorithm for the home care SaaS platform. The algorithm is designed to efficiently match clients with appropriate staff while optimizing schedules to minimize travel time, manage keys, and accommodate client preferences.

## Algorithm Components

### 1. Constraint-Based Scheduling

The scheduling algorithm uses constraint programming to generate optimal schedules while satisfying various constraints:

#### Hard Constraints (Must be satisfied)
- Staff availability (working hours, days off)
- Staff qualifications matching client needs
- No scheduling conflicts (one staff member cannot be in two places at once)
- Travel time between appointments must be feasible
- Key availability for client homes

#### Soft Constraints (Should be satisfied when possible)
- Client time preferences
- Client staff preferences
- Minimizing travel time
- Balancing workload among staff
- Maintaining continuity of care (same staff for recurring visits)

### 2. Optimization Objectives

The algorithm optimizes schedules based on multiple objectives:

1. **Primary Objective**: Maximize the number of scheduled appointments
2. **Secondary Objectives**:
   - Minimize total travel time
   - Maximize client preference satisfaction
   - Balance workload among staff
   - Minimize key handovers

### 3. Algorithm Phases

#### Phase 1: Data Preparation
- Load client requirements and preferences
- Load staff availability and skills
- Load location data and travel times
- Load key availability information

#### Phase 2: Initial Assignment
- Match clients with qualified staff based on skills
- Create initial assignment based on geographic proximity
- Apply time window constraints

#### Phase 3: Schedule Optimization
- Apply constraint propagation to eliminate invalid assignments
- Use local search techniques to improve initial solution
- Apply simulated annealing to escape local optima

#### Phase 4: Key Management Integration
- Optimize key handovers based on schedule
- Minimize key transfers between staff
- Ensure key availability for scheduled visits

#### Phase 5: Schedule Refinement
- Handle edge cases and conflicts
- Apply manual overrides if necessary
- Generate final schedule

## Implementation Details

### Core Algorithm Implementation

```python
import numpy as np
from ortools.sat.python import cp_model
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

class HomeCareScheduler:
    def __init__(self, db_connection):
        self.db = db_connection
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.solver.parameters.max_time_in_seconds = 60  # Adjust based on problem size
        
    def load_data(self, start_date, end_date):
        """Load all necessary data for scheduling"""
        self.clients = self._load_clients()
        self.staff = self._load_staff()
        self.client_preferences = self._load_client_preferences()
        self.staff_skills = self._load_staff_skills()
        self.travel_times = self._load_travel_times()
        self.keys = self._load_keys()
        self.time_slots = self._generate_time_slots(start_date, end_date)
        
    def _load_clients(self):
        """Load client data from database"""
        # SQL query to fetch client data
        query = """
        SELECT c.id, c.first_name, c.last_name, c.address, c.city, c.state, c.zip_code, c.status
        FROM clients c
        WHERE c.status = 'active'
        """
        # Execute query and return results
        return self.db.execute_query(query)
    
    def _load_staff(self):
        """Load staff data from database"""
        # SQL query to fetch staff data
        query = """
        SELECT s.id, s.first_name, s.last_name, s.address, s.city, s.state, s.zip_code, s.status
        FROM staff s
        WHERE s.status = 'active'
        """
        # Execute query and return results
        return self.db.execute_query(query)
    
    def _load_client_preferences(self):
        """Load client preferences from database"""
        # SQL query to fetch client preferences
        query = """
        SELECT cp.client_id, cp.preferred_time_start, cp.preferred_time_end, 
               cp.preferred_days, cp.preferred_staff_id, cp.special_instructions
        FROM client_preferences cp
        JOIN clients c ON cp.client_id = c.id
        WHERE c.status = 'active'
        """
        # Execute query and return results
        return self.db.execute_query(query)
    
    def _load_staff_skills(self):
        """Load staff skills from database"""
        # SQL query to fetch staff skills
        query = """
        SELECT ss.staff_id, ss.skill_id, ss.level, s.name as skill_name
        FROM staff_skills ss
        JOIN skills s ON ss.skill_id = s.id
        JOIN staff st ON ss.staff_id = st.id
        WHERE st.status = 'active'
        """
        # Execute query and return results
        return self.db.execute_query(query)
    
    def _load_travel_times(self):
        """Load travel times from database"""
        # SQL query to fetch travel times
        query = """
        SELECT tt.from_location_id, tt.to_location_id, tt.travel_time, tt.distance
        FROM travel_times tt
        """
        # Execute query and return results
        return self.db.execute_query(query)
    
    def _load_keys(self):
        """Load key information from database"""
        # SQL query to fetch key information
        query = """
        SELECT k.id, k.client_id, k.key_type, k.key_identifier, k.status,
               kh.from_staff_id, kh.to_staff_id, kh.handover_time, kh.status as handover_status
        FROM keys k
        LEFT JOIN key_handovers kh ON k.id = kh.key_id
        WHERE k.status = 'active'
        ORDER BY kh.handover_time DESC
        """
        # Execute query and return results
        return self.db.execute_query(query)
    
    def _generate_time_slots(self, start_date, end_date, interval_minutes=30):
        """Generate time slots for scheduling"""
        time_slots = []
        current_date = start_date
        while current_date <= end_date:
            # Generate slots for each day from 7:00 AM to 9:00 PM
            start_time = datetime.combine(current_date, time(7, 0))
            end_time = datetime.combine(current_date, time(21, 0))
            current_time = start_time
            
            while current_time < end_time:
                time_slots.append(current_time)
                current_time += timedelta(minutes=interval_minutes)
            
            current_date += timedelta(days=1)
        
        return time_slots
    
    def create_variables(self):
        """Create decision variables for the CP model"""
        self.assignments = {}
        
        # For each client, staff, and time slot, create a binary variable
        # 1 if staff is assigned to client at that time, 0 otherwise
        for client in self.clients:
            for staff in self.staff:
                for time_slot in self.time_slots:
                    var_name = f"assign_c{client['id']}_s{staff['id']}_t{time_slot.strftime('%Y%m%d%H%M')}"
                    self.assignments[(client['id'], staff['id'], time_slot)] = self.model.NewBoolVar(var_name)
    
    def add_constraints(self):
        """Add constraints to the CP model"""
        self._add_staff_availability_constraints()
        self._add_no_overlap_constraints()
        self._add_skill_match_constraints()
        self._add_travel_time_constraints()
        self._add_key_availability_constraints()
        self._add_client_preference_constraints()
    
    def _add_staff_availability_constraints(self):
        """Staff can only be assigned during their available hours"""
        # Implementation depends on how staff availability is stored
        pass
    
    def _add_no_overlap_constraints(self):
        """Staff cannot be assigned to multiple clients at the same time"""
        for staff in self.staff:
            for time_slot in self.time_slots:
                # Sum of assignments for this staff at this time must be <= 1
                staff_assignments_at_time = []
                for client in self.clients:
                    if (client['id'], staff['id'], time_slot) in self.assignments:
                        staff_assignments_at_time.append(self.assignments[(client['id'], staff['id'], time_slot)])
                
                if staff_assignments_at_time:
                    self.model.Add(sum(staff_assignments_at_time) <= 1)
    
    def _add_skill_match_constraints(self):
        """Staff must have required skills for client assignments"""
        # Implementation depends on how client requirements and staff skills are matched
        pass
    
    def _add_travel_time_constraints(self):
        """Staff must have enough time to travel between assignments"""
        for staff in self.staff:
            for time_slot_idx in range(len(self.time_slots) - 1):
                current_time_slot = self.time_slots[time_slot_idx]
                next_time_slot = self.time_slots[time_slot_idx + 1]
                
                # For each pair of clients
                for client1 in self.clients:
                    for client2 in self.clients:
                        if client1['id'] == client2['id']:
                            continue
                        
                        # Get travel time between these clients
                        travel_time = self._get_travel_time(client1['id'], client2['id'])
                        
                        # If travel time is greater than time between slots, add constraint
                        time_between_slots = (next_time_slot - current_time_slot).total_seconds() / 60
                        if travel_time > time_between_slots:
                            # Staff cannot be assigned to client1 at current_time_slot
                            # and client2 at next_time_slot
                            assignment1 = self.assignments.get((client1['id'], staff['id'], current_time_slot))
                            assignment2 = self.assignments.get((client2['id'], staff['id'], next_time_slot))
                            
                            if assignment1 is not None and assignment2 is not None:
                                self.model.Add(assignment1 + assignment2 <= 1)
    
    def _add_key_availability_constraints(self):
        """Staff must have access to keys for client homes"""
        # Implementation depends on key management system
        pass
    
    def _add_client_preference_constraints(self):
        """Add soft constraints for client preferences"""
        # Implementation depends on how preferences are weighted
        pass
    
    def _get_travel_time(self, client1_id, client2_id):
        """Get travel time between two client locations"""
        # Look up travel time from database or calculate if not available
        # This is a simplified implementation
        for travel_time in self.travel_times:
            if (travel_time['from_location_id'] == client1_id and 
                travel_time['to_location_id'] == client2_id):
                return travel_time['travel_time']
        
        # Default value if not found
        return 30  # 30 minutes default
    
    def set_objective(self):
        """Set the optimization objective"""
        # Primary objective: Maximize number of assignments
        total_assignments = []
        for assignment in self.assignments.values():
            total_assignments.append(assignment)
        
        self.model.Maximize(sum(total_assignments))
    
    def solve(self):
        """Solve the scheduling problem"""
        status = self.solver.Solve(self.model)
        
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            return self._extract_solution()
        else:
            return None
    
    def _extract_solution(self):
        """Extract the solution from the solver"""
        schedule = []
        
        for (client_id, staff_id, time_slot), var in self.assignments.items():
            if self.solver.Value(var) == 1:
                schedule.append({
                    'client_id': client_id,
                    'staff_id': staff_id,
                    'start_time': time_slot,
                    'end_time': time_slot + timedelta(minutes=60)  # Assuming 1-hour appointments
                })
        
        return schedule
    
    def optimize_key_handovers(self, schedule):
        """Optimize key handovers based on the generated schedule"""
        # Implementation for key handover optimization
        pass
    
    def save_schedule(self, schedule, schedule_name):
        """Save the generated schedule to the database"""
        # Create a new schedule record
        schedule_id = self._create_schedule_record(schedule_name)
        
        # Create appointment records
        for appointment in schedule:
            self._create_appointment_record(
                schedule_id,
                appointment['client_id'],
                appointment['staff_id'],
                appointment['start_time'],
                appointment['end_time']
            )
        
        return schedule_id
    
    def _create_schedule_record(self, name):
        """Create a new schedule record in the database"""
        # SQL query to insert schedule
        query = """
        INSERT INTO schedules (name, start_date, end_date, status, created_by)
        VALUES (%s, %s, %s, 'draft', %s)
        RETURNING id
        """
        params = (
            name,
            self.time_slots[0].date(),
            self.time_slots[-1].date(),
            1  # Assuming user ID 1 for now
        )
        
        # Execute query and return the new schedule ID
        result = self.db.execute_query(query, params)
        return result[0]['id']
    
    def _create_appointment_record(self, schedule_id, client_id, staff_id, start_time, end_time):
        """Create a new appointment record in the database"""
        # SQL query to insert appointment
        query = """
        INSERT INTO appointments (schedule_id, client_id, staff_id, start_time, end_time, status)
        VALUES (%s, %s, %s, %s, %s, 'scheduled')
        RETURNING id
        """
        params = (
            schedule_id,
            client_id,
            staff_id,
            start_time,
            end_time
        )
        
        # Execute query and return the new appointment ID
        result = self.db.execute_query(query, params)
        return result[0]['id']
```

### Route Optimization Component

```python
def optimize_routes(self, staff_id, appointments):
    """Optimize the route for a staff member's daily appointments"""
    # Create the routing index manager
    manager = pywrapcp.RoutingIndexManager(
        len(appointments) + 1,  # +1 for depot (staff home)
        1,  # Number of vehicles (1 staff member)
        0   # Depot index
    )
    
    # Create Routing Model
    routing = pywrapcp.RoutingModel(manager)
    
    # Create and register a transit callback
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        
        if from_node == 0 and to_node == 0:
            return 0
        
        if from_node == 0:
            # Distance from staff home to first appointment
            client_id = appointments[to_node - 1]['client_id']
            return self._get_travel_time_from_staff_home(staff_id, client_id)
        
        if to_node == 0:
            # Distance from last appointment to staff home
            client_id = appointments[from_node - 1]['client_id']
            return self._get_travel_time_to_staff_home(client_id, staff_id)
        
        # Distance between two appointm
(Content truncated due to size limit. Use line ranges to read in chunks)