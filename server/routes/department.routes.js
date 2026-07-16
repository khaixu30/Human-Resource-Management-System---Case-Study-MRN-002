import {Router} from 'express';
import { authenticate, authorize} from '../middleware/auth.middleware.js';
import Department from '../models/department.model.js';

const departmentRouter = Router();

departmentRouter.post('/department/create', authenticate, authorize(['SuperAdmin', 'HRAdmin']), async (req, res) => {
    try{
        const {name, managerId} = req.body;
        const newDepartment = new Department({
            name, managerId
        });
        await newDepartment.save();

        res.status(201).json({
            success: true,
            message: 'Department added!',
            code: "SUCCESS",
            data: newDepartment
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            code: "SERVER_FAULT"
        });
    }
});

departmentRouter.get('/department/:id', authenticate, authorize(['SuperAdmin', 'HRAdmin', 'Manager', 'Employee']), async (req, res) => {
    try{
        const id = req.params.id;
        const department = await Department.findById(id);
        if(!department){
            console.log("Deparment Not Found")
            return res.status(404).json({
                success: false,
                message: "Department not found",
                code: "DEPARTMENT_NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department found",
            code: "SUCCESS",
            data: department
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

export default departmentRouter;