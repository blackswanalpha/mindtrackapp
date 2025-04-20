const BaseModel = require('./BaseModel');

/**
 * Session model
 */
class Session extends BaseModel {
  constructor() {
    super('sessions');
  }

  /**
   * Find session by token
   * @param {String} token - Session token
   * @returns {Promise<Object|null>} - Session or null
   */
  async findByToken(token) {
    return this.findOne({ token });
  }

  /**
   * Find sessions by user
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of sessions
   */
  async findByUser(userId) {
    return this.findAll({ 
      where: { user_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find active sessions
   * @returns {Promise<Array>} - Array of active sessions
   */
  async findActive() {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE expires_at > NOW()
      ORDER BY created_at DESC
    `;
    
    const result = await this.query(query);
    return result.rows;
  }

  /**
   * Find expired sessions
   * @returns {Promise<Array>} - Array of expired sessions
   */
  async findExpired() {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE expires_at <= NOW()
      ORDER BY expires_at DESC
    `;
    
    const result = await this.query(query);
    return result.rows;
  }

  /**
   * Delete expired sessions
   * @returns {Promise<Number>} - Number of deleted sessions
   */
  async deleteExpired() {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE expires_at <= NOW()
      RETURNING id
    `;
    
    const result = await this.query(query);
    return result.rowCount;
  }

  /**
   * Delete all sessions for a user
   * @param {Number} userId - User ID
   * @returns {Promise<Number>} - Number of deleted sessions
   */
  async deleteByUser(userId) {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE user_id = $1
      RETURNING id
    `;
    
    const result = await this.query(query, [userId]);
    return result.rowCount;
  }

  /**
   * Delete all sessions except current
   * @param {Number} userId - User ID
   * @param {String} currentToken - Current session token
   * @returns {Promise<Number>} - Number of deleted sessions
   */
  async deleteOtherSessions(userId, currentToken) {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE user_id = $1 AND token != $2
      RETURNING id
    `;
    
    const result = await this.query(query, [userId, currentToken]);
    return result.rowCount;
  }
}

module.exports = new Session();
