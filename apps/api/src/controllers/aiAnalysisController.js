const AiAnalysis = require('../models/AiAnalysis');
const Response = require('../models/Response');

/**
 * Generate AI analysis for a response
 * @route POST /api/ai-analysis/responses/:responseId
 */
const generateAnalysis = async (req, res, next) => {
  try {
    const { responseId } = req.params;
    const { prompt, model = 'gpt-4' } = req.body;
    
    // Check if response exists
    const response = await Response.findById(responseId);
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    // Check if user is authorized to generate analysis
    if (req.user.role !== 'admin' && req.user.role !== 'healthcare_provider') {
      return res.status(403).json({ message: 'Not authorized to generate AI analysis' });
    }
    
    // Check if analysis already exists
    const existingAnalysis = await AiAnalysis.findByResponse(responseId);
    
    if (existingAnalysis) {
      return res.status(400).json({ 
        message: 'Analysis already exists for this response',
        analysis: existingAnalysis
      });
    }
    
    // Generate analysis
    const analysis = await AiAnalysis.generateAnalysis(
      responseId,
      prompt || 'Analyze this questionnaire response and provide insights.',
      {
        userId: req.user.id,
        modelName: model
      }
    );
    
    res.status(201).json({
      message: 'Analysis generated successfully',
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI analysis for a response
 * @route GET /api/ai-analysis/responses/:responseId
 */
const getAnalysisByResponse = async (req, res, next) => {
  try {
    const { responseId } = req.params;
    
    // Check if response exists
    const response = await Response.findById(responseId);
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    // Get analysis
    const analysis = await AiAnalysis.findByResponse(responseId);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found for this response' });
    }
    
    res.json({
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all AI analyses
 * @route GET /api/ai-analysis
 */
const getAnalyses = async (req, res, next) => {
  try {
    const { created_by_id, model } = req.query;
    
    let analyses;
    
    if (created_by_id) {
      // Get analyses by creator
      analyses = await AiAnalysis.findByCreator(created_by_id);
    } else if (model) {
      // Get analyses by model
      analyses = await AiAnalysis.findByModel(model);
    } else {
      // Get all analyses
      analyses = await AiAnalysis.findAll({
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });
    }
    
    res.json({
      analyses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI analysis by ID
 * @route GET /api/ai-analysis/:id
 */
const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const analysis = await AiAnalysis.findById(id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    res.json({
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete AI analysis
 * @route DELETE /api/ai-analysis/:id
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if analysis exists
    const existingAnalysis = await AiAnalysis.findById(id);
    
    if (!existingAnalysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    // Check if user is authorized to delete
    if (
      existingAnalysis.created_by_id !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this analysis' });
    }
    
    // Delete analysis
    await AiAnalysis.delete(id);
    
    res.json({
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search AI analyses
 * @route GET /api/ai-analysis/search
 */
const searchAnalyses = async (req, res, next) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const analyses = await AiAnalysis.search(term);
    
    res.json({
      analyses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAnalysis,
  getAnalysisByResponse,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
  searchAnalyses
};
