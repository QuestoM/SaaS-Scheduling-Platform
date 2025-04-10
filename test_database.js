// Unit tests for database operations
// test_database.js

const { expect } = require('chai');
const sinon = require('sinon');
const { 
  ClientRepository,
  StaffRepository,
  ScheduleRepository,
  KeyRepository
} = require('../database/repositories');

describe('Database Operations', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('Client Repository', () => {
    let clientRepo;
    let mockDb;
    
    beforeEach(() => {
      mockDb = {
        query: sandbox.stub(),
        one: sandbox.stub(),
        manyOrNone: sandbox.stub(),
        none: sandbox.stub()
      };
      
      clientRepo = new ClientRepository(mockDb);
    });
    
    it('should get all active clients', async () => {
      const mockClients = [
        { id: 1, first_name: 'John', last_name: 'Doe', status: 'active' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', status: 'active' }
      ];
      
      mockDb.manyOrNone.resolves(mockClients);
      
      const result = await clientRepo.getAllActive();
      
      expect(result).to.deep.equal(mockClients);
      expect(mockDb.manyOrNone.calledOnce).to.be.true;
      expect(mockDb.manyOrNone.firstCall.args[0]).to.include("WHERE status = 'active'");
    });
    
    it('should get client by id', async () => {
      const mockClient = { id: 1, first_name: 'John', last_name: 'Doe', status: 'active' };
      
      mockDb.one.resolves(mockClient);
      
      const result = await clientRepo.getById(1);
      
      expect(result).to.deep.equal(mockClient);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('WHERE id = $1');
      expect(mockDb.one.firstCall.args[1]).to.deep.equal([1]);
    });
    
    it('should create new client', async () => {
      const newClient = { 
        first_name: 'Alice', 
        last_name: 'Johnson', 
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip_code: '12345',
        phone: '555-123-4567',
        status: 'active'
      };
      
      const createdClient = { id: 3, ...newClient };
      
      mockDb.one.resolves(createdClient);
      
      const result = await clientRepo.create(newClient);
      
      expect(result).to.deep.equal(createdClient);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('INSERT INTO clients');
      expect(mockDb.one.firstCall.args[0]).to.include('RETURNING *');
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
        phone: '555-987-6543',
        status: 'active'
      };
      
      mockDb.one.resolves(updatedClient);
      
      const result = await clientRepo.update(clientId, updates);
      
      expect(result).to.deep.equal(updatedClient);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('UPDATE clients');
      expect(mockDb.one.firstCall.args[0]).to.include('WHERE id = $1');
      expect(mockDb.one.firstCall.args[0]).to.include('RETURNING *');
    });
    
    it('should delete client', async () => {
      const clientId = 1;
      
      mockDb.none.resolves();
      
      await clientRepo.delete(clientId);
      
      expect(mockDb.none.calledOnce).to.be.true;
      expect(mockDb.none.firstCall.args[0]).to.include('DELETE FROM clients');
      expect(mockDb.none.firstCall.args[0]).to.include('WHERE id = $1');
      expect(mockDb.none.firstCall.args[1]).to.deep.equal([clientId]);
    });
  });
  
  describe('Staff Repository', () => {
    let staffRepo;
    let mockDb;
    
    beforeEach(() => {
      mockDb = {
        query: sandbox.stub(),
        one: sandbox.stub(),
        manyOrNone: sandbox.stub(),
        none: sandbox.stub()
      };
      
      staffRepo = new StaffRepository(mockDb);
    });
    
    it('should get all active staff', async () => {
      const mockStaff = [
        { id: 101, first_name: 'Sarah', last_name: 'Jones', status: 'active' },
        { id: 102, first_name: 'Mike', last_name: 'Brown', status: 'active' }
      ];
      
      mockDb.manyOrNone.resolves(mockStaff);
      
      const result = await staffRepo.getAllActive();
      
      expect(result).to.deep.equal(mockStaff);
      expect(mockDb.manyOrNone.calledOnce).to.be.true;
      expect(mockDb.manyOrNone.firstCall.args[0]).to.include("WHERE status = 'active'");
    });
    
    it('should get staff with skills', async () => {
      const mockStaffWithSkills = [
        { 
          id: 101, 
          first_name: 'Sarah', 
          last_name: 'Jones', 
          skills: [
            { id: 1, name: 'Bathing', level: 'expert' },
            { id: 2, name: 'Medication', level: 'intermediate' }
          ]
        }
      ];
      
      mockDb.manyOrNone.resolves(mockStaffWithSkills);
      
      const result = await staffRepo.getAllWithSkills();
      
      expect(result).to.deep.equal(mockStaffWithSkills);
      expect(mockDb.manyOrNone.calledOnce).to.be.true;
      expect(mockDb.manyOrNone.firstCall.args[0]).to.include('JOIN staff_skills');
      expect(mockDb.manyOrNone.firstCall.args[0]).to.include('JOIN skills');
    });
  });
  
  describe('Schedule Repository', () => {
    let scheduleRepo;
    let mockDb;
    
    beforeEach(() => {
      mockDb = {
        query: sandbox.stub(),
        one: sandbox.stub(),
        manyOrNone: sandbox.stub(),
        none: sandbox.stub()
      };
      
      scheduleRepo = new ScheduleRepository(mockDb);
    });
    
    it('should create new schedule', async () => {
      const newSchedule = { 
        name: 'Week 18 Schedule',
        start_date: '2023-05-01',
        end_date: '2023-05-07',
        status: 'draft',
        created_by: 1
      };
      
      const createdSchedule = { id: 1, ...newSchedule };
      
      mockDb.one.resolves(createdSchedule);
      
      const result = await scheduleRepo.create(newSchedule);
      
      expect(result).to.deep.equal(createdSchedule);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('INSERT INTO schedules');
      expect(mockDb.one.firstCall.args[0]).to.include('RETURNING *');
    });
    
    it('should get schedule with appointments', async () => {
      const scheduleId = 1;
      const mockSchedule = { 
        id: 1, 
        name: 'Week 18 Schedule',
        start_date: '2023-05-01',
        end_date: '2023-05-07',
        status: 'published',
        appointments: [
          {
            id: 101,
            client_id: 1,
            staff_id: 101,
            start_time: '2023-05-01T09:00:00Z',
            end_time: '2023-05-01T10:00:00Z'
          },
          {
            id: 102,
            client_id: 2,
            staff_id: 102,
            start_time: '2023-05-01T11:00:00Z',
            end_time: '2023-05-01T12:00:00Z'
          }
        ]
      };
      
      mockDb.one.resolves(mockSchedule);
      
      const result = await scheduleRepo.getWithAppointments(scheduleId);
      
      expect(result).to.deep.equal(mockSchedule);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('JOIN appointments');
      expect(mockDb.one.firstCall.args[0]).to.include('WHERE schedules.id = $1');
    });
    
    it('should update schedule status', async () => {
      const scheduleId = 1;
      const newStatus = 'published';
      
      const updatedSchedule = { 
        id: 1, 
        name: 'Week 18 Schedule',
        status: 'published'
      };
      
      mockDb.one.resolves(updatedSchedule);
      
      const result = await scheduleRepo.updateStatus(scheduleId, newStatus);
      
      expect(result).to.deep.equal(updatedSchedule);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('UPDATE schedules');
      expect(mockDb.one.firstCall.args[0]).to.include('SET status = $2');
      expect(mockDb.one.firstCall.args[0]).to.include('WHERE id = $1');
      expect(mockDb.one.firstCall.args[1]).to.deep.equal([scheduleId, newStatus]);
    });
  });
  
  describe('Key Repository', () => {
    let keyRepo;
    let mockDb;
    
    beforeEach(() => {
      mockDb = {
        query: sandbox.stub(),
        one: sandbox.stub(),
        manyOrNone: sandbox.stub(),
        none: sandbox.stub()
      };
      
      keyRepo = new KeyRepository(mockDb);
    });
    
    it('should get all active keys', async () => {
      const mockKeys = [
        { id: 201, client_id: 1, key_type: 'physical', status: 'active' },
        { id: 202, client_id: 2, key_type: 'code', status: 'active' }
      ];
      
      mockDb.manyOrNone.resolves(mockKeys);
      
      const result = await keyRepo.getAllActive();
      
      expect(result).to.deep.equal(mockKeys);
      expect(mockDb.manyOrNone.calledOnce).to.be.true;
      expect(mockDb.manyOrNone.firstCall.args[0]).to.include("WHERE status = 'active'");
    });
    
    it('should create key handover', async () => {
      const newHandover = { 
        key_id: 201,
        from_staff_id: 101,
        to_staff_id: 102,
        handover_time: '2023-05-01T13:00:00Z',
        status: 'pending'
      };
      
      const createdHandover = { id: 301, ...newHandover };
      
      mockDb.one.resolves(createdHandover);
      
      const result = await keyRepo.createHandover(newHandover);
      
      expect(result).to.deep.equal(createdHandover);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('INSERT INTO key_handovers');
      expect(mockDb.one.firstCall.args[0]).to.include('RETURNING *');
    });
    
    it('should update key handover status', async () => {
      const handoverId = 301;
      const newStatus = 'completed';
      
      const updatedHandover = { 
        id: 301, 
        key_id: 201,
        status: 'completed'
      };
      
      mockDb.one.resolves(updatedHandover);
      
      const result = await keyRepo.updateHandoverStatus(handoverId, newStatus);
      
      expect(result).to.deep.equal(updatedHandover);
      expect(mockDb.one.calledOnce).to.be.true;
      expect(mockDb.one.firstCall.args[0]).to.include('UPDATE key_handovers');
      expect(mockDb.one.firstCall.args[0]).to.include('SET status = $2');
      expect(mockDb.one.firstCall.args[1]).to.deep.equal([handoverId, newStatus]);
    });
  });
});
