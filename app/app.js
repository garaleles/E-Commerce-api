import express from 'express';
import connectDb from '../db/connectDb.js';
import dotenv from 'dotenv';
import userRoute from '../routes/usersRoute.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/v1/users', userRoute);



// Connect to MongoDB
connectDb();

export default app;


