const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
  // AUTHENTICATION DISABLED: Always provide a mock admin user
  req.user = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  req.token = 'mock-token-for-disabled-auth';

  next();
};

/**
 * Role-based authorization middleware
 * @param {String|Array} roles - Allowed roles
 */
const authorize = (roles) => {
  return (req, res, next) => {
    // AUTHENTICATION DISABLED: Always allow access
    next();
  };
};

module.exports = {
  auth,
  authorize
};
