/**
 * QR code routes
 */

const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const { auth, authorize } = require('../middleware/auth');

// Generate QR code for questionnaire (public access)
router.get('/questionnaires/:id', qrCodeController.generateQuestionnaireQRCode);

// Generate QR code for response (public access)
router.get('/responses/:uniqueCode', qrCodeController.generateResponseQRCode);

// Download QR code for questionnaire (public access)
router.get('/questionnaires/:id/download', qrCodeController.downloadQuestionnaireQRCode);

// Download QR code as SVG for questionnaire (public access)
router.get('/questionnaires/:id/svg', qrCodeController.downloadQRCodeAsSVG);

// Download QR code for response (public access)
router.get('/responses/:uniqueCode/download', qrCodeController.downloadResponseQRCode);

// Generate QR code with random style (public access)
router.post('/random', qrCodeController.generateRandomStyleQRCode);

module.exports = router;
