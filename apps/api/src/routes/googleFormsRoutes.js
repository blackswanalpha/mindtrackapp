const express = require('express');
const router = express.Router();
const googleFormsController = require('../controllers/googleFormsController');
const { auth } = require('../middleware/auth');

// Endpoint to manually trigger form data import
router.post('/import', auth, googleFormsController.importFormResponses);

// Endpoint to get all form responses
router.get('/', auth, googleFormsController.getAllResponses);

// Endpoint to get form response statistics
router.get('/statistics', auth, googleFormsController.getResponseStatistics);

// Endpoint to get a single form response by ID
router.get('/:id', auth, googleFormsController.getResponseById);

module.exports = router;
