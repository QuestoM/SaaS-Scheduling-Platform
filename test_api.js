// Unit tests for API endpoints
// test_api.js

const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../api/app');
const { 
  ClientService,
  StaffService,
  ScheduleService,
  KeyService
} = require('../api/services');

describe('API Endpoints', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('Authentication', () => {
    it('should authenticate user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'coordinator@example.com',
          password: 'password123'
        });
      
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('role', 'coordinator');
    });
    
    it('should reject authentication with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'coordinator@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
    
    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/v1/clients');
      
      expect(response.status).to.equal(401);
    });
  });
  
  describe('Client API', () => {
    let clientServiceStub;
    const testToken = 'test-token';
    
    beforeEach(() => {
      clientServiceStub = sandbox.stub(ClientService.prototype);
      app.set('clientService', { getInstance: () => clientServiceStub });
    });
    
    it('should get all clients', async () => {
      const mockClients = [
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
      ];
      
      clientServiceStub.getAllClients.resolves(mockClients);
      
      const response = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockClients);
      expect(clientServiceStub.getAllClients.calledOnce).to.be.true;
    });
    
    it('should get client by id', async () => {
      const mockClient = { id: 1, first_name: 'John', last_name: 'Doe' };
      
      clientServiceStub.getClientById.resolves(mockClient);
      
      const response = await request(app)
        .get('/api/v1/clients/1')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockClient);
      expect(clientServiceStub.getClientById.calledWith(1)).to.be.true;
    });
    
    it('should create new client', async () => {
      const newClient = { 
        first_name: 'Alice', 
        last_name: 'Johnson', 
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip_code: '12345',
        phone: '555-123-4567'
      };
      
      const createdClient = { id: 3, ...newClient };
      
      clientServiceStub.createClient.resolves(createdClient);
      
      const response = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newClient);
      
      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(createdClient);
      expect(clientServiceStub.createClient.calledWith(newClient)).to.be.true;
    });
    
    it('should update client', async () => {
      const clientId = 1;
      const updates = { 
        phone: '555-987-6543',
        address: '456 Oak Ave'
      };
      
      const updatedClient = { 
        id: 1, 
        first_name: 'John', 
        last_name: 'Doe', 
        address: '456 Oak Ave',
        phone: '555-987-6543'
      };
      
      clientServiceStub.updateClient.resolves(updatedClient);
      
      const response = await request(app)
        .put('/api/v1/clients/1')
        .set('Authorization', `Bearer ${testToken}`)
        .send(updates);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(updatedClient);
      expect(clientServiceStub.updateClient.calledWith(clientId, updates)).to.be.true;
    });
    
    it('should delete client', async () => {
      const clientId = 1;
      
      clientServiceStub.deleteClient.resolves({ success: true });
      
      const response = await request(app)
        .delete('/api/v1/clients/1')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(clientServiceStub.deleteClient.calledWith(clientId)).to.be.true;
    });
  });
  
  describe('Schedule API', () => {
    let scheduleServiceStub;
    const testToken = 'test-token';
    
    beforeEach(() => {
      scheduleServiceStub = sandbox.stub(ScheduleService.prototype);
      app.set('scheduleService', { getInstance: () => scheduleServiceStub });
    });
    
    it('should generate new schedule', async () => {
      const scheduleParams = {
        name: 'Week 18 Schedule',
        start_date: '2023-05-01',
        end_date: '2023-05-07',
        optimization_parameters: {
          travel_weight: 0.6,
          preference_weight: 0.3,
          workload_weight: 0.1
        }
      };
      
      const generatedSchedule = { 
        id: 1, 
        name: 'Week 18 Schedule',
        start_date: '2023-05-01',
        end_date: '2023-05-07',
        status: 'draft',
        appointments: [
          {
            id: 101,
            client_id: 1,
            staff_id: 101,
            start_time: '2023-05-01T09:00:00Z',
            end_time: '2023-05-01T10:00:00Z'
          }
        ]
      };
      
      scheduleServiceStub.generateSchedule.resolves(generatedSchedule);
      
      const response = await request(app)
        .post('/api/v1/schedules/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send(scheduleParams);
      
      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(generatedSchedule);
      expect(scheduleServiceStub.generateSchedule.calledWith(scheduleParams)).to.be.true;
    });
    
    it('should publish schedule', async () => {
      const scheduleId = 1;
      
      const publishedSchedule = { 
        id: 1, 
        name: 'Week 18 Schedule',
        status: 'published'
      };
      
      scheduleServiceStub.publishSchedule.resolves(publishedSchedule);
      
      const response = await request(app)
        .put('/api/v1/schedules/1/publish')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(publishedSchedule);
      expect(scheduleServiceStub.publishSchedule.calledWith(scheduleId)).to.be.true;
    });
    
    it('should optimize key handovers for schedule', async () => {
      const scheduleId = 1;
      
      const keyHandovers = [
        {
          id: 301,
          key_id: 201,
          from_staff_id: 101,
          to_staff_id: 102,
          handover_time: '2023-05-01T13:00:00Z',
          status: 'pending'
        }
      ];
      
      scheduleServiceStub.optimizeKeyHandovers.resolves(keyHandovers);
      
      const response = await request(app)
        .post('/api/v1/schedules/1/optimize-keys')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(keyHandovers);
      expect(scheduleServiceStub.optimizeKeyHandovers.calledWith(scheduleId)).to.be.true;
    });
  });
  
  describe('Key Management API', () => {
    let keyServiceStub;
    const testToken = 'test-token';
    
    beforeEach(() => {
      keyServiceStub = sandbox.stub(KeyService.prototype);
      app.set('keyService', { getInstance: () => keyServiceStub });
    });
    
    it('should get all keys', async () => {
      const mockKeys = [
        { id: 201, client_id: 1, key_type: 'physical', status: 'active' },
        { id: 202, client_id: 2, key_type: 'code', status: 'active' }
      ];
      
      keyServiceStub.getAllKeys.resolves(mockKeys);
      
      const response = await request(app)
        .get('/api/v1/keys')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockKeys);
      expect(keyServiceStub.getAllKeys.calledOnce).to.be.true;
    });
    
    it('should get key handovers', async () => {
      const mockHandovers = [
        {
          id: 301,
          key_id: 201,
          from_staff_id: 101,
          to_staff_id: 102,
          handover_time: '2023-05-01T13:00:00Z',
          status: 'pending'
        }
      ];
      
      keyServiceStub.getKeyHandovers.resolves(mockHandovers);
      
      const response = await request(app)
        .get('/api/v1/keys/handovers')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockHandovers);
      expect(keyServiceStub.getKeyHandovers.calledOnce).to.be.true;
    });
    
    it('should update key handover status', async () => {
      const handoverId = 301;
      const newStatus = 'completed';
      
      const updatedHandover = { 
        id: 301, 
        key_id: 201,
        status: 'completed'
      };
      
      keyServiceStub.updateHandoverStatus.resolves(updatedHandover);
      
      const response = await request(app)
        .put('/api/v1/keys/handovers/301')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: newStatus });
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(updatedHandover);
      expect(keyServiceStub.updateHandoverStatus.calledWith(handoverId, newStatus)).to.be.true;
    });
  });
});
