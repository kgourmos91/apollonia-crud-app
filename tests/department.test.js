const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Department = require('../models/Department');

beforeAll(async () => {
    await Department.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Department API', () => {
    let deptId;

    it('should create a new department', async () => {
        const res = await request(app).post('/api/departments').send({ name: 'Test Department' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Test Department');
        deptId = res.body._id;
    });

    it('should fail to create duplicate department', async () => {
        const res = await request(app).post('/api/departments').send({ name: 'Test Department' });
        expect(res.statusCode).toBe(400);
    });

    it('should get all departments', async () => {
        const res = await request(app).get('/api/departments');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a department by ID', async () => {
        const res = await request(app).get(`/api/departments/${deptId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(deptId);
    });

    it('should return 404 for non-existent department', async () => {
        const res = await request(app).get('/api/departments/000000000000000000000000');
        expect(res.statusCode).toBe(404);
    });

    it('should update department name', async () => {
        const res = await request(app).put(`/api/departments/${deptId}`).send({ name: 'Updated Department' });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Department');
    });

    it('should delete the department', async () => {
        const res = await request(app).delete(`/api/departments/${deptId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Deleted');
    });
});
