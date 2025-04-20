/**
 * User Metrics Controller
 */

const UserMetric = require('../models/UserMetric');

/**
 * Get metrics for current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const metrics = await UserMetric.findByUser(userId);
    
    if (!metrics) {
      return res.status(404).json({ error: 'No metrics found for this user' });
    }
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error getting user metrics:', error);
    res.status(500).json({ error: 'Failed to get user metrics' });
  }
};

/**
 * Get metrics for a specific user (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserMetricsById = async (req, res) => {
  try {
    // Only admins can access other users' metrics
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access user metrics' });
    }
    
    const { userId } = req.params;
    
    const metrics = await UserMetric.findByUser(userId);
    
    if (!metrics) {
      return res.status(404).json({ error: 'No metrics found for this user' });
    }
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error getting user metrics:', error);
    res.status(500).json({ error: 'Failed to get user metrics' });
  }
};

/**
 * Get most active users (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getMostActiveUsers = async (req, res) => {
  try {
    // Only admins can access this endpoint
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access user metrics' });
    }
    
    const { limit = 10 } = req.query;
    
    const users = await UserMetric.getMostActive(parseInt(limit));
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting most active users:', error);
    res.status(500).json({ error: 'Failed to get most active users' });
  }
};

/**
 * Get recently active users (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getRecentlyActiveUsers = async (req, res) => {
  try {
    // Only admins can access this endpoint
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access user metrics' });
    }
    
    const { limit = 10 } = req.query;
    
    const users = await UserMetric.getRecentlyActive(parseInt(limit));
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting recently active users:', error);
    res.status(500).json({ error: 'Failed to get recently active users' });
  }
};

/**
 * Update last active timestamp for current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateLastActive = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const metrics = await UserMetric.updateLastActive(userId);
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error updating last active timestamp:', error);
    res.status(500).json({ error: 'Failed to update last active timestamp' });
  }
};

module.exports = {
  getUserMetrics,
  getUserMetricsById,
  getMostActiveUsers,
  getRecentlyActiveUsers,
  updateLastActive
};
