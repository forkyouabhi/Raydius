import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

// --- Basic Setup ---
dotenv.config();
const app = express();

// --- CORS Configuration ---
// This is the fix. We are explicitly telling the server to allow
// requests only from your Expo web development server's origin.
const corsOptions = {
  origin: 'http://localhost:8081',
  credentials: true, // This allows cookies/authorization headers to be sent
};
app.use(cors(corsOptions));

app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/auth', authRoutes);

// --- Health Check Route ---
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Raydius API is running.' });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

