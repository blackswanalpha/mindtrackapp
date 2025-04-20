const express = require('express');
const router = express.Router();
const userMetricsController = require('../controllers/userMetricsController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { param, query } = require('express-validator');

/**
 * @route GET /api/user-metrics
 * @desc Get metrics for current user
 * @access Private
 */
router.get(
  '/',
  auth,
  userMetricsController.getUserMetrics
);

/**
 * @route GET /api/user-metrics/users/:userId
 * @desc Get metrics for a specific user (admin only)
 * @access Private (Admin)
 */
router.get(
  '/users/:userId',
  [
    param('userId').isInt().withMessage('User ID must be an integer')
  ],
  validate,
  auth,
  authorize(['admin']),
  userMetricsController.getUserMetricsById
);

/**
 * @route GET /api/user-metrics/most-active
 * @desc Get most active users (admin only)
 * @access Private (Admin)
 */
router.get(
  '/most-active',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100')
  ],
  validate,
  auth,
  authorize(['admin']),
  userMetricsController.getMostActiveUsers
);

/**
 * @route GET /api/user-metrics/recently-active
 * @desc Get recently active users (admin only)
 * @access Private (Admin)
 */
router.get(
  '/recently-active',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100')
  ],
  validate,
  auth,
  authorize(['admin']),
  userMetricsController.getRecentlyActiveUsers
);

/**
 * @route PUT /api/user-metrics/last-active
 * @desc Update last active timestamp for current user
 * @access Private
 */
router.put(
  '/last-active',
  auth,
  userMetricsController.updateLastActive
);

module.exports = router;
