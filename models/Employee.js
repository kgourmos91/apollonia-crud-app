/** This allows an employee to belong to multiple departments */

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/ // Only letters
    },
    lastName: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/ // Only letters
    },
    departments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
        }
    ],
});

module.exports = mongoose.model('Employee', employeeSchema);
