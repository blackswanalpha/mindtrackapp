const express = require('express');
const router = express.Router();
const googleFormsController = require('../controllers/googleFormsController');
const { authenticate } = require('../middleware/auth');

// Endpoint to manually trigger form data import
router.post('/import', authenticate, googleFormsController.importFormResponses);

// Endpoint to get all form responses
router.get('/', authenticate, googleFormsController.getAllResponses);

// Endpoint to get a single form response by ID
router.get('/:id', authenticate, googleFormsController.getResponseById);

// Endpoint to get form response statistics
router.get('/statistics', authenticate, googleFormsController.getResponseStatistics);

module.exports = router;
