import { Router } from 'express';
import mongoose from 'mongoose';
import authIdentity from '../models/authIdentity.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, payload } = req.body;

        const authIdExists = await authIdentity.findOne({ email });
        if (authIdExists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
                errorCode: "EMAIL_EXISTS"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new authIdentity({
            email,
            passwordHash,
            devices: {
                deviceId: payload.device,
                laslLogin: payload.date,
                userAgent: payload.userAgent
            } 
        });

        await newUser.save();

        const token_payload = {
            userID: newUser._id,
            email: newUser.email,
            payload
        }

        const token = jwt.sign(token_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN})

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            errorCode: "SUCCESSFUL",
            data: newUser,
            token
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            errorCode: "SERVER_FAULT",
            success: false,
            message: "Internal Server Error"
        })
    }
});

authRouter.post('/login', async (req, res) => {
    try{
        const {email, password, payload} = req.body;

        const user = await authIdentity.findOneAndUpdate({email}, {
            $set: {
                devices: {
                    deviceId: payload.device,
                    lastLogin: payload.date,
                    userAgent: payload.userAgent
                }
            }
        },
        {new: true}
        );

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User does not exists",
                errorCode: "USER_NOT_FOUND"
            });
        }
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch){
            return res.status(400).json({
                success: false, 
                message: "Incorrect email or password",
                errorCode: "INVALID_PASSWORD"
            });
        }


        const token_payload = {
            email: user.email,
            id: user._id,
            payload
        }

        const token =  jwt.sign(token_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN});

        res.status(200).json({
            success: true,
            message: "Login Successful",
            errorCode: "SUCCESSFUL",
            data: user,
            token
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errorCode: "SERVER_FAULT"
        })
    }
})

export default authRouter;