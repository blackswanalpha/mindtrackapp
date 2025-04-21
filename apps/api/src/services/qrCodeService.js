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
    // Define style presets
    const stylePresets = {
      default: {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      },
      modern: {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#1a73e8',
          light: '#ffffff'
        }
      },
      vibrant: {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#e91e63',
          light: '#ffffff'
        }
      },
      dark: {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#121212',
          light: '#f5f5f5'
        }
      },
      nature: {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#4caf50',
          light: '#f1f8e9'
        }
      }
    };

    // Get style preset if specified
    const style = options.style || 'default';
    const stylePreset = stylePresets[style] || stylePresets.default;

    // Merge options
    const qrOptions = { ...stylePreset, ...options };
    delete qrOptions.style; // Remove style property as it's not used by QRCode

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

/**
 * Generate QR code as SVG string
 * @param {string} data - Data to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} QR code SVG string
 */
const generateQRCodeSVG = async (data, options = {}) => {
  try {
    // Define style presets (similar to data URL function)
    const stylePresets = {
      default: {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        type: 'svg'
      },
      modern: {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#1a73e8',
          light: '#ffffff'
        },
        type: 'svg'
      },
      vibrant: {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#e91e63',
          light: '#ffffff'
        },
        type: 'svg'
      },
      dark: {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#121212',
          light: '#f5f5f5'
        },
        type: 'svg'
      },
      nature: {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#4caf50',
          light: '#f1f8e9'
        },
        type: 'svg'
      }
    };

    // Get style preset if specified
    const style = options.style || 'default';
    const stylePreset = stylePresets[style] || stylePresets.default;

    // Merge options
    const qrOptions = { ...stylePreset, ...options };
    delete qrOptions.style; // Remove style property as it's not used by QRCode

    // Use toDataURL with svg type instead of toString
    return await QRCode.toDataURL(data, { ...qrOptions, type: 'svg' });
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw error;
  }
};

/**
 * Generate QR code with random style
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<Object>} QR code data with different formats
 */
const generateRandomStyleQRCode = async (data) => {
  try {
    // Available styles
    const styles = ['default', 'modern', 'vibrant', 'dark', 'nature'];

    // Pick a random style
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    // Generate QR codes in different formats
    const dataURL = await generateQRCodeDataURL(data, { style: randomStyle });

    // Generate SVG
    let svg;
    try {
      svg = await generateQRCodeSVG(data, { style: randomStyle });
    } catch (svgError) {
      console.warn('Failed to generate SVG, falling back to data URL', svgError);
      svg = dataURL; // Fallback to data URL if SVG generation fails
    }

    // Generate buffer
    let buffer;
    try {
      buffer = await generateQRCodeBuffer(data, { style: randomStyle });
    } catch (bufferError) {
      console.warn('Failed to generate buffer', bufferError);
      buffer = null; // Set to null if buffer generation fails
    }

    return {
      dataURL,
      svg,
      buffer,
      style: randomStyle
    };
  } catch (error) {
    console.error('Error generating random style QR code:', error);
    throw error;
  }
};

module.exports = {
  generateQRCodeDataURL,
  generateQRCodeBuffer,
  generateQRCodeFile,
  generateQRCodeSVG,
  generateRandomStyleQRCode,
  generateQuestionnaireQRCode,
  generateResponseQRCode
};
