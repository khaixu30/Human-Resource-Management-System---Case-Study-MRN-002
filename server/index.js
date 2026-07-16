import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import {rateLimit} from 'express-rate-limit';
import helmet from 'helmet';

// DB Path
import connectDB from "./db/connect.db.js";

// Middleware Imports
import {requestLogger} from './middleware/requestLogger.middleware.js';

// Route Imports
import authRouter from "./routes/auth.routes.js";
import employeeRouter from "./routes/employee.routes.js";


dotenv.config()

const app = e();

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    limit: 25,
    message: {
        success: false,
        message: "Too many requests, please try again later!",
        errorCode: "RATE_EXCEED"
    }
})

app.use(cors())

app.use(e.json());
app.use(e.urlencoded());

connectDB();

app.use(helmet());
app.use(limiter);
app.use(requestLogger);

app.use('/api', authRouter);
app.use('/api', employeeRouter);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello World!"});
});

app.listen(3000, () => {
    console.log('Server running: http://localhost:3000');
});