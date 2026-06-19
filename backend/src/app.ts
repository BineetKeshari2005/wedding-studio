import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import studioRoutes from './routes/studio.routes';

import { setupSwagger } from './config/swagger';

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust for your frontend
    credentials: true, // Required for HTTP-only cookies
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Parse request bodies
app.use(express.json());
app.use(cookieParser());

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/studio', studioRoutes);

// Error Handler
app.use(errorHandler);

export default app;
