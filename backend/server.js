import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import aiRoutes from './routes/ai.routes.js';
import pickupsRoutes from './routes/pickups.routes.js';
import usersRoutes from './routes/users.routes.js';
import activitiesRoutes from './routes/activities.routes.js';
import articlesRoutes from './routes/articles.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'IndoHood Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/ai', aiRoutes);
app.use('/api/pickups', pickupsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/articles', articlesRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message
  });
});

import { initScrapScraperDaemon } from './services/scrap-scraper.service.js';

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🌱 IndoHood Backend running on http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);

  // Initialize automated 24h scrap rate scraper daemon
  initScrapScraperDaemon();
});

export default app;
