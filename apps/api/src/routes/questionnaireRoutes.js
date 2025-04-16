const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const questionController = require('../controllers/questionController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

/**
 * @route GET /api/questionnaires
 * @desc Get all questionnaires
 * @access Public/Private
 */
router.get('/', questionnaireController.getQuestionnaires);

/**
 * @route GET /api/questionnaires/:id
 * @desc Get questionnaire by ID
 * @access Public/Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID')
  ],
  validate,
  questionnaireController.getQuestionnaireById
);

/**
 * @route POST /api/questionnaires
 * @desc Create questionnaire
 * @access Private
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('type').optional().isString().withMessage('Type must be a string'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('is_adaptive').optional().isBoolean().withMessage('is_adaptive must be a boolean'),
    body('is_qr_enabled').optional().isBoolean().withMessage('is_qr_enabled must be a boolean'),
    body('is_template').optional().isBoolean().withMessage('is_template must be a boolean'),
    body('is_public').optional().isBoolean().withMessage('is_public must be a boolean'),
    body('allow_anonymous').optional().isBoolean().withMessage('allow_anonymous must be a boolean'),
    body('requires_auth').optional().isBoolean().withMessage('requires_auth must be a boolean'),
    body('max_responses').optional().isInt().withMessage('max_responses must be an integer'),
    body('expires_at').optional().isISO8601().withMessage('expires_at must be a valid date'),
    body('organization_id').optional().isInt().withMessage('organization_id must be an integer'),
    body('questions').optional().isArray().withMessage('questions must be an array')
  ],
  validate,
  auth,
  questionnaireController.createQuestionnaire
);

/**
 * @route PUT /api/questionnaires/:id
 * @desc Update questionnaire
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('type').optional().isString().withMessage('Type must be a string'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('is_adaptive').optional().isBoolean().withMessage('is_adaptive must be a boolean'),
    body('is_qr_enabled').optional().isBoolean().withMessage('is_qr_enabled must be a boolean'),
    body('is_template').optional().isBoolean().withMessage('is_template must be a boolean'),
    body('is_public').optional().isBoolean().withMessage('is_public must be a boolean'),
    body('allow_anonymous').optional().isBoolean().withMessage('allow_anonymous must be a boolean'),
    body('requires_auth').optional().isBoolean().withMessage('requires_auth must be a boolean'),
    body('max_responses').optional().isInt().withMessage('max_responses must be an integer'),
    body('expires_at').optional().isISO8601().withMessage('expires_at must be a valid date'),
    body('organization_id').optional().isInt().withMessage('organization_id must be an integer')
  ],
  validate,
  auth,
  questionnaireController.updateQuestionnaire
);

/**
 * @route DELETE /api/questionnaires/:id
 * @desc Delete questionnaire
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID')
  ],
  validate,
  auth,
  questionnaireController.deleteQuestionnaire
);

/**
 * @route GET /api/questionnaires/:id/questions
 * @desc Get questionnaire with questions
 * @access Public/Private
 */
router.get(
  '/:id/questions',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID')
  ],
  validate,
  questionnaireController.getQuestionnaireWithQuestions
);

/**
 * @route POST /api/questionnaires/:id/version
 * @desc Create new version of questionnaire
 * @access Private
 */
router.post(
  '/:id/version',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string')
  ],
  validate,
  auth,
  questionnaireController.createQuestionnaireVersion
);

/**
 * @route GET /api/questionnaires/:id/statistics
 * @desc Get questionnaire statistics
 * @access Private
 */
router.get(
  '/:id/statistics',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID')
  ],
  validate,
  auth,
  questionnaireController.getQuestionnaireStatistics
);

/**
 * @route POST /api/questionnaires/:questionnaireId/questions
 * @desc Create question
 * @access Private
 */
router.post(
  '/:questionnaireId/questions',
  [
    param('questionnaireId').isInt().withMessage('Invalid questionnaire ID'),
    body('text').notEmpty().withMessage('Question text is required'),
    body('type')
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
  questionController.createQuestion
);

/**
 * @route PUT /api/questionnaires/:questionnaireId/questions/reorder
 * @desc Reorder questions
 * @access Private
 */
router.put(
  '/:questionnaireId/questions/reorder',
  [
    param('questionnaireId').isInt().withMessage('Invalid questionnaire ID'),
    body('questions').isArray().withMessage('questions must be an array'),
    body('questions.*.id').isInt().withMessage('question id must be an integer'),
    body('questions.*.order_num').isInt().withMessage('order_num must be an integer')
  ],
  validate,
  auth,
  questionController.reorderQuestions
);

module.exports = router;
