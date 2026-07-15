import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Department'
    }
});

const Designation = mongoose.model('Designation', designationSchema)
export default Designation;