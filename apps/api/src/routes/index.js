const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const questionnaireRoutes = require('./questionnaireRoutes');
const questionRoutes = require('./questionRoutes');
const responseRoutes = require('./responseRoutes');
const organizationRoutes = require('./organizationRoutes');
const aiAnalysisRoutes = require('./aiAnalysisRoutes');
const emailRoutes = require('./emailRoutes');
const qrCodeRoutes = require('./qrCodeRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questionnaires', questionnaireRoutes);
router.use('/questions', questionRoutes);
router.use('/responses', responseRoutes);
router.use('/organizations', organizationRoutes);
router.use('/ai-analysis', aiAnalysisRoutes);
router.use('/email', emailRoutes);
router.use('/qr-codes', qrCodeRoutes);

// Health check route
router.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// API version route
router.get('/', (_, res) => {
  res.status(200).json({
    name: 'MindTrack API',
    version: '1.0.0',
    description: 'API for MindTrack application'
  });
});

module.exports = router;
