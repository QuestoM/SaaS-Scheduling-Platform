// JavaScript for Home Care Scheduling Platform

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Desktop navigation toggle
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // User profile dropdown
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            // Toggle user dropdown menu (to be implemented)
            console.log('User profile clicked');
        });
    }

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log(`Action clicked: ${action}`);
            
            // Handle different actions
            switch(action) {
                case 'Create Schedule':
                    navigateToCreateSchedule();
                    break;
                case 'Optimize Routes':
                    optimizeRoutes();
                    break;
                case 'Manage Keys':
                    navigateToKeyManagement();
                    break;
                default:
                    console.log('Unknown action');
            }
        });
    });

    // Notification handling
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        notification.addEventListener('click', function() {
            // Handle notification click
            console.log('Notification clicked:', this.querySelector('.notification-text').textContent);
        });
    });

    // View all notifications link
    const viewAllLink = document.querySelector('.view-all');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Navigate to notifications page
            console.log('View all notifications clicked');
        });
    }

    // Initialize dashboard data
    initializeDashboard();
});

// Function to initialize dashboard data
function initializeDashboard() {
    // In a real application, this would fetch data from the API
    console.log('Initializing dashboard data');
    
    // Simulate data loading
    setTimeout(() => {
        console.log('Dashboard data loaded');
        // Update UI with loaded data if needed
    }, 500);
}

// Navigation functions
function navigateToCreateSchedule() {
    console.log('Navigating to create schedule page');
    // In a real application, this would navigate to the schedule creation page
    // window.location.href = '/schedules/create';
}

function navigateToKeyManagement() {
    console.log('Navigating to key management page');
    // In a real application, this would navigate to the key management page
    // window.location.href = '/keys';
}

// Action functions
function optimizeRoutes() {
    console.log('Optimizing routes');
    // In a real application, this would trigger the route optimization algorithm
    // and show a loading indicator
    
    // Simulate optimization process
    setTimeout(() => {
        console.log('Routes optimized');
        // Show success message
        showNotification('Routes have been optimized successfully', 'success');
    }, 2000);
}

// Utility functions
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()} notification: ${message}`);
    // In a real application, this would show a toast notification
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast-notification ${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Data fetching functions (to be implemented with real API)
async function fetchDashboardData() {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                activeStaff: 12,
                appointments: 45,
                completed: 28,
                pending: 17,
                issues: 2,
                scheduleStatus: {
                    scheduled: 65,
                    completed: 30,
                    missed: 5
                }
            });
        }, 500);
    });
}

async function fetchNotifications() {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    type: 'warning',
                    message: 'Key #103 needs to be transferred from John D. to Sarah M.'
                },
                {
                    type: 'warning',
                    message: 'Client #45 has requested a schedule change for tomorrow'
                },
                {
                    type: 'info',
                    message: 'Staff member Lisa T. is on leave next week'
                }
            ]);
        }, 500);
    });
}

// Chart rendering (placeholder for future implementation)
function renderStatusChart(data) {
    console.log('Rendering status chart with data:', data);
    // In a real application, this would use a charting library like Chart.js
    // to render the pie chart with the provided data
}

// Responsive behavior
window.addEventListener('resize', function() {
    // Handle responsive layout changes if needed
    const width = window.innerWidth;
    console.log(`Window resized to ${width}px width`);
    
    // Example of responsive behavior
    if (width < 600) {
        console.log('Mobile layout active');
    } else if (width < 960) {
        console.log('Tablet layout active');
    } else {
        console.log('Desktop layout active');
    }
});
