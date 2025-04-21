/**
 * QR code controller
 */

const qrCodeService = require('../services/qrCodeService');
const Questionnaire = require('../models/Questionnaire');
const Response = require('../models/Response');

/**
 * Generate QR code for questionnaire
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateQuestionnaireQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { style, format } = req.query;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Check if QR code is enabled for questionnaire
    if (!questionnaire.is_qr_enabled) {
      return res.status(400).json({ message: 'QR code is not enabled for this questionnaire' });
    }

    // Generate QR code
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/questionnaires/respond/${id}`;

    let qrCode;
    let svgCode;

    if (style === 'random') {
      // Generate random style QR code
      const randomQRCode = await qrCodeService.generateRandomStyleQRCode(url);
      qrCode = randomQRCode.dataURL;
      svgCode = randomQRCode.svg;
    } else {
      // Generate QR code with specified style
      qrCode = await qrCodeService.generateQRCodeDataURL(url, { style });

      // Generate SVG if requested
      if (format === 'svg' || format === 'all') {
        svgCode = await qrCodeService.generateQRCodeSVG(url, { style });
      }
    }

    // Return QR code
    res.json({
      message: 'QR code generated successfully',
      qrCode,
      svg: svgCode,
      url,
      style: style || 'default'
    });
  } catch (error) {
    console.error('Error generating questionnaire QR code:', error);
    next(error);
  }
};

/**
 * Generate QR code for response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateResponseQRCode = async (req, res, next) => {
  try {
    const { uniqueCode } = req.params;

    // Check if response exists
    const response = await Response.findByUniqueCode(uniqueCode);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Generate QR code
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const qrCode = await qrCodeService.generateResponseQRCode(uniqueCode, baseUrl);

    // Return QR code
    res.json({
      message: 'QR code generated successfully',
      qrCode,
      url: `${baseUrl}/responses/view/${uniqueCode}`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download QR code for questionnaire
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const downloadQuestionnaireQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Check if QR code is enabled for questionnaire
    if (!questionnaire.is_qr_enabled) {
      return res.status(400).json({ message: 'QR code is not enabled for this questionnaire' });
    }

    // Generate QR code
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/questionnaires/respond/${id}`;
    const qrCodeBuffer = await qrCodeService.generateQRCodeBuffer(url);

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="questionnaire-${id}-qr.png"`);

    // Send QR code
    res.send(qrCodeBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * Download QR code for response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const downloadResponseQRCode = async (req, res, next) => {
  try {
    const { uniqueCode } = req.params;

    // Check if response exists
    const response = await Response.findByUniqueCode(uniqueCode);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Generate QR code
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/responses/view/${uniqueCode}`;
    const qrCodeBuffer = await qrCodeService.generateQRCodeBuffer(url);

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="response-${uniqueCode}-qr.png"`);

    // Send QR code
    res.send(qrCodeBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate QR code with random style
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateRandomStyleQRCode = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Generate random style QR code
    const qrCode = await qrCodeService.generateRandomStyleQRCode(url);

    // Return QR code
    res.json({
      message: 'Random style QR code generated successfully',
      dataURL: qrCode.dataURL,
      svg: qrCode.svg,
      style: qrCode.style,
      url
    });
  } catch (error) {
    console.error('Error generating random style QR code:', error);
    next(error);
  }
};

/**
 * Download QR code as SVG
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const downloadQRCodeAsSVG = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { style } = req.query;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Generate QR code
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/questionnaires/respond/${id}`;
    const svgCode = await qrCodeService.generateQRCodeSVG(url, { style });

    // Set response headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="questionnaire-${id}-qr.svg"`);

    // Send SVG
    res.send(svgCode);
  } catch (error) {
    console.error('Error downloading QR code as SVG:', error);
    next(error);
  }
};

module.exports = {
  generateQuestionnaireQRCode,
  generateResponseQRCode,
  downloadQuestionnaireQRCode,
  downloadResponseQRCode,
  generateRandomStyleQRCode,
  downloadQRCodeAsSVG
};
