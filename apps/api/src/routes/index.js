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
const googleFormsRoutes = require('./googleFormsRoutes');
const testRoutes = require('./testRoutes');
const scoringRoutes = require('./scoringRoutes');
const notificationRoutes = require('./notificationRoutes');
const statisticsRoutes = require('./statisticsRoutes');
const userMetricsRoutes = require('./userMetricsRoutes');

// Health check endpoint
router.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

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
router.use('/google-forms', googleFormsRoutes);
router.use('/test', testRoutes);
router.use('/scoring', scoringRoutes);
router.use('/notifications', notificationRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/user-metrics', userMetricsRoutes);

// API version route
router.get('/', (_, res) => {
  res.status(200).json({
    name: 'MindTrack API',
    version: '1.0.0',
    description: 'API for MindTrack application'
  });
});

module.exports = router;
