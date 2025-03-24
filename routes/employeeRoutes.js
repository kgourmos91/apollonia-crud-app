const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const auth = require('../middleware/auth'); // ✅ Single import

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().populate('departments');
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST (protected)
router.post('/', auth, async (req, res) => {
    try {
        const { firstName, lastName, departments } = req.body;
        const newEmployee = new Employee({ firstName, lastName, departments });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT (protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE (protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
