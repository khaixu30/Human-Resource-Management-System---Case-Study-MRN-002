import mongoose from 'mongoose';

const leaveTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    defaultDaysPerYear: {
        type: Number,
        required: true
    }
});

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);

export default LeaveType;