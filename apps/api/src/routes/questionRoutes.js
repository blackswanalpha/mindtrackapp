const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validation');

/**
 * @route GET /api/questions/:id
 * @desc Get question by ID
 * @access Public/Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid question ID')
  ],
  validate,
  questionController.getQuestionById
);

/**
 * @route PUT /api/questions/:id
 * @desc Update question
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid question ID'),
    body('text').optional().notEmpty().withMessage('Question text cannot be empty'),
    body('type')
      .optional()
      .isIn(['text', 'single_choice', 'multiple_choice', 'rating', 'yes_no', 'scale', 'date'])
      .withMessage('Invalid question type'),
    body('required').optional().isBoolean().withMessage('required must be a boolean'),
    body('order_num').optional().isInt().withMessage('order_num must be an integer'),
    body('options').optional().isArray().withMessage('options must be an array'),
    body('conditional_logic').optional().isObject().withMessage('conditional_logic must be an object'),
    body('validation_rules').optional().isObject().withMessage('validation_rules must be an object'),
    body('scoring_weight').optional().isInt().withMessage('scoring_weight must be an integer')
  ],
  validate,
  auth,
  questionController.updateQuestion
);

/**
 * @route DELETE /api/questions/:id
 * @desc Delete question
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid question ID')
  ],
  validate,
  auth,
  questionController.deleteQuestion
);

/**
 * @route GET /api/questions/:id/statistics
 * @desc Get question statistics
 * @access Private
 */
router.get(
  '/:id/statistics',
  [
    param('id').isInt().withMessage('Invalid question ID')
  ],
  validate,
  auth,
  questionController.getQuestionStatistics
);

module.exports = router;
