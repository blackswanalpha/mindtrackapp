/**
 * Email routes
 */

const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { auth, authorize } = require('../middleware/auth');

// Send email
router.post('/send', auth, authorize(['admin', 'healthcare_provider']), emailController.sendEmail);

// Get email templates
router.get('/templates', auth, emailController.getTemplates);

// Get email template by ID
router.get('/templates/:id', auth, emailController.getTemplateById);

// Create email template
router.post('/templates', auth, authorize(['admin']), emailController.createTemplate);

// Update email template
router.put('/templates/:id', auth, authorize(['admin']), emailController.updateTemplate);

// Delete email template
router.delete('/templates/:id', auth, authorize(['admin']), emailController.deleteTemplate);

// Get email logs
router.get('/logs', auth, authorize(['admin']), emailController.getLogs);

module.exports = router;
