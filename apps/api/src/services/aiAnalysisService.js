/**
 * AI Analysis Service
 */

const AIAnalysis = require('../models/AIAnalysis');
const Response = require('../models/Response');
const Answer = require('../models/Answer');
const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');

/**
 * Generate AI analysis for a response
 * @param {Number} responseId - Response ID
 * @param {Number} userId - User ID of the creator
 * @returns {Promise<Object>} - Generated analysis
 */
const generateAnalysis = async (responseId, userId) => {
  try {
    // Get response with answers
    const response = await Response.findById(responseId);
    
    if (!response) {
      throw new Error('Response not found');
    }
    
    // Get questionnaire
    const questionnaire = await Questionnaire.findById(response.questionnaire_id);
    
    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }
    
    // Get answers
    const answers = await Answer.findByResponse(responseId);
    
    if (!answers || answers.length === 0) {
      throw new Error('No answers found for this response');
    }
    
    // Get questions
    const questions = await Question.findByQuestionnaire(response.questionnaire_id);
    
    // Prepare data for analysis
    const analysisData = {
      questionnaire: {
        title: questionnaire.title,
        description: questionnaire.description,
        type: questionnaire.type
      },
      response: {
        id: response.id,
        score: response.score,
        risk_level: response.risk_level,
        completed_at: response.completed_at
      },
      answers: await Promise.all(answers.map(async (answer) => {
        const question = questions.find(q => q.id === answer.question_id);
        return {
          question: question ? question.text : 'Unknown question',
          question_type: question ? question.type : 'unknown',
          answer: answer.value,
          score: answer.score
        };
      }))
    };
    
    // In a real implementation, this would call an AI service
    // For now, we'll generate a simple analysis based on the data
    
    // Generate analysis text
    const analysisText = generateAnalysisText(analysisData);
    
    // Generate recommendations
    const recommendations = generateRecommendations(analysisData);
    
    // Create analysis record
    const analysis = await AIAnalysis.create({
      response_id: responseId,
      analysis_text: analysisText,
      recommendations: recommendations,
      confidence_score: 0.85, // Mock confidence score
      model_used: 'gpt-4', // Mock model name
      created_by_id: userId
    });
    
    return analysis;
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw error;
  }
};

/**
 * Generate analysis text based on response data
 * @param {Object} data - Response data
 * @returns {String} - Analysis text
 */
const generateAnalysisText = (data) => {
  // In a real implementation, this would use an AI model
  // For now, we'll generate a simple analysis
  
  const { questionnaire, response, answers } = data;
  
  let analysisText = `Analysis of ${questionnaire.title} (ID: ${response.id}):\n\n`;
  
  // Add score information
  if (response.score !== null && response.score !== undefined) {
    analysisText += `The respondent scored ${response.score} points`;
    
    if (response.risk_level) {
      analysisText += `, indicating a ${response.risk_level} risk level.\n\n`;
    } else {
      analysisText += '.\n\n';
    }
  }
  
  // Add answer analysis
  analysisText += 'Key observations:\n';
  
  // Analyze multiple choice/rating questions
  const ratingAnswers = answers.filter(a => 
    ['rating', 'scale', 'single_choice', 'multiple_choice'].includes(a.question_type)
  );
  
  if (ratingAnswers.length > 0) {
    // Find high-scoring answers
    const highScoreAnswers = ratingAnswers.filter(a => a.score >= 2);
    
    if (highScoreAnswers.length > 0) {
      analysisText += '\nAreas of concern:\n';
      highScoreAnswers.forEach(a => {
        analysisText += `- ${a.question}: ${a.answer}\n`;
      });
    }
    
    // Find low-scoring answers
    const lowScoreAnswers = ratingAnswers.filter(a => a.score === 0);
    
    if (lowScoreAnswers.length > 0) {
      analysisText += '\nPositive indicators:\n';
      lowScoreAnswers.forEach(a => {
        analysisText += `- ${a.question}: ${a.answer}\n`;
      });
    }
  }
  
  // Add text answers
  const textAnswers = answers.filter(a => a.question_type === 'text');
  
  if (textAnswers.length > 0) {
    analysisText += '\nText responses:\n';
    textAnswers.forEach(a => {
      analysisText += `- ${a.question}: "${a.answer}"\n`;
    });
  }
  
  return analysisText;
};

/**
 * Generate recommendations based on response data
 * @param {Object} data - Response data
 * @returns {String} - Recommendations text
 */
const generateRecommendations = (data) => {
  // In a real implementation, this would use an AI model
  // For now, we'll generate simple recommendations
  
  const { response } = data;
  
  let recommendations = 'Recommendations:\n\n';
  
  if (response.risk_level === 'high') {
    recommendations += '1. Immediate follow-up is recommended.\n';
    recommendations += '2. Consider scheduling an in-person assessment.\n';
    recommendations += '3. Review the specific high-scoring items for targeted intervention.\n';
  } else if (response.risk_level === 'medium') {
    recommendations += '1. Follow-up within the next week is recommended.\n';
    recommendations += '2. Consider additional screening for specific areas of concern.\n';
    recommendations += '3. Provide resources for self-help and support.\n';
  } else {
    recommendations += '1. Routine follow-up is recommended.\n';
    recommendations += '2. Provide general wellness resources.\n';
    recommendations += '3. Consider periodic reassessment in 3-6 months.\n';
  }
  
  return recommendations;
};

module.exports = {
  generateAnalysis
};
