import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthIdentity",
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