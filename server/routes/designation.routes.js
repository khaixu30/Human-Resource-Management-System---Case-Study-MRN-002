import {Router} from 'express';
import { authenticate, authorize} from '../middleware/auth.middleware.js';
import Designation from '../models/Designation.model.js';

const designationRouter = Router();

designationRouter.post('/Designation/create', authenticate, authorize(['SuperAdmin', 'HRAdmin']), async (req, res) => {
    try{
        const {title, departmentId} = req.body;
        const newDesignation = new Designation({
            title, departmentId
        });
        await newDesignation.save();

        res.status(201).json({
            success: true,
            message: 'Designation added!',
            code: "SUCCESS",
            data: newDesignation
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            code: "SERVER_FAULT"
        });
    }
});

designationRouter.get('/designation/:id', authenticate, authorize(['SuperAdmin', 'HRAdmin', 'Manager', 'Employee']), async (req, res) => {
    try{
        const id = req.params.id;
        const designation = await Designation.findById(id);
        if(!designation){
            console.log("Deparment Not Found")
            return res.status(404).json({
                success: false,
                message: "Designation not found",
                code: "Designation_NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "Designation found",
            code: "SUCCESS",
            data: designation
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        });
    }
});

export default designationRouter;