const BaseModel = require('./BaseModel');

/**
 * AIAnalysis model
 */
class AIAnalysis extends BaseModel {
  constructor() {
    super('ai_analyses');
  }

  /**
   * Find analyses by response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Array>} - Array of analyses
   */
  async findByResponse(responseId) {
    return this.findAll({ 
      where: { response_id: responseId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find analyses by creator
   * @param {Number} userId - User ID of creator
   * @returns {Promise<Array>} - Array of analyses
   */
  async findByCreator(userId) {
    return this.findAll({ 
      where: { created_by_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find latest analysis for a response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Object|null>} - Latest analysis or null
   */
  async findLatestByResponse(responseId) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE response_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await this.query(query, [responseId]);
    return result.rows[0] || null;
  }

  /**
   * Find analyses with high confidence
   * @param {Number} threshold - Confidence threshold (0-1)
   * @returns {Promise<Array>} - Array of analyses
   */
  async findHighConfidence(threshold = 0.8) {
    return this.findAll({ 
      where: { confidence_score: { operator: '>=', value: threshold } },
      orderBy: [{ column: 'confidence_score', direction: 'DESC' }]
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
      WHERE analysis_text ILIKE $1 OR recommendations ILIKE $1
      ORDER BY created_at DESC
    `;
    
    const result = await this.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Get analysis statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_analyses,
        AVG(confidence_score) as avg_confidence,
        MIN(created_at) as first_analysis,
        MAX(created_at) as last_analysis
      FROM ${this.tableName}
    `;
    
    const result = await this.query(query);
    return result.rows[0];
  }
}

module.exports = new AIAnalysis();
