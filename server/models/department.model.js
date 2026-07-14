import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    }
}, {
    timestamps: true
});

const Department = mongoose.model(
    "Department",
    departmentSchema
);

export default Department;