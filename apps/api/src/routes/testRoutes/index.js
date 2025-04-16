const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../../middleware/validation');
const testController = require('../../controllers/testController');

/**
 * @route GET /api/test/questionnaires
 * @desc Get all test questionnaires
 * @access Public
 */
router.get('/questionnaires', testController.getQuestionnaires);

/**
 * @route GET /api/test/questionnaires/:id
 * @desc Get test questionnaire by ID
 * @access Public
 */
router.get(
  '/questionnaires/:id',
  [
    param('id').isInt().withMessage('Invalid questionnaire ID')
  ],
  validate,
  testController.getQuestionnaireById
);

/**
 * @route POST /api/test/questionnaires/scrape
 * @desc Scrape questionnaire from Google Forms
 * @access Public
 */
router.post(
  '/questionnaires/scrape',
  [
    body('url').isURL().withMessage('Valid Google Forms URL is required')
  ],
  validate,
  testController.scrapeQuestionnaire
);

/**
 * @route POST /api/test/responses
 * @desc Create test response
 * @access Public
 */
router.post(
  '/responses',
  [
    body('questionnaire_id').isInt().withMessage('Questionnaire ID is required'),
    body('respondent_email').isEmail().withMessage('Valid email is required'),
    body('answers').isArray().withMessage('Answers must be an array')
  ],
  validate,
  testController.createResponse
);

/**
 * @route GET /api/test/responses
 * @desc Get all test responses
 * @access Public
 */
router.get('/responses', testController.getResponses);

/**
 * @route GET /api/test/responses/:id
 * @desc Get test response by ID
 * @access Public
 */
router.get(
  '/responses/:id',
  [
    param('id').isInt().withMessage('Invalid response ID')
  ],
  validate,
  testController.getResponseById
);

module.exports = router;
