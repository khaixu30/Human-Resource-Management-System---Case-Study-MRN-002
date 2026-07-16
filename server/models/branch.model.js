// Branches of the company - Like Isb Branch , Rwp Branch

import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true
    },

    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }]
}, {
    timestamps: true
});

const Branch = mongoose.model(
    "Branch",
    branchSchema
);

export default Branch;