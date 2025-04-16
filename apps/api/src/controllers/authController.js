const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create user
    const user = await User.createUser({
      name,
      email,
      password,
      role
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    await User.updateLastLogin(user.id);
    
    // Generate token
    const token = generateToken(user.id);
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * @route GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is attached to request by auth middleware
    res.json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    // In a real implementation, you might want to invalidate the token
    // For JWT, this typically involves maintaining a blacklist of tokens
    // or using short-lived tokens with refresh tokens
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate JWT token
 * @param {Number} userId - User ID
 * @returns {String} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
