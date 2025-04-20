/**
 * Statistics Controller
 */

const statisticsService = require('../services/statisticsService');

/**
 * Get questionnaire statistics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getQuestionnaireStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const statistics = await statisticsService.getQuestionnaireStatistics(id);
    
    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error getting questionnaire statistics:', error);
    res.status(500).json({ error: 'Failed to get questionnaire statistics' });
  }
};

/**
 * Get question statistics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getQuestionStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const statistics = await statisticsService.getQuestionStatistics(id);
    
    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error getting question statistics:', error);
    res.status(500).json({ error: 'Failed to get question statistics' });
  }
};

/**
 * Get user statistics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserStatistics = async (req, res) => {
  try {
    // Only admins can access user statistics
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access user statistics' });
    }
    
    const statistics = await statisticsService.getUserStatistics();
    
    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error getting user statistics:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
};

/**
 * Get organization statistics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getOrganizationStatistics = async (req, res) => {
  try {
    // Only admins can access organization statistics
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access organization statistics' });
    }
    
    const statistics = await statisticsService.getOrganizationStatistics();
    
    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error getting organization statistics:', error);
    res.status(500).json({ error: 'Failed to get organization statistics' });
  }
};

/**
 * Get system statistics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getSystemStatistics = async (req, res) => {
  try {
    // Only admins can access system statistics
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access system statistics' });
    }
    
    const statistics = await statisticsService.getSystemStatistics();
    
    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error getting system statistics:', error);
    res.status(500).json({ error: 'Failed to get system statistics' });
  }
};

module.exports = {
  getQuestionnaireStatistics,
  getQuestionStatistics,
  getUserStatistics,
  getOrganizationStatistics,
  getSystemStatistics
};
