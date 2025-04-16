/**
 * Error handling middleware
 * Catches errors and returns appropriate response
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Default error status and message
  let statusCode = 500;
  let message = 'Internal server error';
  let details = undefined;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not found';
  }
  
  // Use error message if available
  if (err.message) {
    message = err.message;
  }
  
  // Include error details in development mode
  const error = process.env.NODE_ENV === 'production' 
    ? undefined 
    : {
        name: err.name,
        stack: err.stack,
        details: err.details || details
      };
  
  res.status(statusCode).json({
    message,
    error
  });
};

module.exports = errorHandler;
