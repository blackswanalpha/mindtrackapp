/**
 * Scoring Service
 */

const ScoringConfig = require('../models/ScoringConfig');
const Response = require('../models/Response');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

/**
 * Calculate score for a response
 * @param {Number} responseId - Response ID
 * @returns {Promise<Object>} - Score result
 */
const calculateScore = async (responseId) => {
  try {
    // Get response
    const response = await Response.findById(responseId);
    
    if (!response) {
      throw new Error('Response not found');
    }
    
    // Get scoring config for the questionnaire
    const scoringConfig = await ScoringConfig.findByQuestionnaire(response.questionnaire_id);
    
    if (!scoringConfig) {
      throw new Error('Scoring configuration not found for this questionnaire');
    }
    
    // Get answers
    const answers = await Answer.findByResponse(responseId);
    
    if (!answers || answers.length === 0) {
      throw new Error('No answers found for this response');
    }
    
    // Get questions for additional context
    const questions = await Question.findByQuestionnaire(response.questionnaire_id);
    
    // Prepare answers with question context
    const answersWithContext = answers.map(answer => {
      const question = questions.find(q => q.id === answer.question_id);
      return {
        ...answer,
        question: question || null
      };
    });
    
    // Calculate score based on scoring method
    let score = 0;
    let totalWeight = 0;
    
    switch (scoringConfig.scoring_method) {
      case 'sum':
        // Sum all answer values
        for (const answer of answers) {
          if (isNumeric(answer.value)) {
            score += parseInt(answer.value, 10);
          } else if (answer.score) {
            score += answer.score;
          }
        }
        break;
        
      case 'average':
        // Average all answer values
        let validAnswers = 0;
        
        for (const answer of answers) {
          if (isNumeric(answer.value)) {
            score += parseInt(answer.value, 10);
            validAnswers++;
          } else if (answer.score) {
            score += answer.score;
            validAnswers++;
          }
        }
        
        if (validAnswers > 0) {
          score = Math.round(score / validAnswers);
        }
        break;
        
      case 'weighted_average':
        // Weighted average based on question weights
        for (const answer of answersWithContext) {
          if (answer.question && answer.question.scoring_weight) {
            const weight = answer.question.scoring_weight;
            
            if (isNumeric(answer.value)) {
              score += parseInt(answer.value, 10) * weight;
            } else if (answer.score) {
              score += answer.score * weight;
            }
            
            totalWeight += weight;
          }
        }
        
        if (totalWeight > 0) {
          score = Math.round(score / totalWeight);
        }
        break;
        
      case 'custom':
        // Apply custom scoring rules
        score = applyCustomRules(answersWithContext, scoringConfig.rules);
        break;
        
      default:
        throw new Error(`Unknown scoring method: ${scoringConfig.scoring_method}`);
    }
    
    // Determine risk level
    let riskLevel = 'low';
    const rules = scoringConfig.rules || {};
    
    if (rules.risk_levels) {
      if (score >= rules.risk_levels.high) {
        riskLevel = 'high';
      } else if (score >= rules.risk_levels.medium) {
        riskLevel = 'medium';
      }
    }
    
    // Update the response with the score and risk level
    const updatedResponse = await Response.update(responseId, {
      score,
      risk_level: riskLevel
    });
    
    return {
      response: updatedResponse,
      score,
      riskLevel,
      maxScore: scoringConfig.max_score,
      passingScore: scoringConfig.passing_score
    };
  } catch (error) {
    console.error('Error calculating score:', error);
    throw error;
  }
};

/**
 * Apply custom scoring rules
 * @param {Array} answers - Response answers with question context
 * @param {Object} rules - Custom scoring rules
 * @returns {Number} - Calculated score
 */
const applyCustomRules = (answers, rules) => {
  let score = 0;
  
  // Example implementation - would need to be customized based on actual rule structure
  if (rules.question_scores) {
    for (const answer of answers) {
      if (!answer.question) continue;
      
      const questionRule = rules.question_scores[answer.question.id];
      
      if (questionRule) {
        if (questionRule.values && questionRule.values[answer.value]) {
          score += questionRule.values[answer.value];
        } else if (questionRule.default) {
          score += questionRule.default;
        }
      }
    }
  }
  
  return score;
};

/**
 * Check if a value is numeric
 * @param {*} value - Value to check
 * @returns {Boolean} - Whether value is numeric
 */
const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

module.exports = {
  calculateScore
};
