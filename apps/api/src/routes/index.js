const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// API version route
router.get('/', (req, res) => {
  res.status(200).json({
    name: 'MindTrack API',
    version: '1.0.0',
    description: 'API for MindTrack application'
  });
});

module.exports = router;
