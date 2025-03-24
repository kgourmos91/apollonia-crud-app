const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./models/Department');
const Employee = require('./models/Employee');

dotenv.config();

const departments = [
    'General Dentistry',
    'Pediatric Dentistry',
    'Restorative Dentistry',
    'Surgery',
    'Orthodontics',
];

const employees = [
    { firstName: 'Lisa', lastName: 'Harris', departments: ['Restorative Dentistry', 'Orthodontics'] },
    { firstName: 'Alfred', lastName: 'Christensen', departments: ['General Dentistry'] },
    { firstName: 'John', lastName: 'Dudley', departments: ['General Dentistry'] },
    { firstName: 'Danny', lastName: 'Perez', departments: ['Restorative Dentistry'] },
    { firstName: 'Sarah', lastName: 'Alvarez', departments: ['Pediatric Dentistry'] },
    { firstName: 'Constance', lastName: 'Smith', departments: ['Surgery'] },
    { firstName: 'Travis', lastName: 'Combs', departments: [] },
    { firstName: 'Francisco', lastName: 'Willard', departments: ['Pediatric Dentistry'] },
    { firstName: 'Janet', lastName: 'Doe', departments: ['General Dentistry'] },
    { firstName: 'Leslie', lastName: 'Roche', departments: ['Orthodontics'] },
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await Department.deleteMany();
        await Employee.deleteMany();

        const createdDepartments = await Department.insertMany(departments.map(name => ({ name })));

        const deptMap = {};
        createdDepartments.forEach(dept => {
            deptMap[dept.name] = dept._id;
        });

        const employeeData = employees.map(emp => ({
            firstName: emp.firstName,
            lastName: emp.lastName,
            departments: emp.departments.map(d => deptMap[d]).filter(Boolean),
        }));

        await Employee.insertMany(employeeData);

        console.log('✅ Seed complete!');
        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Seed error:', err);
        mongoose.connection.close();
    }
}

seedData();
