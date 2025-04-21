/**
 * Utility functions for generating unique codes
 */

const crypto = require('crypto');

/**
 * Generate a unique code for responses
 * @returns {string} Unique code
 */
const generateUniqueCode = () => {
  // Generate a random string of 8 characters
  const randomBytes = crypto.randomBytes(4);
  const code = randomBytes.toString('hex').toUpperCase();
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  
  return `${code}-${timestamp}`;
};

/**
 * Generate a random password
 * @param {number} length - Password length
 * @returns {string} Random password
 */
const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
};

module.exports = {
  generateUniqueCode,
  generateRandomPassword
};
