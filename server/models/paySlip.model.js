import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    month: {
        type: Number,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    grossPay: {
        type: Number,
        required: true
    },

    totalDeductions: {
        type: Number,
        required: true
    },

    netPay: {
        type: Number,
        required: true
    },

    daysPresent: {
        type: Number,
        default: 0
    },

    daysAbsent: {
        type: Number,
        default: 0
    },

    leaveDaysDeducted: {
        type: Number,
        default: 0
    },

    generatedAt: {
        type: Date,
        default: Date.now
    },

    pdfUrl: {
        type: String
    }
});

const Payslip = mongoose.model(
    'Payslip',
    payslipSchema
);

export default Payslip;