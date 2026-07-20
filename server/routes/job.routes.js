import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import Job from '../models/job.model.js';

const jobRouter = Router();

jobRouter.post('/job/create', authenticate, authorize(['SuperAdmin', 'HRAdmin']), async (req, res) => {
    try {
        const {
            departmentId,
            designationId,
            description,
            requirements,
            status
        } = req.body;

        const newJob = new Job({
            departmentId,
            designationId,
            description,
            requirements,
            status
        });

        await newJob.save();

        await newJob.populate([
            { path: 'departmenId', select: 'name' },
            { path: 'designationId', select: 'title' }
        ]);

        res.status(201).json({
            success: true,
            message: "Job added!",
            code: 'SUCCESS',
            data: newJob
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        })
    }
});

jobRouter.get('/job', async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('departmentId', 'name')
            .populate('designationId', 'title');
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Job added",
                code: "NOT_FOUND",
            });
        }
        res.status(200).json({ success: true, message: "Jobs Found", code: "SUCCESS", data: jobs });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        })
    }
});

jobRouter.get('/job/open', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' })
            .populate('departmentId', 'name')
            .populate('designationId', 'title');

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No open jobs",
                success: false,
                code: "NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "Jobs found.",
            code: "SUCCESS",
            data: jobs
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            code: "SERVER_FAULT"
        });
    }
});

jobRouter.get('/job/closed', authenticate, authorize(['SuperAdmin', 'HRAdmin']), async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'closed' })
            .populate('departmentId', 'name')
            .populate('designationId', 'title');
        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No closed jobs",
                success: false,
                code: "NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "Jobs found",
            code: "SUCCESS",
            data: jobs
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        })
    }
});

jobRouter.patch('/job/edit/:id', authenticate, authorize(['SuperAdmin', 'HRAdmin']), async (req, res) => {
    try{
        const { id } = req.params;
        const { departmentId, designationId, description, requirements, status } = req.body;

        const updateFields = {};
        if (departmentId !== undefined) updateFields.departmentId = departmentId;
        if (designationId !== undefined) updateFields.designationId = designationId;
        if (description !== undefined) updateFields.description = description;
        if (requirements !== undefined) updateFields.requirements = requirements;
        if (status !== undefined) updateFields.status = status;

        const updatedJob = await Job.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true })
            .populate('departmentId', 'name')
            .populate('designationId', 'title');

        if(!updatedJob){
            return res.status(404).json({
                success: false,
                message: "Job not found",
                code: "NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job updated",
            code: "SUCCESS",
            data: updatedJob
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        })
    }
});

export default jobRouter;