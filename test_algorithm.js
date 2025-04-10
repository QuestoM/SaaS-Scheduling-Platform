// Unit tests for scheduling algorithm components
// test_algorithm.js

const { expect } = require('chai');
const { 
  matchClientsWithStaff,
  calculateTravelTime,
  optimizeSchedule,
  manageKeyHandovers
} = require('../algorithm/scheduler');

describe('Scheduling Algorithm', () => {
  describe('Client-Staff Matching', () => {
    it('should match clients with staff based on required skills', () => {
      const clients = [
        { id: 1, required_skills: [1, 3] },
        { id: 2, required_skills: [2] }
      ];
      
      const staff = [
        { id: 101, skills: [1, 2] },
        { id: 102, skills: [2, 3] }
      ];
      
      const result = matchClientsWithStaff(clients, staff);
      
      expect(result).to.be.an('object');
      expect(result[1]).to.include(101); // Client 1 matched with Staff 101 (skill 1)
      expect(result[1]).to.include(102); // Client 1 matched with Staff 102 (skill 3)
      expect(result[2]).to.include(101); // Client 2 matched with Staff 101 (skill 2)
      expect(result[2]).to.include(102); // Client 2 matched with Staff 102 (skill 2)
    });
    
    it('should prioritize staff with more matching skills', () => {
      const clients = [
        { id: 1, required_skills: [1, 2, 3] }
      ];
      
      const staff = [
        { id: 101, skills: [1, 2] },
        { id: 102, skills: [1, 2, 3] }
      ];
      
      const result = matchClientsWithStaff(clients, staff);
      
      expect(result[1][0]).to.equal(102); // Staff 102 should be first choice (has all skills)
      expect(result[1][1]).to.equal(101); // Staff 101 should be second choice (has some skills)
    });
  });
  
  describe('Travel Time Calculation', () => {
    it('should calculate travel time between locations', () => {
      const locations = {
        1: { latitude: 40.7128, longitude: -74.0060 }, // New York
        2: { latitude: 34.0522, longitude: -118.2437 } // Los Angeles
      };
      
      const result = calculateTravelTime(locations[1], locations[2]);
      
      // Approximate travel time between NY and LA (in minutes)
      expect(result).to.be.above(240); // Should be more than 4 hours
    });
    
    it('should return cached travel time if available', () => {
      const travelTimeCache = {
        '1-2': 180, // 3 hours cached time
      };
      
      const result = calculateTravelTime({ id: 1 }, { id: 2 }, travelTimeCache);
      
      expect(result).to.equal(180);
    });
  });
  
  describe('Schedule Optimization', () => {
    it('should create a valid schedule with no conflicts', () => {
      const clients = [
        { id: 1, preferred_time: '09:00', duration: 60 },
        { id: 2, preferred_time: '11:00', duration: 60 }
      ];
      
      const staff = [
        { id: 101, available_hours: ['08:00-17:00'] }
      ];
      
      const matches = {
        1: [101],
        2: [101]
      };
      
      const result = optimizeSchedule(clients, staff, matches);
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      
      // Check no time conflicts for same staff
      const staffSchedules = {};
      result.forEach(appt => {
        if (!staffSchedules[appt.staff_id]) {
          staffSchedules[appt.staff_id] = [];
        }
        staffSchedules[appt.staff_id].push({
          start: new Date(`2023-01-01T${appt.start_time}:00`),
          end: new Date(`2023-01-01T${appt.end_time}:00`)
        });
      });
      
      // Check for overlaps
      Object.values(staffSchedules).forEach(schedule => {
        schedule.sort((a, b) => a.start - b.start);
        for (let i = 0; i < schedule.length - 1; i++) {
          expect(schedule[i].end).to.be.at.most(schedule[i+1].start);
        }
      });
    });
  });
  
  describe('Key Management', () => {
    it('should optimize key handovers', () => {
      const schedule = [
        { client_id: 1, staff_id: 101, start_time: '09:00', end_time: '10:00' },
        { client_id: 1, staff_id: 102, start_time: '14:00', end_time: '15:00' },
        { client_id: 2, staff_id: 101, start_time: '11:00', end_time: '12:00' }
      ];
      
      const keys = [
        { id: 201, client_id: 1, current_holder: 101 },
        { id: 202, client_id: 2, current_holder: null }
      ];
      
      const result = manageKeyHandovers(schedule, keys);
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1); // Only one handover needed (key 201 from 101 to 102)
      
      const handover = result[0];
      expect(handover.key_id).to.equal(201);
      expect(handover.from_staff_id).to.equal(101);
      expect(handover.to_staff_id).to.equal(102);
      // Handover should be scheduled between appointments
      expect(handover.handover_time).to.be.at.least('10:00');
      expect(handover.handover_time).to.be.at.most('14:00');
    });
  });
});
