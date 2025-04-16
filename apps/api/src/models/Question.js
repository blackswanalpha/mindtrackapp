const BaseModel = require('./BaseModel');

/**
 * Question model
 */
class Question extends BaseModel {
  constructor() {
    super('questions');
  }

  /**
   * Find questions by questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Array>} - Array of questions
   */
  async findByQuestionnaire(questionnaireId) {
    return this.findAll({ 
      where: { questionnaire_id: questionnaireId },
      orderBy: [{ column: 'order_num', direction: 'ASC' }]
    });
  }

  /**
   * Create multiple questions for a questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @param {Array} questions - Array of question data
   * @returns {Promise<Array>} - Array of created questions
   */
  async createBulk(questionnaireId, questions) {
    const createdQuestions = [];
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Ensure question has the questionnaire ID and order number
      const questionData = {
        ...question,
        questionnaire_id: questionnaireId,
        order_num: question.order_num || i + 1
      };
      
      const createdQuestion = await this.create(questionData);
      createdQuestions.push(createdQuestion);
    }
    
    return createdQuestions;
  }

  /**
   * Reorder questions
   * @param {Array} questionOrders - Array of { id, order_num } objects
   * @returns {Promise<Boolean>} - Success status
   */
  async reorder(questionOrders) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const { id, order_num } of questionOrders) {
        await client.query(
          `UPDATE ${this.tableName} SET order_num = $1, updated_at = NOW() WHERE id = $2`,
          [order_num, id]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find questions by type
   * @param {String} type - Question type
   * @returns {Promise<Array>} - Array of questions
   */
  async findByType(type) {
    return this.findAll({ where: { type } });
  }

  /**
   * Find required questions for a questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Array>} - Array of required questions
   */
  async findRequired(questionnaireId) {
    return this.findAll({ 
      where: { questionnaire_id: questionnaireId, required: true },
      orderBy: [{ column: 'order_num', direction: 'ASC' }]
    });
  }
}

module.exports = new Question();
