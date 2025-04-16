const BaseModel = require('./BaseModel');

/**
 * Answer model
 */
class Answer extends BaseModel {
  constructor() {
    super('answers');
  }

  /**
   * Find answers by response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Array>} - Array of answers
   */
  async findByResponse(responseId) {
    return this.findAll({ where: { response_id: responseId } });
  }

  /**
   * Find answers by question
   * @param {Number} questionId - Question ID
   * @returns {Promise<Array>} - Array of answers
   */
  async findByQuestion(questionId) {
    return this.findAll({ where: { question_id: questionId } });
  }

  /**
   * Create multiple answers for a response
   * @param {Number} responseId - Response ID
   * @param {Array} answers - Array of answer data
   * @returns {Promise<Array>} - Array of created answers
   */
  async createBulk(responseId, answers) {
    const createdAnswers = [];
    
    for (const answer of answers) {
      // Ensure answer has the response ID
      const answerData = {
        ...answer,
        response_id: responseId
      };
      
      const createdAnswer = await this.create(answerData);
      createdAnswers.push(createdAnswer);
    }
    
    return createdAnswers;
  }

  /**
   * Get answer statistics for a question
   * @param {Number} questionId - Question ID
   * @returns {Promise<Object>} - Statistics object
   */
  async getStatistics(questionId) {
    const query = `
      SELECT
        q.type,
        COUNT(a.id) as total_answers,
        CASE
          WHEN q.type IN ('single_choice', 'multiple_choice', 'yes_no') THEN
            json_object_agg(a.value, COUNT(a.id))
          WHEN q.type = 'rating' OR q.type = 'scale' THEN
            json_build_object(
              'average', AVG(a.value::numeric),
              'min', MIN(a.value::numeric),
              'max', MAX(a.value::numeric)
            )
          ELSE NULL
        END as statistics
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.question_id = $1
      GROUP BY q.id, q.type
    `;
    
    const result = await this.query(query, [questionId]);
    return result.rows[0];
  }

  /**
   * Delete all answers for a response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Boolean>} - Success status
   */
  async deleteByResponse(responseId) {
    const query = `DELETE FROM ${this.tableName} WHERE response_id = $1`;
    const result = await this.query(query, [responseId]);
    return result.rowCount > 0;
  }
}

module.exports = new Answer();
