// Unit tests for frontend components
// test_frontend.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

// Components to test
import Dashboard from '../frontend/components/Dashboard';
import ScheduleCalendar from '../frontend/components/ScheduleCalendar';
import KeyManagement from '../frontend/components/KeyManagement';
import ClientForm from '../frontend/components/ClientForm';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Frontend Components', () => {
  describe('Dashboard Component', () => {
    let store;
    
    beforeEach(() => {
      store = mockStore({
        dashboard: {
          stats: {
            activeStaff: 12,
            appointments: 45,
            completed: 28,
            pending: 17,
            issues: 2
          },
          scheduleStatus: {
            scheduled: 65,
            completed: 30,
            missed: 5
          },
          notifications: [
            {
              id: 1,
              type: 'warning',
              message: 'Key #103 needs to be transferred from John D. to Sarah M.'
            },
            {
              id: 2,
              type: 'warning',
              message: 'Client #45 has requested a schedule change for tomorrow'
            },
            {
              id: 3,
              type: 'info',
              message: 'Staff member Lisa T. is on leave next week'
            }
          ],
          loading: false,
          error: null
        }
      });
    });
    
    it('renders dashboard with correct stats', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </Provider>
      );
      
      // Check that stats are displayed correctly
      expect(screen.getByText('12')).toBeInTheDocument(); // Active Staff
      expect(screen.getByText('45')).toBeInTheDocument(); // Appointments
      expect(screen.getByText('28')).toBeInTheDocument(); // Completed
      expect(screen.getByText('17')).toBeInTheDocument(); // Pending
      expect(screen.getByText('2')).toBeInTheDocument(); // Issues
      
      // Check that notifications are displayed
      expect(screen.getByText('Key #103 needs to be transferred from John D. to Sarah M.')).toBeInTheDocument();
      expect(screen.getByText('Client #45 has requested a schedule change for tomorrow')).toBeInTheDocument();
      expect(screen.getByText('Staff member Lisa T. is on leave next week')).toBeInTheDocument();
    });
    
    it('navigates to correct pages when action buttons are clicked', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </Provider>
      );
      
      // Click the Create Schedule button
      fireEvent.click(screen.getByText('Create Schedule'));
      
      // Check that the correct action was dispatched
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'NAVIGATE',
        payload: '/schedules/create'
      }));
    });
  });
  
  describe('Schedule Calendar Component', () => {
    let store;
    
    beforeEach(() => {
      store = mockStore({
        schedules: {
          currentSchedule: {
            id: 1,
            name: 'Week 18 Schedule',
            start_date: '2023-05-01',
            end_date: '2023-05-07',
            status: 'draft',
            appointments: [
              {
                id: 101,
                client_id: 1,
                client_name: 'John Doe',
                staff_id: 101,
                staff_name: 'Sarah Jones',
                start_time: '2023-05-01T09:00:00Z',
                end_time: '2023-05-01T10:00:00Z',
                service: 'Bathing'
              },
              {
                id: 102,
                client_id: 2,
                client_name: 'Jane Smith',
                staff_id: 102,
                staff_name: 'Mike Brown',
                start_time: '2023-05-01T11:00:00Z',
                end_time: '2023-05-01T12:00:00Z',
                service: 'Medication'
              }
            ]
          },
          staff: [
            { id: 101, name: 'Sarah Jones' },
            { id: 102, name: 'Mike Brown' },
            { id: 103, name: 'Lisa Thompson' }
          ],
          loading: false,
          error: null
        }
      });
    });
    
    it('renders schedule calendar with appointments', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ScheduleCalendar />
          </BrowserRouter>
        </Provider>
      );
      
      // Check that schedule name is displayed
      expect(screen.getByText('Week 18 Schedule')).toBeInTheDocument();
      
      // Check that appointments are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Sarah Jones')).toBeInTheDocument();
      expect(screen.getByText('Bathing')).toBeInTheDocument();
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Mike Brown')).toBeInTheDocument();
      expect(screen.getByText('Medication')).toBeInTheDocument();
    });
    
    it('allows changing view mode', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ScheduleCalendar />
          </BrowserRouter>
        </Provider>
      );
      
      // Click the Week view button
      fireEvent.click(screen.getByText('Week'));
      
      // Check that the correct action was dispatched
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'SET_CALENDAR_VIEW',
        payload: 'week'
      }));
    });
  });
  
  describe('Key Management Component', () => {
    let store;
    
    beforeEach(() => {
      store = mockStore({
        keys: {
          keys: [
            { id: 201, client_id: 1, client_name: 'John Doe', key_type: 'physical', key_identifier: 'K101', status: 'active', current_holder: 'Sarah Jones' },
            { id: 202, client_id: 2, client_name: 'Jane Smith', key_type: 'digital', key_identifier: 'K102', status: 'active', current_holder: 'N/A' }
          ],
          handovers: [
            {
              id: 301,
              key_id: 201,
              key_identifier: 'K101',
              from_staff_id: 101,
              from_staff_name: 'Sarah Jones',
              to_staff_id: 102,
              to_staff_name: 'Mike Brown',
              handover_time: '2023-05-01T13:00:00Z',
              status: 'pending'
            }
          ],
          loading: false,
          error: null
        }
      });
    });
    
    it('renders key management with keys and handovers', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <KeyManagement />
          </BrowserRouter>
        </Provider>
      );
      
      // Check that keys are displayed
      expect(screen.getByText('K101')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('physical')).toBeInTheDocument();
      expect(screen.getByText('Sarah Jones')).toBeInTheDocument();
      
      expect(screen.getByText('K102')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('digital')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      
      // Check that handovers are displayed
      expect(screen.getByText('Sarah Jones → Mike Brown')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
    
    it('allows adding a new key', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <KeyManagement />
          </BrowserRouter>
        </Provider>
      );
      
      // Click the Add New Key button
      fireEvent.click(screen.getByText('Add New Key'));
      
      // Fill in the form
      await waitFor(() => {
        expect(screen.getByLabelText('Client')).toBeInTheDocument();
      });
      
      userEvent.selectOptions(screen.getByLabelText('Client'), '3');
      userEvent.selectOptions(screen.getByLabelText('Key Type'), 'physical');
      userEvent.type(screen.getByLabelText('Key Identifier'), 'K103');
      
      // Submit the form
      fireEvent.click(screen.getByText('Save'));
      
      // Check that the correct action was dispatched
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'ADD_KEY',
        payload: expect.objectContaining({
          client_id: '3',
          key_type: 'physical',
          key_identifier: 'K103'
        })
      }));
    });
  });
  
  describe('Client Form Component', () => {
    let store;
    
    beforeEach(() => {
      store = mockStore({
        clients: {
          loading: false,
          error: null
        }
      });
    });
    
    it('renders empty form for new client', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ClientForm />
          </BrowserRouter>
        </Provider>
      );
      
      // Check that form fields are empty
      expect(screen.getByLabelText('First Name')).toHaveValue('');
      expect(screen.getByLabelText('Last Name')).toHaveValue('');
      expect(screen.getByLabelText('Address')).toHaveValue('');
      expect(screen.getByLabelText('City')).toHaveValue('');
      expect(screen.getByLabelText('State')).toHaveValue('');
      expect(screen.getByLabelText('Zip Code')).toHaveValue('');
      expect(screen.getByLabelText('Phone')).toHaveValue('');
    });
    
    it('validates required fields', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ClientForm />
          </BrowserRouter>
        </Provider>
      );
      
      // Submit the form without filling required fields
      fireEvent.click(screen.getByText('Save Client'));
      
      // Check that validation errors are displayed
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Address is required')).toBeInTheDocument();
        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(screen.getByText('State is required')).toBeInTheDocument();
        expect(screen.getByText('Zip code is required')).toBeInTheDocument();
        expect(screen.getByText('Phone is required')).toBeInTheDocument();
      });
    });
    
    it('submits form with valid data', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ClientForm />
          </BrowserRouter>
        </Provider>
      );
      
      // Fill in the form
      userEvent.type(screen.getByLabelText('First Name'), 'Alice');
      userEvent.type(screen.getByLabelText('Last Name'), 'Johnson');
      userEvent.type(screen.getByLabelText('Address'), '123 Main St');
      userEvent.type(screen.getByLabelText('City'), 'Anytown');
      userEvent.type(screen.getByLabelText('State'), 'CA');
      userEvent.type(screen.getByLabelText('Zip Code'), '12345');
      userEvent.type(screen.getByLabelText('Phone'), '555-123-4567');
      
      // Submit the form
      fireEvent.click(screen.getByText('Save Client'));
      
      // Check that the correct action was dispatched
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'ADD_CLIENT',
        payload: {
          first_name: 'Alice',
          last_name: 'Johnson',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip_code: '12345',
          phone: '555-123-4567'
        }
      }));
    });
  });
});
