import { Router } from 'express';
import mongoose from 'mongoose';
import authIdentity from '../models/authIdentity.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {sendOTP} from '../api/mail.api.js';
import { verifyAuthIdentityForOTP } from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, payload } = req.body;

        const authIdExists = await authIdentity.findOne({ email });
        if (authIdExists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
                code: "EMAIL_EXISTS"
            });
        }

        const otp = Math.floor(100000 * Math.random() * 900000);

        const currentTime = new Date();
        const tenMinutesInMs = 10 * 60 * 1000; 
        const expiryTime = new Date(currentTime.getTime() + tenMinutesInMs);
        const otp_data = {
            otp,
            expiresIn: expiryTime
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new authIdentity({
            email,
            passwordHash,
            devices: {
                deviceId: payload.device,
                lastLogin: payload.date,
                userAgent: payload.userAgent
            },
            otp: otp_data
        });

        await newUser.save();

        const token_payload = {
            userID: newUser._id,
            email: newUser.email,
            status: 'unverified',
            payload,
            role: newUser.role
        }
        
        const token = jwt.sign(token_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN})
        
        await sendOTP(otp);
        
        res.status(201).json({
            success: true,
            message: "User Created Successfully, Please Verify your account!",
            code: "OTP_SENT",
            data: newUser,
            token
        })

        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            code: "SERVER_FAULT",
            success: false,
            message: "Internal Server Error"
        })
    }
});

authRouter.post('/login', async (req, res) => {
    try{
        const {email, password, payload} = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000);
        
        const currentTime = new Date();
        const tenMinutesInMs = 10 * 60 * 1000; 
        const expiryTime = new Date(currentTime.getTime() + tenMinutesInMs);
        const otp_data = {
            otp,
            expiresIn: expiryTime
        }
        
        const user = await authIdentity.findOneAndUpdate({email}, {
            $set: {
                devices: {
                    deviceId: payload.device,
                    lastLogin: payload.date,
                    userAgent: payload.userAgent
                },
                otp: otp_data
            }
        },
        {new: true}
        );

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User does not exists",
                code: "USER_NOT_FOUND"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch){
            return res.status(400).json({
                success: false, 
                message: "Incorrect email or password",
                code: "INVALID_PASSWORD"
            });
        }


        const token_payload = {
            email: user.email,
            id: user._id,
            status: 'unverified',
            payload,
            role: user.role
        }

        const token =  jwt.sign(token_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN});

        await sendOTP(otp);

        res.status(200).json({
            success: true,
            message: "Login Successful, Please Verify Via OTP",
            code: "OTP_SENT",
            data: user,
            token
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


authRouter.post('/verify-otp', verifyAuthIdentityForOTP, async (req, res) => {
    try {

        const { otp: userInputOtp } = req.body;
        const { id, email, payload, dbOtp } = req.user; 

        if (String(userInputOtp) !== String(dbOtp)) {
            console.log("OTP Mismatched");
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                code: "INVALID_OTP"
            });
        }

        const token_payload = {
            email,
            id, 
            payload,
            status: 'verified'
        };
        
        const token = jwt.sign(token_payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN || '1d' });

        return res.status(200).json({
            success: true,
            message: "OTP verification completed!",
            code: "OTP_VERIFIED",
            token
        });
    } catch (err) {
        console.log("Router Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            code: "SERVER_FAULT"
        });
    }
});


export default authRouter;