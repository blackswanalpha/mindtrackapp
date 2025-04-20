const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { param } = require('express-validator');

/**
 * @route GET /api/statistics/questionnaires/:id
 * @desc Get statistics for a questionnaire
 * @access Private
 */
router.get(
  '/questionnaires/:id',
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  auth,
  statisticsController.getQuestionnaireStatistics
);

/**
 * @route GET /api/statistics/questions/:id
 * @desc Get statistics for a question
 * @access Private
 */
router.get(
  '/questions/:id',
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  auth,
  statisticsController.getQuestionStatistics
);

/**
 * @route GET /api/statistics/users
 * @desc Get user statistics
 * @access Private (Admin)
 */
router.get(
  '/users',
  auth,
  authorize(['admin']),
  statisticsController.getUserStatistics
);

/**
 * @route GET /api/statistics/organizations
 * @desc Get organization statistics
 * @access Private (Admin)
 */
router.get(
  '/organizations',
  auth,
  authorize(['admin']),
  statisticsController.getOrganizationStatistics
);

/**
 * @route GET /api/statistics/system
 * @desc Get system statistics
 * @access Private (Admin)
 */
router.get(
  '/system',
  auth,
  authorize(['admin']),
  statisticsController.getSystemStatistics
);

module.exports = router;
