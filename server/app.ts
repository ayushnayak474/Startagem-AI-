import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import decisionRoutes from './routes/decisionRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { db } from './config/db.js';

dotenv.config();

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for Vite hot reload and dev asset bundling
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // generous limit for development/demo
  message: { success: false, error: 'Too many authentication attempts, please try again later.' }
});

const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60, // 60 decision analyses per hour
  message: { success: false, error: 'Analysis rate limit reached for this hour.' }
});

// JSON body parser with 10MB limit for rich scenarios
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Public health check
app.get('/api/health', async (req, res) => {
  const uptime = process.uptime();
  res.json({
    success: true,
    data: {
      status: 'operational',
      service: 'Stratagem AI Decision Intelligence API',
      uptime: `${Math.floor(uptime)} seconds`,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      databaseType: db.isPostgres ? 'PostgreSQL (Cloud / Pool)' : 'Embedded Persistent Store'
    }
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/decisions/analyze', analysisLimiter);
app.use('/api/decisions', decisionRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
