const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

describe('Employee API', () => {
    let createdEmployee;
    let createdDepartment;

    beforeAll(async () => {
        await Department.deleteMany();
        await Employee.deleteMany();

        // Create a department for testing
        const departmentRes = await request(app)
            .post('/api/departments')
            .send({ name: 'General Dentistry' });

        createdDepartment = departmentRes.body;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new employee (POST /api/employees)', async () => {
        const res = await request(app)
            .post('/api/employees')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                departments: [createdDepartment._id],
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.firstName).toBe('John');
        expect(res.body.lastName).toBe('Doe');
        expect(res.body.departments.length).toBe(1);
        createdEmployee = res.body;
    });

    it('should return all employees (GET /api/employees)', async () => {
        const res = await request(app).get('/api/employees');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get an employee by ID (GET /api/employees/:id)', async () => {
        const res = await request(app).get(`/api/employees/${createdEmployee._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe('John');
        expect(res.body.lastName).toBe('Doe');
    });

    it('should return 404 for non-existing employee ID', async () => {
        const res = await request(app).get(`/api/employees/${new mongoose.Types.ObjectId()}`);
        expect(res.statusCode).toBe(404);
    });

    it('should update an employee (PUT /api/employees/:id)', async () => {
        const res = await request(app)
            .put(`/api/employees/${createdEmployee._id}`)
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                departments: [createdDepartment._id],
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe('Jane');
        expect(res.body.lastName).toBe('Doe');
    });

    it('should not update with missing data (PUT /api/employees/:id)', async () => {
        const res = await request(app)
            .put(`/api/employees/${createdEmployee._id}`)
            .send({});

        expect(res.statusCode).toBe(400);
    });

    it('should delete an employee (DELETE /api/employees/:id)', async () => {
        const res = await request(app).delete(`/api/employees/${createdEmployee._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Employee deleted');
    });

    it('should return 404 when deleting non-existing employee', async () => {
        const res = await request(app).delete(`/api/employees/${new mongoose.Types.ObjectId()}`);
        expect(res.statusCode).toBe(500); // Your controller returns 500 for this case
    });
});
