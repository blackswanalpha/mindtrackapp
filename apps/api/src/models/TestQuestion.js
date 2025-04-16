const db = require('../config/db');
const BaseModel = require('./BaseModel');

class TestQuestion extends BaseModel {
  static tableName = 'testquestion';
  
  /**
   * Create a new test question
   * @param {Object} data - Question data
   */
  static async create(data) {
    const { questionnaire_id, text, type, required, options, order_num } = data;
    
    const query = `
      INSERT INTO ${this.tableName} (questionnaire_id, text, type, required, options, order_num, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [questionnaire_id, text, type, required, options, order_num];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Create multiple questions for a questionnaire
   * @param {number} questionnaireId - Questionnaire ID
   * @param {Array} questions - Array of question objects
   */
  static async createBulk(questionnaireId, questions) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      for (const question of questions) {
        const query = `
          INSERT INTO ${this.tableName} (questionnaire_id, text, type, required, options, order_num, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `;
        
        const values = [
          questionnaireId,
          question.text,
          question.type,
          question.required,
          question.options,
          question.order_num
        ];
        
        await client.query(query, values);
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
   * Find questions by questionnaire ID
   * @param {number} questionnaireId - Questionnaire ID
   */
  static async findByQuestionnaire(questionnaireId) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE questionnaire_id = $1
      ORDER BY order_num ASC
    `;
    
    const result = await db.query(query, [questionnaireId]);
    return result.rows;
  }
  
  /**
   * Find question by ID
   * @param {number} id - Question ID
   */
  static async findById(id) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  /**
   * Update question
   * @param {number} id - Question ID
   * @param {Object} data - Updated data
   */
  static async update(id, data) {
    const { text, type, required, options, order_num } = data;
    
    const query = `
      UPDATE ${this.tableName}
      SET text = $1, type = $2, required = $3, options = $4, order_num = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    
    const values = [text, type, required, options, order_num, id];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Delete question
   * @param {number} id - Question ID
   */
  static async delete(id) {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = TestQuestion;
