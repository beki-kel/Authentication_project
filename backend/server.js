import express from 'express';
import {connectDb} from './db/connectDb.js';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config()

const PORT= process.env.PORT || 5000

const app = express()

app.listen(PORT, () => {
    connectDb()
    console.log (`server is running on port ${PORT}`)
})

app.use(express.json())
app.use(cookieParser());

app.use('/auth', authRoute)