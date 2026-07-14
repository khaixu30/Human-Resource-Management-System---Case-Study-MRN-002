import e from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connect.db.js";
import authRouter from "./routes/auth.routes.js";


dotenv.config()

const app = e();

app.use(cors())

app.use(e.json());
app.use(e.urlencoded());

connectDB();

app.use('/api', authRouter);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello World!"});
});

app.listen(3000, () => {
    console.log('Server running: http://localhost:3000');
});