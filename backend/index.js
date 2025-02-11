import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import tenantRoutes from './routes/tanent.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // Change to the specific origin you want to allow
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true, // Allow cookies if needed
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/',(req,res)=>{
  res.send('Hello World')
})
app.use('/user', tenantRoutes);
app.use('/admin',adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGOOSE)
    .then((conn) => {console.log(`Database connected: ${conn.connection.host}`);})
    .catch((err) => {console.log(`Error in connected db: ${err.message}`);})
});