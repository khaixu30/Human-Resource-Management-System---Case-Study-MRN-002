import { Router } from 'express';
import Employee from '../models/employee.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import authIdentity from '../models/authIdentity.model.js';
import { generateEmployeeId } from '../utils/genUserId.util.js';
import { sendNewEmployeeRecord } from '../api/mail.api.js';

const employeeRouter = Router();

employeeRouter.post('/employee/create', authenticate, authorize(['HRAdmin', 'SuperAdmin']), async (req, res) => {
    try{
        const { 
            firstName, 
            lastName, 
            cnic, 
            phone, 
            address, 
            gender, 
            dateOfBirth, 
            status, 
            documentsUrl, 
            departmentId, 
            designationId, 
            managerId, 
            employeementType,
            skills,
            certification,
        } = req.body;
        const employeeId = req.headers['x-employee-id'];

        // console.log(new Date('12-30-2006'));
        const userId = await generateEmployeeId();

        const newEmployee = new Employee({
            firstName, 
            lastName, 
            cnic, 
            phone, 
            address, 
            gender, 
            dateOfBirth, 
            status, 
            documentsUrl, 
            departmentId, 
            designationId, 
            managerId, 
            employeementType,
            skills,
            certification,
            userId
        });

        newEmployee.save();

        const user = await authIdentity.findByIdAndUpdate(employeeId, {
            employeeId: newEmployee._id
        });

        await sendNewEmployeeRecord(newEmployee, user.email);
        
        res.status(200).json({
            success: true,
            code: "SUCCESS",
            message: "Employee Created Successfully!",
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        })
    }
});

employeeRouter.get('/employee/:id', authenticate, async (req, res) => {
    try{
        const {id} = req.params
        const employeeData = await Employee.findById(id);
        if(!employeeData){
            return res.status(404).json({
                success: false,
                message: "Employee Record not found",
                code: "EMPLOYEE_NOT_FOUND"
            });
        }

        if(employeeData.status !== 'active'){
            return res.status(404).json({
                success: false,
                message: "Employee's Data is Private",
                code: "EMPLOYEE_UNACCESSIBLE"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee record found",
            code: "SUCEESS",
            data: employeeData
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

export default employeeRouter;