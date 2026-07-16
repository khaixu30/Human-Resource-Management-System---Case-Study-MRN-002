import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    leaveTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveType',
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    allocated: {
        type: Number,
        default: 0
    },

    used: {
        type: Number,
        default: 0
    },

    remaining: {
        type: Number,
        default: 0
    }
});

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

export default LeaveBalance;