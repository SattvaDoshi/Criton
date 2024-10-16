import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import tenantRoutes from './routes/tanent.routes.js';
import settingRoutes from './routes/setting.routes.js';
import photoRoutes from './routes/photo.routes.js';
import albumRoutes from './routes/album.routes.js';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,  // Prevents session from being saved back to the store if it wasn’t modified
    saveUninitialized: false,  // Don’t create a session until something is stored
    store: MongoStore.create({
      mongoUrl: process.env.MONGOOSE,  
      collectionName: 'sessions', 
      ttl: 24 * 60 * 60,  // 1 day session expiration (TTL: time to live)
    }),
    cookie: {
      // secure: process.env.NODE_ENV === 'production',  // Ensure secure cookies in production
      maxAge: 1000 * 60 * 60 * 24,  // 1 day session expiration
    },
  })
);

app.get('/',(req,res)=>{
  res.send('Hello World')
})
app.use('/api', tenantRoutes);
app.use('/settings',settingRoutes);
app.use('/photos',photoRoutes);
app.use('/albums',albumRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGOOSE)
    .then((conn) => {console.log(`Database connected: ${conn.connection.host}`);})
    .catch((err) => {console.log(`Error in connected db: ${err.message}`);})
});
