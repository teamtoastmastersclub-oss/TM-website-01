import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Enable CORS with credentials support (for HTTP-only cookies)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});



// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tm-modern')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Seed Admin
    const seedAdmin = async () => {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('clubTMKLECET', salt);
        
        await User.findOneAndUpdate(
          { role: 'admin' },
          {
            email: 'teamtoastmastersclub@gmail.com',
            username: '',
            password: hashedPassword,
            fullName: 'TM Administrator',
            usn: 'ADMIN01',
            branch: 'ADMIN',
            sem: '8',
            role: 'admin'
          },
          { upsert: true }
        );
        console.log('Admin credentials seeded/updated successfully.');
      } catch (e) {
        console.error('Admin seed error:', e);
      }
    };
    seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
