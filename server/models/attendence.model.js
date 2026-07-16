import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    checkIn: {
        type: Date
    },

    checkOut: {
        type: Date
    },

    status: {
        type: String,
        enum: ['present', 'late', 'absent', 'half-day', 'on-leave'],
        required: true
    },

    overtimeMinutes: {
        type: Number,
        default: 0
    },

    correctedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthIdentity',
        default: null
    },

    remarks: {
        type: String
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;