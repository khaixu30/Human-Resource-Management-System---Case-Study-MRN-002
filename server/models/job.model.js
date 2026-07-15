import mongoose from 'mongoose';

const jobSchema = new mongooseSchema({
    designationId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {timestamps: true});

const Job = mongoose.model('Job', jobSchema);

export default Job;