// Enhanced scheduling-algorithm.js with advanced functionality

/**
 * SchedulingAlgorithm class - Handles the complex scheduling logic for home care services
 * Implements advanced features for optimizing schedules, managing keys, and handling constraints
 */
class SchedulingAlgorithm {
    constructor() {
        // Initialize data structures
        this.staff = [];
        this.clients = [];
        this.appointments = [];
        this.keys = [];
        this.locations = {};
        this.travelTimes = {};
        this.constraints = {};
        this.preferences = {};
        this.history = [];
        this.conflicts = [];
        this.templates = {};
        
        // Configuration settings
        this.config = {
            minAppointmentDuration: 15, // minutes
            maxWorkHours: 8, // hours per staff per day
            maxConsecutiveAppointments: 5, // appointments before required break
            requiredBreakDuration: 30, // minutes
            defaultTravelTime: 15, // minutes (when exact time unknown)
            keyHandoverTime: 10, // minutes required for key handover
            appointmentBuffer: 5, // minutes buffer between appointments
            workDayStart: '06:30',
            workDayEnd: '20:00',
            optimizationPriority: 'balanced', // 'travel', 'preferences', 'balanced'
            allowSplitShifts: true,
            considerTrafficPatterns: true,
            respectClientPreferences: true,
            respectStaffPreferences: true,
            enableKeyOptimization: true,
            enableConflictDetection: true,
            enableHistoryTracking: true
        };
    }
    
    /**
     * Initialize the scheduler with data
     */
    async initialize() {
        try {
            // Load data from JSON files
            this.staff = await this.loadData('data/staff.json');
            this.clients = await this.loadData('data/clients.json');
            this.appointments = await this.loadData('data/appointments.json');
            
            // Generate keys data based on clients
            this.generateKeysData();
            
            // Calculate travel times between locations
            this.calculateTravelTimes();
            
            // Load constraints and preferences
            this.loadConstraintsAndPreferences();
            
            // Initialize history tracking
            if (this.config.enableHistoryTracking) {
                this.initializeHistory();
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize scheduler:', error);
            return false;
        }
    }
    
    /**
     * Load data from JSON file
     */
    async loadData(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading data from ${filePath}:`, error);
            // Return empty array as fallback
            return [];
        }
    }
    
    /**
     * Generate keys data based on clients
     */
    generateKeysData() {
        this.keys = this.clients
            .filter(client => client.keyNumber)
            .map(client => ({
                id: client.keyNumber,
                clientId: client.id,
                clientName: client.name,
                currentHolder: this.getKeyHolder(client.keyNumber),
                status: 'active',
                location: client.location,
                notes: client.keyNotes || ''
            }));
    }
    
    /**
     * Get the current holder of a key
     */
    getKeyHolder(keyNumber) {
        // Find staff member who has this key
        const staffWithKey = this.staff.find(staff => 
            staff.hasKeys && staff.hasKeys.includes(keyNumber)
        );
        
        return staffWithKey ? staffWithKey.id : null;
    }
    
    /**
     * Calculate travel times between all client locations
     */
    calculateTravelTimes() {
        // Extract unique locations
        const locations = new Set();
        this.clients.forEach(client => {
            if (client.location) {
                locations.add(client.location);
            }
        });
        
        // Create a map of locations
        this.locations = Array.from(locations).reduce((map, location, index) => {
            map[location] = {
                id: index,
                name: location,
                coordinates: this.getLocationCoordinates(location)
            };
            return map;
        }, {});
        
        // Calculate travel times between all locations
        for (const location1 of Object.values(this.locations)) {
            if (!this.travelTimes[location1.id]) {
                this.travelTimes[location1.id] = {};
            }
            
            for (const location2 of Object.values(this.locations)) {
                if (location1.id === location2.id) {
                    this.travelTimes[location1.id][location2.id] = 0;
                } else {
                    // Calculate travel time based on coordinates
                    const travelTime = this.calculateTravelTimeBetweenLocations(
                        location1.coordinates,
                        location2.coordinates
                    );
                    
                    this.travelTimes[location1.id][location2.id] = travelTime;
                }
            }
        }
    }
    
    /**
     * Get coordinates for a location (simplified for demo)
     */
    getLocationCoordinates(location) {
        // In a real implementation, this would use geocoding or a predefined database
        // For demo purposes, we'll generate pseudo-random coordinates based on the location string
        const hash = this.hashString(location);
        
        return {
            latitude: 57.7 + (hash % 100) / 100,
            longitude: 11.9 + ((hash >> 8) % 100) / 100
        };
    }
    
    /**
     * Simple string hash function
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    /**
     * Calculate travel time between two locations based on coordinates
     */
    calculateTravelTimeBetweenLocations(coord1, coord2) {
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
        const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(coord1.latitude)) * Math.cos(this.deg2rad(coord2.latitude)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        
        // Estimate travel time: assume average speed of 30 km/h in urban areas
        // Add traffic factor based on time of day if enabled
        let travelTime = (distance / 30) * 60; // Convert to minutes
        
        // Round to nearest minute and ensure minimum travel time
        return Math.max(5, Math.round(travelTime));
    }
    
    /**
     * Convert degrees to radians
     */
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    /**
     * Load constraints and preferences
     */
    loadConstraintsAndPreferences() {
        // In a real implementation, this would load from a database
        // For demo purposes, we'll generate some sample constraints and preferences
        
        // Staff constraints (e.g., working hours, skills, etc.)
        this.staff.forEach(staff => {
            this.constraints[`staff_${staff.id}`] = {
                workingHours: staff.workingHours || {
                    start: this.config.workDayStart,
                    end: this.config.workDayEnd
                },
                maxAppointments: staff.maxAppointments || 10,
                skills: staff.skills || [],
                transportMode: staff.transportMode || 'car',
                transportSpeed: staff.transportMode === 'car' ? 1 : 1.5, // Car is baseline, public transport takes 1.5x longer
                unavailableTimes: staff.unavailableTimes || []
            };
        });
        
        // Client preferences (e.g., preferred staff, time windows, etc.)
        this.clients.forEach(client => {
            this.preferences[`client_${client.id}`] = {
                preferredStaff: client.preferredStaff || [],
                preferredTimeWindows: client.preferredTimeWindows || [],
                serviceRequirements: client.serviceRequirements || {},
                notes: client.notes || ''
            };
        });
    }
    
    /**
     * Initialize history tracking
     */
    initializeHistory() {
        this.history = [];
        this.currentHistoryIndex = -1;
    }
    
    /**
     * Record a change in history
     */
    recordHistory(action, data) {
        if (!this.config.enableHistoryTracking) return;
        
        // If we're not at the end of the history, truncate it
        if (this.currentHistoryIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentHistoryIndex + 1);
        }
        
        // Add the new action to history
        this.history.push({
            timestamp: new Date(),
            action,
            data
        });
        
        // Update current index
        this.currentHistoryIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 100) {
            this.history.shift();
            this.currentHistoryIndex--;
        }
    }
    
    /**
     * Undo the last action
     */
    undo() {
        if (!this.config.enableHistoryTracking || this.currentHistoryIndex < 0) {
            return false;
        }
        
        const action = this.history[this.currentHistoryIndex];
        this.currentHistoryIndex--;
        
        // Apply the reverse of the action
        this.applyReverseAction(action);
        
        return true;
    }
    
    /**
     * Redo a previously undone action
     */
    redo() {
        if (!this.config.enableHistoryTracking || this.currentHistoryIndex >= this.history.length - 1) {
            return false;
        }
        
        this.currentHistoryIndex++;
        const action = this.history[this.currentHistoryIndex];
        
        // Apply the action
        this.applyAction(action);
        
        return true;
    }
    
    /**
     * Apply the reverse of an action
     */
    applyReverseAction(action) {
        switch (action.action) {
            case 'addAppointment':
                // Remove the appointment
                this.appointments = this.appointments.filter(a => a.id !== action.data.id);
                break;
                
            case 'updateAppointment':
                // Restore the previous state
                const index = this.appointments.findIndex(a => a.id === action.data.new.id);
                if (index !== -1) {
                    this.appointments[index] = action.data.old;
                }
                break;
                
            case 'deleteAppointment':
                // Restore the deleted appointment
                this.appointments.push(action.data);
                break;
                
            case 'moveAppointment':
                // Restore the previous position
                const moveIndex = this.appointments.findIndex(a => a.id === action.data.id);
                if (moveIndex !== -1) {
                    this.appointments[moveIndex].staffId = action.data.oldStaffId;
                    this.appointments[moveIndex].startTime = action.data.oldStartTime;
                    this.appointments[moveIndex].endTime = action.data.oldEndTime;
                }
                break;
                
            case 'optimizeSchedule':
                // Restore the previous schedule
                this.appointments = [...action.data.oldSchedule];
                break;
        }
    }
    
    /**
     * Apply an action
     */
    applyAction(action) {
        switch (action.action) {
            case 'addAppointment':
                // Add the appointment
                this.appointments.push(action.data);
                break;
                
            case 'updateAppointment':
                // Apply the update
                const index = this.appointments.findIndex(a => a.id === action.data.new.id);
                if (index !== -1) {
                    this.appointments[index] = action.data.new;
                }
                break;
                
            case 'deleteAppointment':
                // Remove the appointment
                this.appointments = this.appointments.filter(a => a.id !== action.data.id);
                break;
                
            case 'moveAppointment':
                // Apply the move
                const moveIndex = this.appointments.findIndex(a => a.id === action.data.id);
                if (moveIndex !== -1) {
                    this.appointments[moveIndex].staffId = action.data.newStaffId;
                    this.appointments[moveIndex].startTime = action.data.newStartTime;
                    this.appointments[moveIndex].endTime = action.data.newEndTime;
                }
                break;
                
            case 'optimizeSchedule':
                // Apply the optimized schedule
                this.appointments = [...action.data.newSchedule];
                break;
        }
    }
    
    /**
     * Generate a schedule for a specific date
     */
    async generateSchedule(date) {
        try {
            // Filter appointments for the specified date
            const dateAppointments = this.appointments.filter(a => a.date === date);
            
            // Check if we need to optimize the schedule
            if (this.shouldOptimizeSchedule(dateAppointments)) {
                // Save the current schedule for history
                const oldSchedule = [...dateAppointments];
                
                // Optimize the schedule
                const optimizedAppointments = this.optimizeSchedule(dateAppointments);
                
                // Record the optimization in history
                this.recordHistory('optimizeSchedule', {
                    date,
                    oldSchedule,
                    newSchedule: optimizedAppointments
                });
                
                // Update the appointments with the optimized schedule
                this.updateAppointmentsWithOptimized(optimizedAppointments);
                
                return optimizedAppointments;
            }
            
            return dateAppointments;
        } catch (error) {
            console.error('Failed to generate schedule:', error);
            return [];
        }
    }
    
    /**
     * Determine if the schedule should be optimized
     */
    shouldOptimizeSchedule(appointments) {
        // Check for conflicts
        const conflicts = this.detectConflicts(appointments);
        if (conflicts.length > 0) {
            return true;
        }
        
        // Check for inefficient travel times
        const inefficientTravel = this.detectInefficientTravel(appointments);
        if (inefficientTravel) {
            return true;
        }
        
        // Check for unbalanced workloads
        const unbalancedWorkload = this.detectUnbalancedWorkload(appointments);
        if (unbalancedWorkload) {
            r
(Content truncated due to size limit. Use line ranges to read in chunks)