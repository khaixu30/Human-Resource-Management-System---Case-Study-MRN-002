import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
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

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalDays: {
        type: Number,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },

    appliedAt: {
        type: Date,
        default: Date.now
    },

    decidedAt: {
        type: Date,
        default: null
    }
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;