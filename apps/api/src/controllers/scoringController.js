/**
 * Scoring Controller
 */

const ScoringConfig = require('../models/ScoringConfig');
const Response = require('../models/Response');
const Questionnaire = require('../models/Questionnaire');
const scoringService = require('../services/scoringService');
const auditService = require('../services/auditService');

/**
 * Create scoring configuration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createScoringConfig = async (req, res) => {
  try {
    const { 
      questionnaire_id, 
      name, 
      description, 
      scoring_method, 
      rules, 
      max_score, 
      passing_score 
    } = req.body;
    
    // Validate required fields
    if (!questionnaire_id || !name || !scoring_method) {
      return res.status(400).json({ 
        error: 'Missing required fields: questionnaire_id, name, and scoring_method are required' 
      });
    }
    
    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaire_id);
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }
    
    // Check if scoring config with same name already exists for this questionnaire
    const existingConfig = await ScoringConfig.findOne({
      questionnaire_id,
      name
    });
    
    if (existingConfig) {
      return res.status(409).json({ 
        error: 'A scoring configuration with this name already exists for this questionnaire' 
      });
    }
    
    // Create scoring config
    const scoringConfig = await ScoringConfig.create({
      questionnaire_id,
      name,
      description,
      scoring_method,
      rules: rules ? JSON.stringify(rules) : null,
      max_score,
      passing_score,
      created_by_id: req.user.id
    });
    
    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'create_scoring_config',
      entity_type: 'scoring_config',
      entity_id: scoringConfig.id,
      details: { questionnaire_id },
      ip_address: req.ip
    });
    
    res.status(201).json(scoringConfig);
  } catch (error) {
    console.error('Error creating scoring configuration:', error);
    res.status(500).json({ error: 'Failed to create scoring configuration' });
  }
};

/**
 * Get scoring configuration by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getScoringConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const scoringConfig = await ScoringConfig.findById(id);
    
    if (!scoringConfig) {
      return res.status(404).json({ error: 'Scoring configuration not found' });
    }
    
    res.status(200).json(scoringConfig);
  } catch (error) {
    console.error('Error getting scoring configuration:', error);
    res.status(500).json({ error: 'Failed to get scoring configuration' });
  }
};

/**
 * Get scoring configurations for a questionnaire
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getScoringConfigsByQuestionnaire = async (req, res) => {
  try {
    const { questionnaireId } = req.params;
    
    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }
    
    const scoringConfigs = await ScoringConfig.findByQuestionnaire(questionnaireId);
    
    res.status(200).json(scoringConfigs);
  } catch (error) {
    console.error('Error getting scoring configurations:', error);
    res.status(500).json({ error: 'Failed to get scoring configurations' });
  }
};

/**
 * Update scoring configuration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateScoringConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      scoring_method, 
      rules, 
      max_score, 
      passing_score 
    } = req.body;
    
    // Check if scoring config exists
    const existingConfig = await ScoringConfig.findById(id);
    
    if (!existingConfig) {
      return res.status(404).json({ error: 'Scoring configuration not found' });
    }
    
    // Check if user is authorized to update
    if (existingConfig.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this scoring configuration' });
    }
    
    // Update scoring config
    const updatedConfig = await ScoringConfig.update(id, {
      name,
      description,
      scoring_method,
      rules: rules ? JSON.stringify(rules) : existingConfig.rules,
      max_score,
      passing_score
    });
    
    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'update_scoring_config',
      entity_type: 'scoring_config',
      entity_id: id,
      ip_address: req.ip
    });
    
    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error('Error updating scoring configuration:', error);
    res.status(500).json({ error: 'Failed to update scoring configuration' });
  }
};

/**
 * Delete scoring configuration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteScoringConfig = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if scoring config exists
    const existingConfig = await ScoringConfig.findById(id);
    
    if (!existingConfig) {
      return res.status(404).json({ error: 'Scoring configuration not found' });
    }
    
    // Check if user is authorized to delete
    if (existingConfig.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this scoring configuration' });
    }
    
    // Delete scoring config
    const deleted = await ScoringConfig.delete(id);
    
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete scoring configuration' });
    }
    
    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'delete_scoring_config',
      entity_type: 'scoring_config',
      entity_id: id,
      ip_address: req.ip
    });
    
    res.status(200).json({ message: 'Scoring configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting scoring configuration:', error);
    res.status(500).json({ error: 'Failed to delete scoring configuration' });
  }
};

/**
 * Calculate score for a response
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const calculateScore = async (req, res) => {
  try {
    const { responseId } = req.params;
    
    // Check if response exists
    const response = await Response.findById(responseId);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    // Calculate score
    const scoreResult = await scoringService.calculateScore(responseId);
    
    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'calculate_score',
      entity_type: 'response',
      entity_id: responseId,
      details: { 
        score: scoreResult.score,
        risk_level: scoreResult.riskLevel
      },
      ip_address: req.ip
    });
    
    res.status(200).json(scoreResult);
  } catch (error) {
    console.error('Error calculating score:', error);
    res.status(500).json({ error: 'Failed to calculate score' });
  }
};

module.exports = {
  createScoringConfig,
  getScoringConfigById,
  getScoringConfigsByQuestionnaire,
  updateScoringConfig,
  deleteScoringConfig,
  calculateScore
};
