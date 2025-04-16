/**
 * QR code service
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generate QR code as data URL
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} QR code data URL
 */
const generateQRCodeDataURL = async (data, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    
    return await QRCode.toDataURL(data, qrOptions);
  } catch (error) {
    console.error('Error generating QR code data URL:', error);
    throw error;
  }
};

/**
 * Generate QR code as buffer
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<Buffer>} QR code buffer
 */
const generateQRCodeBuffer = async (data, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    
    return await QRCode.toBuffer(data, qrOptions);
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw error;
  }
};

/**
 * Generate QR code and save to file
 * @param {string} data - Data to encode in QR code
 * @param {string} filePath - Path to save QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} File path
 */
const generateQRCodeFile = async (data, filePath, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await QRCode.toFile(filePath, data, qrOptions);
    
    return filePath;
  } catch (error) {
    console.error('Error generating QR code file:', error);
    throw error;
  }
};

/**
 * Generate QR code for questionnaire
 * @param {number} questionnaireId - Questionnaire ID
 * @param {string} baseUrl - Base URL
 * @returns {Promise<string>} QR code data URL
 */
const generateQuestionnaireQRCode = async (questionnaireId, baseUrl) => {
  const url = `${baseUrl}/questionnaires/respond/${questionnaireId}`;
  return generateQRCodeDataURL(url);
};

/**
 * Generate QR code for response
 * @param {string} uniqueCode - Response unique code
 * @param {string} baseUrl - Base URL
 * @returns {Promise<string>} QR code data URL
 */
const generateResponseQRCode = async (uniqueCode, baseUrl) => {
  const url = `${baseUrl}/responses/view/${uniqueCode}`;
  return generateQRCodeDataURL(url);
};

module.exports = {
  generateQRCodeDataURL,
  generateQRCodeBuffer,
  generateQRCodeFile,
  generateQuestionnaireQRCode,
  generateResponseQRCode
};
