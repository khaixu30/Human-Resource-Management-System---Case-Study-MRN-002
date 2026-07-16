// Represents the entire company , In our case only one company (Ezitech) will be there 

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    branches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    }]
}, {
    timestamps: true
});

const Company = mongoose.model(
    "Company",
    companySchema
);

export default Company;