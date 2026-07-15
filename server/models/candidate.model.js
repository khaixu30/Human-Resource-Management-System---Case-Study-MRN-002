import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'Job'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'AuthIdentity'
    },
    phone: {
        type: String,
        required: true
    },
    documentsUrl:{
        type: Array
    },
    pipelineStage: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'],
        default: 'Applied'
    },
    interviews: {
        type: Array,
        default: []
    }
}, {timestamps: true});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;