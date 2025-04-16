const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const aiAnalysisController = require('../controllers/aiAnalysisController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

/**
 * @route GET /api/ai-analysis
 * @desc Get all AI analyses
 * @access Private
 */
router.get(
  '/',
  auth,
  aiAnalysisController.getAnalyses
);

/**
 * @route GET /api/ai-analysis/search
 * @desc Search AI analyses
 * @access Private
 */
router.get(
  '/search',
  [
    query('term').notEmpty().withMessage('Search term is required')
  ],
  validate,
  auth,
  aiAnalysisController.searchAnalyses
);

/**
 * @route GET /api/ai-analysis/:id
 * @desc Get AI analysis by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid analysis ID')
  ],
  validate,
  auth,
  aiAnalysisController.getAnalysisById
);

/**
 * @route DELETE /api/ai-analysis/:id
 * @desc Delete AI analysis
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid analysis ID')
  ],
  validate,
  auth,
  aiAnalysisController.deleteAnalysis
);

/**
 * @route POST /api/ai-analysis/responses/:responseId
 * @desc Generate AI analysis for a response
 * @access Private
 */
router.post(
  '/responses/:responseId',
  [
    param('responseId').isInt().withMessage('Invalid response ID'),
    body('prompt').optional().isString().withMessage('prompt must be a string'),
    body('model').optional().isString().withMessage('model must be a string')
  ],
  validate,
  auth,
  authorize(['admin', 'healthcare_provider']),
  aiAnalysisController.generateAnalysis
);

/**
 * @route GET /api/ai-analysis/responses/:responseId
 * @desc Get AI analysis for a response
 * @access Private
 */
router.get(
  '/responses/:responseId',
  [
    param('responseId').isInt().withMessage('Invalid response ID')
  ],
  validate,
  auth,
  aiAnalysisController.getAnalysisByResponse
);

module.exports = router;
