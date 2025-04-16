const { validationResult } = require('express-validator');

/**
 * Validation middleware
 * Checks for validation errors and returns them
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  
  next();
};

module.exports = validate;
