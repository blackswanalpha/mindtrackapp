const BaseModel = require('./BaseModel');

/**
 * ScoringConfig model
 */
class ScoringConfig extends BaseModel {
  constructor() {
    super('scoring_configs');
  }

  /**
   * Find scoring config by questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Object|null>} - Scoring config or null
   */
  async findByQuestionnaire(questionnaireId) {
    return this.findOne({ 
      questionnaire_id: questionnaireId,
      is_active: true
    });
  }

  /**
   * Find all scoring configs for a questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Array>} - Array of scoring configs
   */
  async findAllByQuestionnaire(questionnaireId) {
    return this.findAll({ 
      where: { questionnaire_id: questionnaireId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Calculate score for a response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Object>} - Score result
   */
  async calculateScore(responseId) {
    // Get the response with its answers
    const query = `
      SELECT 
        r.id as response_id,
        r.questionnaire_id,
        json_agg(
          json_build_object(
            'question_id', a.question_id,
            'value', a.value,
            'question', json_build_object(
              'id', q.id,
              'type', q.type,
              'scoring_weight', q.scoring_weight
            )
          )
        ) as answers
      FROM responses r
      JOIN answers a ON r.id = a.response_id
      JOIN questions q ON a.question_id = q.id
      WHERE r.id = $1
      GROUP BY r.id, r.questionnaire_id
    `;
    
    const responseResult = await this.query(query, [responseId]);
    const response = responseResult.rows[0];
    
    if (!response) {
      throw new Error('Response not found');
    }
    
    // Get the scoring config
    const scoringConfig = await this.findByQuestionnaire(response.questionnaire_id);
    
    if (!scoringConfig) {
      throw new Error('Scoring configuration not found');
    }
    
    // Calculate score based on scoring method
    let score = 0;
    let totalWeight = 0;
    
    switch (scoringConfig.scoring_method) {
      case 'sum':
        // Sum all answer values
        for (const answer of response.answers) {
          if (this.isNumeric(answer.value)) {
            score += parseInt(answer.value, 10);
          }
        }
        break;
        
      case 'average':
        // Average all answer values
        let validAnswers = 0;
        
        for (const answer of response.answers) {
          if (this.isNumeric(answer.value)) {
            score += parseInt(answer.value, 10);
            validAnswers++;
          }
        }
        
        if (validAnswers > 0) {
          score = score / validAnswers;
        }
        break;
        
      case 'weighted_average':
        // Weighted average based on question weights
        for (const answer of response.answers) {
          if (this.isNumeric(answer.value)) {
            const weight = answer.question.scoring_weight || 1;
            score += parseInt(answer.value, 10) * weight;
            totalWeight += weight;
          }
        }
        
        if (totalWeight > 0) {
          score = score / totalWeight;
        }
        break;
        
      case 'custom':
        // Apply custom scoring rules
        score = this.applyCustomRules(response.answers, scoringConfig.rules);
        break;
        
      default:
        throw new Error(`Unknown scoring method: ${scoringConfig.scoring_method}`);
    }
    
    // Determine risk level
    let riskLevel = 'low';
    const rules = scoringConfig.rules;
    
    if (rules.risk_levels) {
      if (score >= rules.risk_levels.high) {
        riskLevel = 'high';
      } else if (score >= rules.risk_levels.medium) {
        riskLevel = 'medium';
      }
    }
    
    // Update the response with the score and risk level
    const updateQuery = `
      UPDATE responses
      SET score = $1, risk_level = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const updateResult = await this.query(updateQuery, [score, riskLevel, responseId]);
    
    return {
      response: updateResult.rows[0],
      score,
      riskLevel,
      maxScore: scoringConfig.max_score,
      passingScore: scoringConfig.passing_score
    };
  }

  /**
   * Apply custom scoring rules
   * @param {Array} answers - Response answers
   * @param {Object} rules - Custom scoring rules
   * @returns {Number} - Calculated score
   */
  applyCustomRules(answers, rules) {
    let score = 0;
    
    // Example implementation - would need to be customized based on actual rule structure
    if (rules.question_scores) {
      for (const answer of answers) {
        const questionRule = rules.question_scores[answer.question_id];
        
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
  }

  /**
   * Check if a value is numeric
   * @param {*} value - Value to check
   * @returns {Boolean} - Whether value is numeric
   */
  isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}

module.exports = new ScoringConfig();
