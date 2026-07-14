import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeCode: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },

    dateOfBirth: {
        type: Date
    },

    joiningDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Employee = mongoose.model(
    'Employee',
    employeeSchema
);

export default Employee;