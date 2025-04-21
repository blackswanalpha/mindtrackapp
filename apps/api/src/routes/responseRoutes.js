const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const responseController = require('../controllers/responseController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

/**
 * @route GET /api/responses
 * @desc Get all responses
 * @access Private
 */
router.get(
  '/',
  auth,
  responseController.getResponses
);

/**
 * @route GET /api/responses/code/:uniqueCode
 * @desc Get response by unique code
 * @access Public
 */
router.get(
  '/code/:uniqueCode',
  [
    param('uniqueCode').isString().withMessage('Invalid response code')
  ],
  validate,
  responseController.getResponseByUniqueCode
);

/**
 * @route GET /api/responses/:id
 * @desc Get response by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid response ID')
  ],
  validate,
  auth,
  responseController.getResponseById
);

/**
 * @route POST /api/responses
 * @desc Create response
 * @access Public/Private
 */
router.post(
  '/',
  [
    body('questionnaire_id').isInt().withMessage('questionnaire_id is required and must be an integer'),
    body('patient_identifier').optional().isString().withMessage('patient_identifier must be a string'),
    body('patient_name').optional().isString().withMessage('patient_name must be a string'),
    body('patient_email').optional().isEmail().withMessage('patient_email must be a valid email'),
    body('patient_age').optional().isInt().withMessage('patient_age must be an integer'),
    body('patient_gender').optional().isString().withMessage('patient_gender must be a string'),
    body('organization_id').optional().isInt().withMessage('organization_id must be an integer'),
    body('answers').isArray().withMessage('answers must be an array'),
    body('answers.*.question_id').isInt().withMessage('question_id must be an integer'),
    body('answers.*.value').notEmpty().withMessage('answer value is required')
  ],
  validate,
  responseController.createResponse
);

/**
 * @route PUT /api/responses/:id
 * @desc Update response
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid response ID'),
    body('patient_identifier').optional().isString().withMessage('patient_identifier must be a string'),
    body('patient_name').optional().isString().withMessage('patient_name must be a string'),
    body('patient_email').optional().isEmail().withMessage('patient_email must be a valid email'),
    body('patient_age').optional().isInt().withMessage('patient_age must be an integer'),
    body('patient_gender').optional().isString().withMessage('patient_gender must be a string'),
    body('flagged_for_review').optional().isBoolean().withMessage('flagged_for_review must be a boolean')
  ],
  validate,
  auth,
  responseController.updateResponse
);

/**
 * @route DELETE /api/responses/:id
 * @desc Delete response
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid response ID')
  ],
  validate,
  auth,
  responseController.deleteResponse
);

/**
 * @route GET /api/responses/:id/answers
 * @desc Get response with answers
 * @access Private
 */
router.get(
  '/:id/answers',
  [
    param('id').isInt().withMessage('Invalid response ID')
  ],
  validate,
  auth,
  responseController.getResponseWithAnswers
);

/**
 * @route PUT /api/responses/:id/flag
 * @desc Flag response for review
 * @access Private
 */
router.put(
  '/:id/flag',
  [
    param('id').isInt().withMessage('Invalid response ID'),
    body('flagged').isBoolean().withMessage('flagged must be a boolean')
  ],
  validate,
  auth,
  authorize(['admin', 'healthcare_provider']),
  responseController.flagResponseForReview
);

/**
 * @route POST /api/responses/recipients
 * @desc Get response recipients
 * @access Private
 */
router.post(
  '/recipients',
  [
    body('response_ids').isArray().withMessage('response_ids must be an array'),
    body('response_ids.*').isInt().withMessage('response_ids must contain integers')
  ],
  validate,
  auth,
  authorize(['admin', 'healthcare_provider']),
  responseController.getResponseRecipients
);

/**
 * @route POST /api/responses/export
 * @desc Export responses
 * @access Private
 */
router.post(
  '/export',
  [
    body('response_ids').isArray().withMessage('response_ids must be an array'),
    body('response_ids.*').isInt().withMessage('response_ids must contain integers')
  ],
  validate,
  auth,
  authorize(['admin', 'healthcare_provider']),
  responseController.exportResponses
);

module.exports = router;
