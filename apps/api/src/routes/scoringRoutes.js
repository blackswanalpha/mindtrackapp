const express = require('express');
const router = express.Router();
const scoringController = require('../controllers/scoringController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { body, param } = require('express-validator');

/**
 * @route POST /api/scoring/configs
 * @desc Create a new scoring configuration
 * @access Private (Admin, Healthcare Provider)
 */
router.post(
  '/configs',
  [
    body('questionnaire_id').isInt().withMessage('Questionnaire ID must be an integer'),
    body('name').notEmpty().withMessage('Name is required'),
    body('scoring_method').notEmpty().withMessage('Scoring method is required'),
    body('rules').optional(),
    body('max_score').optional().isInt().withMessage('Max score must be an integer'),
    body('passing_score').optional().isInt().withMessage('Passing score must be an integer')
  ],
  validate,
  auth,
  authorize(['admin', 'healthcare_provider']),
  scoringController.createScoringConfig
);

/**
 * @route GET /api/scoring/configs/:id
 * @desc Get a scoring configuration by ID
 * @access Private
 */
router.get(
  '/configs/:id',
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  auth,
  scoringController.getScoringConfigById
);

/**
 * @route GET /api/scoring/questionnaires/:questionnaireId/configs
 * @desc Get scoring configurations for a questionnaire
 * @access Private
 */
router.get(
  '/questionnaires/:questionnaireId/configs',
  [
    param('questionnaireId').isInt().withMessage('Questionnaire ID must be an integer')
  ],
  validate,
  auth,
  scoringController.getScoringConfigsByQuestionnaire
);

/**
 * @route PUT /api/scoring/configs/:id
 * @desc Update a scoring configuration
 * @access Private (Admin, Creator)
 */
router.put(
  '/configs/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('scoring_method').optional().notEmpty().withMessage('Scoring method cannot be empty'),
    body('rules').optional(),
    body('max_score').optional().isInt().withMessage('Max score must be an integer'),
    body('passing_score').optional().isInt().withMessage('Passing score must be an integer')
  ],
  validate,
  auth,
  scoringController.updateScoringConfig
);

/**
 * @route DELETE /api/scoring/configs/:id
 * @desc Delete a scoring configuration
 * @access Private (Admin, Creator)
 */
router.delete(
  '/configs/:id',
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  auth,
  scoringController.deleteScoringConfig
);

/**
 * @route POST /api/scoring/responses/:responseId/calculate
 * @desc Calculate score for a response
 * @access Private
 */
router.post(
  '/responses/:responseId/calculate',
  [
    param('responseId').isInt().withMessage('Response ID must be an integer')
  ],
  validate,
  auth,
  scoringController.calculateScore
);

module.exports = router;
