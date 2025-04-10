// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Get all appointment elements
    const appointments = document.querySelectorAll('.appointment');
    const appointmentDetails = document.getElementById('appointmentDetails');
    const closeBtn = document.querySelector('.close-btn');
    
    // Add click event to all appointments
    appointments.forEach(appointment => {
        appointment.addEventListener('click', function() {
            // Show appointment details panel
            appointmentDetails.style.display = 'block';
            
            // In a real implementation, we would fetch the appointment details from the server
            // For now, we'll just show the static details panel
        });
    });
    
    // Close appointment details panel
    closeBtn.addEventListener('click', function() {
        appointmentDetails.style.display = 'none';
    });
    
    // Make appointments draggable
    appointments.forEach(appointment => {
        appointment.setAttribute('draggable', true);
        
        appointment.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', appointment.id);
            appointment.classList.add('dragging');
        });
        
        appointment.addEventListener('dragend', function() {
            appointment.classList.remove('dragging');
        });
    });
    
    // Make staff slots droppable
    const staffSlots = document.querySelectorAll('.staff-slots');
    
    staffSlots.forEach(slot => {
        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        slot.addEventListener('drop', function(e) {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const draggableElement = document.getElementById(id);
            
            if (draggableElement) {
                // Calculate position based on mouse coordinates
                const rect = slot.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                
                // Convert offset to percentage
                const percentage = (offsetX / rect.width) * 100;
                
                // Snap to nearest half-hour
                const snappedPercentage = Math.round(percentage / (100/28)) * (100/28);
                
                // Update position
                draggableElement.style.left = snappedPercentage + '%';
                
                // In a real implementation, we would update the appointment time in the database
                console.log(`Moved appointment ${id} to ${snappedPercentage}%`);
                
                // Show a notification
                showNotification('Appointment moved successfully');
            }
        });
    });
    
    // Add IDs to appointments for drag and drop functionality
    appointments.forEach((appointment, index) => {
        appointment.id = 'appointment-' + index;
    });
    
    // Implement key handover tracking
    const keyHandovers = document.querySelectorAll('.key-handover');
    
    keyHandovers.forEach(handover => {
        handover.addEventListener('click', function() {
            // Show key handover details
            showNotification('Key handover details: Key #103 needs to be transferred');
        });
    });
    
    // Implement filter functionality
    const filterButtons = document.querySelectorAll('.dropdown-btn, .icon-text-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, we would show a dropdown menu or filter dialog
            showNotification('Filter options would appear here');
        });
    });
    
    // Implement action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = button.textContent.trim();
            showNotification(`Action: ${action}`);
        });
    });
    
    // Implement time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Highlight selected time slot
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            
            showNotification(`Selected time: ${slot.textContent}`);
        });
    });
    
    // Implement staff selection
    const staffRows = document.querySelectorAll('.staff-row');
    
    staffRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Only select if clicking on the staff info area, not on appointments
            if (e.target.closest('.staff-info')) {
                staffRows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
                
                const staffName = row.querySelector('.staff-name').textContent;
                showNotification(`Selected staff: ${staffName}`);
            }
        });
    });
    
    // Implement schedule optimization
    const optimizeButton = document.createElement('button');
    optimizeButton.className = 'optimize-btn';
    optimizeButton.innerHTML = '<i class="fas fa-magic"></i> Optimize Schedule';
    document.querySelector('.date-display').appendChild(optimizeButton);
    
    optimizeButton.addEventListener('click', function() {
        showNotification('Optimizing schedule...');
        
        // Simulate optimization process
        setTimeout(() => {
            // In a real implementation, we would call the backend optimization algorithm
            // and update the schedule based on the results
            showNotification('Schedule optimized successfully!');
        }, 2000);
    });
    
    // Helper function to show notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add notification toast styles
    const style = document.createElement('style');
    style.textContent = `
        .notification-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2c3e50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 1000;
        }
        
        .notification-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .optimize-btn {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .optimize-btn:hover {
            background-color: #2980b9;
        }
        
        .selected {
            background-color: #3498db !important;
            color: white !important;
        }
        
        .dragging {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);
    
    // Add real-time clock
    const clockElement = document.createElement('div');
    clockElement.className = 'real-time-clock';
    document.querySelector('.date-display').appendChild(clockElement);
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Update clock every second
    setInterval(updateClock, 1000);
    updateClock(); // Initial update
    
    // Add clock styles
    const clockStyle = document.createElement('style');
    clockStyle.textContent = `
        .real-time-clock {
            position: absolute;
            right: 150px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
        }
    `;
    document.head.appendChild(clockStyle);
    
    // Add current time indicator to schedule
    const currentTimeIndicator = document.createElement('div');
    currentTimeIndicator.className = 'current-time-indicator';
    document.querySelector('.schedule-grid').appendChild(currentTimeIndicator);
    
    function updateTimeIndicator() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Calculate position based on time
        // Schedule starts at 06:30 and ends at 20:00 (13.5 hours = 27 half-hour slots)
        const startMinutes = 6 * 60 + 30;
        const endMinutes = 20 * 60;
        const totalMinutes = endMinutes - startMinutes;
        
        const currentMinutes = hours * 60 + minutes;
        const percentage = ((currentMinutes - startMinutes) / totalMinutes) * 100;
        
        // Only show indicator if current time is within schedule range
        if (percentage >= 0 && percentage <= 100) {
            currentTimeIndicator.style.display = 'block';
            currentTimeIndicator.style.left = percentage + '%';
        } else {
            currentTimeIndicator.style.display = 'none';
        }
    }
    
    // Update time indicator every minute
    setInterval(updateTimeIndicator, 60000);
    updateTimeIndicator(); // Initial update
    
    // Add time indicator styles
    const indicatorStyle = document.createElement('style');
    indicatorStyle.textContent = `
        .current-time-indicator {
            position: absolute;
            top: 0;
            height: 100%;
            width: 2px;
            background-color: #e74c3c;
            z-index: 8;
        }
        
        .current-time-indicator::before {
            content: '';
            position: absolute;
            top: 0;
            left: -4px;
            width: 10px;
            height: 10px;
            background-color: #e74c3c;
            border-radius: 50%;
        }
    `;
    document.head.appendChild(indicatorStyle);
    
    // Add conflict detection
    function detectConflicts() {
        const staffRows = document.querySelectorAll('.staff-row');
        
        staffRows.forEach(row => {
            const appointments = row.querySelectorAll('.appointment');
            
            // Check for overlapping appointments
            for (let i = 0; i < appointments.length; i++) {
                const app1 = appointments[i];
                const left1 = parseFloat(app1.style.left);
                const width1 = parseFloat(app1.style.width);
                const right1 = left1 + width1;
                
                for (let j = i + 1; j < appointments.length; j++) {
                    const app2 = appointments[j];
                    const left2 = parseFloat(app2.style.left);
                    const width2 = parseFloat(app2.style.width);
                    const right2 = left2 + width2;
                    
                    // Check if appointments overlap
                    if (!(right1 <= left2 || right2 <= left1)) {
                        // Mark conflicting appointments
                        app1.classList.add('conflict');
                        app2.classList.add('conflict');
                        
                        showNotification('Schedule conflict detected!');
                    }
                }
            }
        });
    }
    
    // Add conflict styles
    const conflictStyle = document.createElement('style');
    conflictStyle.textContent = `
        .conflict {
            border: 2px solid #e74c3c !important;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
            70% { box-shadow: 0 0 0 5px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
    `;
    document.head.appendChild(conflictStyle);
    
    // Run conflict detection
    setTimeout(detectConflicts, 1000);
    
    // Add "Add Appointment" functionality
    const addAppointmentBtn = document.createElement('button');
    addAppointmentBtn.className = 'add-appointment-btn';
    addAppointmentBtn.innerHTML = '<i class="fas fa-plus"></i> Add Appointment';
    document.querySelector('.date-display').appendChild(addAppointmentBtn);
    
    addAppointmentBtn.addEventListener('click', function() {
        // In a real implementation, we would show a form to create a new appointment
        showNotification('Add appointment form would appear here');
    });
    
    // Add button styles
    const btnStyle = document.createElement('style');
    btnStyle.textContent = `
        .add-appointment-btn {
            position: absolute;
            right: 300px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .add-appointment-btn:hover {
            background-color: #27ae60;
        }
    `;
    document.head.appendChild(btnStyle);
});
