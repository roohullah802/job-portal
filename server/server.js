import express from 'express';
const app = express()
import dotenv from 'dotenv';
import cors from "cors"
import cookieParser from 'cookie-parser';
dotenv.config();
import {router as userRouter} from './src/routers/userRouter.js';
import {router as companyRouter} from "./src/routers/company.router.js"
import {router as jobRouter} from "./src/routers/job.router.js"
import {router as applicationRouter} from "./src/routers/applications.router.js"
import { connectDB } from './src/db/connectDB.js';
connectDB();


app.use(express.urlencoded({extended:true}))
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",userRouter)
app.use("/api",companyRouter)
app.use("/api/job",jobRouter)
app.use("/api/application",applicationRouter)

app.listen(process.env.PORT, () => {
    console.log(`server is started at port ${process.env.PORT}`);
    
})