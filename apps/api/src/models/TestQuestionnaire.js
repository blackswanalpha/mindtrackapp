const db = require('../config/db');
const BaseModel = require('./BaseModel');

class TestQuestionnaire extends BaseModel {
  static tableName = 'testquestionnaire';
  
  /**
   * Create a new test questionnaire
   * @param {Object} data - Questionnaire data
   */
  static async create(data) {
    const { title, description, source_url, is_active } = data;
    
    const query = `
      INSERT INTO ${this.tableName} (title, description, source_url, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [title, description, source_url, is_active];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Find all test questionnaires
   */
  static async findAll() {
    const query = `
      SELECT * FROM ${this.tableName}
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query);
    return result.rows;
  }
  
  /**
   * Find test questionnaire by ID
   * @param {number} id - Questionnaire ID
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
   * Update test questionnaire
   * @param {number} id - Questionnaire ID
   * @param {Object} data - Updated data
   */
  static async update(id, data) {
    const { title, description, is_active } = data;
    
    const query = `
      UPDATE ${this.tableName}
      SET title = $1, description = $2, is_active = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    
    const values = [title, description, is_active, id];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Delete test questionnaire
   * @param {number} id - Questionnaire ID
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

module.exports = TestQuestionnaire;
