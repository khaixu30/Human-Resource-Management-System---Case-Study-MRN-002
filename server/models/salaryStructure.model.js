import mongoose from 'mongoose';

const salaryStructureSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    basicSalary: {
        type: Number,
        required: true
    },

    allowances: [{
        type: {
            type: String
        },
        amount: {
            type: Number
        }
    }],

    deductions: [{
        type: {
            type: String
        },
        amount: {
            type: Number
        }
    }],

    effectiveFrom: {
        type: Date,
        required: true
    }
});

const SalaryStructure = mongoose.model(
    'SalaryStructure',
    salaryStructureSchema
);

export default SalaryStructure;