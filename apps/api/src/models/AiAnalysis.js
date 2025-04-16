const BaseModel = require('./BaseModel');

/**
 * AiAnalysis model
 */
class AiAnalysis extends BaseModel {
  constructor() {
    super('ai_analyses');
  }

  /**
   * Find analysis by response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Object|null>} - Analysis or null
   */
  async findByResponse(responseId) {
    return this.findOne({ response_id: responseId });
  }

  /**
   * Find analyses by creator
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of analyses
   */
  async findByCreator(userId) {
    return this.findAll({ 
      where: { created_by_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find analyses by model
   * @param {String} modelName - AI model name
   * @returns {Promise<Array>} - Array of analyses
   */
  async findByModel(modelName) {
    return this.findAll({ 
      where: { model_used: modelName },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Generate analysis for a response
   * @param {Number} responseId - Response ID
   * @param {String} prompt - Analysis prompt
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Generated analysis
   */
  async generateAnalysis(responseId, prompt, options = {}) {
    // In a real implementation, this would call an AI service
    // For now, we'll simulate a response
    
    const { userId, modelName = 'gpt-4' } = options;
    
    // Get the response with its answers
    const query = `
      SELECT 
        r.*,
        json_agg(
          json_build_object(
            'question_id', a.question_id,
            'value', a.value,
            'question', json_build_object(
              'id', q.id,
              'text', q.text,
              'type', q.type
            )
          )
        ) as answers
      FROM responses r
      JOIN answers a ON r.id = a.response_id
      JOIN questions q ON a.question_id = q.id
      WHERE r.id = $1
      GROUP BY r.id
    `;
    
    const responseResult = await this.query(query, [responseId]);
    const response = responseResult.rows[0];
    
    if (!response) {
      throw new Error('Response not found');
    }
    
    // Simulate AI analysis
    const analysis = `This is a simulated AI analysis for response ${responseId}.
Based on the answers provided, the patient shows signs of mild anxiety.
The score of ${response.score || 'N/A'} indicates a ${response.risk_level || 'low'} risk level.`;
    
    const recommendations = `
1. Consider follow-up assessment in 2 weeks
2. Provide resources for stress management
3. Encourage regular physical activity
4. Suggest mindfulness practices`;
    
    const riskAssessment = `
Risk Level: ${response.risk_level || 'Low'}
Primary Concerns: Anxiety, stress
Recommended Action: Routine follow-up`;
    
    // Create the analysis record
    return this.create({
      response_id: responseId,
      prompt,
      analysis,
      recommendations,
      risk_assessment: riskAssessment,
      model_used: modelName,
      created_by_id: userId
    });
  }

  /**
   * Search analyses by content
   * @param {String} searchTerm - Search term
   * @returns {Promise<Array>} - Array of matching analyses
   */
  async search(searchTerm) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE analysis ILIKE $1 OR recommendations ILIKE $1 OR risk_assessment ILIKE $1
      ORDER BY created_at DESC
    `;
    
    const result = await this.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = new AiAnalysis();
