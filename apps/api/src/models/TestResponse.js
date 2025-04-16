const db = require('../config/db');
const BaseModel = require('./BaseModel');

class TestResponse extends BaseModel {
  static tableName = 'testresponse';
  
  /**
   * Create a new test response
   * @param {Object} data - Response data
   */
  static async create(data) {
    const { questionnaire_id, respondent_email, unique_code, response_data, completed } = data;
    
    const query = `
      INSERT INTO ${this.tableName} (questionnaire_id, respondent_email, unique_code, response_data, completed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [questionnaire_id, respondent_email, unique_code, response_data, completed];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Find all test responses
   */
  static async findAll() {
    const query = `
      SELECT r.*, q.title as questionnaire_title
      FROM ${this.tableName} r
      JOIN testquestionnaire q ON r.questionnaire_id = q.id
      ORDER BY r.created_at DESC
    `;
    
    const result = await db.query(query);
    return result.rows;
  }
  
  /**
   * Find test responses by questionnaire ID
   * @param {number} questionnaireId - Questionnaire ID
   */
  static async findByQuestionnaire(questionnaireId) {
    const query = `
      SELECT r.*, q.title as questionnaire_title
      FROM ${this.tableName} r
      JOIN testquestionnaire q ON r.questionnaire_id = q.id
      WHERE r.questionnaire_id = $1
      ORDER BY r.created_at DESC
    `;
    
    const result = await db.query(query, [questionnaireId]);
    return result.rows;
  }
  
  /**
   * Find test response by ID
   * @param {number} id - Response ID
   */
  static async findById(id) {
    const query = `
      SELECT r.*, q.title as questionnaire_title
      FROM ${this.tableName} r
      JOIN testquestionnaire q ON r.questionnaire_id = q.id
      WHERE r.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  /**
   * Find test response by unique code
   * @param {string} code - Unique code
   */
  static async findByUniqueCode(code) {
    const query = `
      SELECT r.*, q.title as questionnaire_title
      FROM ${this.tableName} r
      JOIN testquestionnaire q ON r.questionnaire_id = q.id
      WHERE r.unique_code = $1
    `;
    
    const result = await db.query(query, [code]);
    return result.rows[0];
  }
  
  /**
   * Update test response
   * @param {number} id - Response ID
   * @param {Object} data - Updated data
   */
  static async update(id, data) {
    const { response_data, completed } = data;
    
    const query = `
      UPDATE ${this.tableName}
      SET response_data = $1, completed = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const values = [response_data, completed, id];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Delete test response
   * @param {number} id - Response ID
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

module.exports = TestResponse;
