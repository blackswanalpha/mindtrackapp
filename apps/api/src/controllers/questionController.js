const Question = require('../models/Question');
const Questionnaire = require('../models/Questionnaire');
const Answer = require('../models/Answer');

/**
 * Get all questions for a questionnaire
 * @route GET /api/questionnaires/:questionnaireId/questions
 */
const getQuestions = async (req, res, next) => {
  try {
    const { questionnaireId } = req.params;
    
    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    
    // Get questions
    const questions = await Question.findByQuestionnaire(questionnaireId);
    
    res.json({
      questions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question by ID
 * @route GET /api/questions/:id
 */
const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({
      question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create question
 * @route POST /api/questionnaires/:questionnaireId/questions
 */
const createQuestion = async (req, res, next) => {
  try {
    const { questionnaireId } = req.params;
    const {
      text,
      description,
      type,
      required,
      order_num,
      options,
      conditional_logic,
      validation_rules,
      scoring_weight
    } = req.body;
    
    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    
    // Check if user is authorized to add questions
    if (questionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add questions to this questionnaire' });
    }
    
    // Get max order number if not provided
    let orderNum = order_num;
    if (!orderNum) {
      const questions = await Question.findByQuestionnaire(questionnaireId);
      orderNum = questions.length > 0 ? Math.max(...questions.map(q => q.order_num)) + 1 : 1;
    }
    
    // Create question
    const question = await Question.create({
      questionnaire_id: questionnaireId,
      text,
      description,
      type,
      required: required !== undefined ? required : true,
      order_num: orderNum,
      options: options ? JSON.stringify(options) : null,
      conditional_logic: conditional_logic ? JSON.stringify(conditional_logic) : null,
      validation_rules: validation_rules ? JSON.stringify(validation_rules) : null,
      scoring_weight: scoring_weight || 1
    });
    
    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update question
 * @route PUT /api/questions/:id
 */
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      text,
      description,
      type,
      required,
      order_num,
      options,
      conditional_logic,
      validation_rules,
      scoring_weight
    } = req.body;
    
    // Check if question exists
    const existingQuestion = await Question.findById(id);
    
    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is authorized to update
    const questionnaire = await Questionnaire.findById(existingQuestion.questionnaire_id);
    
    if (questionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }
    
    // Update question
    const updatedQuestion = await Question.update(id, {
      text,
      description,
      type,
      required,
      order_num,
      options: options ? JSON.stringify(options) : existingQuestion.options,
      conditional_logic: conditional_logic ? JSON.stringify(conditional_logic) : existingQuestion.conditional_logic,
      validation_rules: validation_rules ? JSON.stringify(validation_rules) : existingQuestion.validation_rules,
      scoring_weight
    });
    
    res.json({
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete question
 * @route DELETE /api/questions/:id
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if question exists
    const existingQuestion = await Question.findById(id);
    
    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is authorized to delete
    const questionnaire = await Questionnaire.findById(existingQuestion.questionnaire_id);
    
    if (questionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }
    
    // Delete question
    await Question.delete(id);
    
    res.json({
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder questions
 * @route PUT /api/questionnaires/:questionnaireId/questions/reorder
 */
const reorderQuestions = async (req, res, next) => {
  try {
    const { questionnaireId } = req.params;
    const { questions } = req.body;
    
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions must be an array' });
    }
    
    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    
    // Check if user is authorized to reorder
    if (questionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to reorder questions in this questionnaire' });
    }
    
    // Reorder questions
    await Question.reorder(questions);
    
    res.json({
      message: 'Questions reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question statistics
 * @route GET /api/questions/:id/statistics
 */
const getQuestionStatistics = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if question exists
    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Get answer statistics
    const statistics = await Answer.getStatistics(id);
    
    res.json({
      statistics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  getQuestionStatistics
};
