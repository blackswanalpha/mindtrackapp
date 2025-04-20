const BaseModel = require('./BaseModel');

/**
 * UserMetric model
 */
class UserMetric extends BaseModel {
  constructor() {
    super('user_metrics');
  }

  /**
   * Find metrics by user
   * @param {Number} userId - User ID
   * @returns {Promise<Object|null>} - User metrics or null
   */
  async findByUser(userId) {
    return this.findOne({ user_id: userId });
  }

  /**
   * Increment login count for a user
   * @param {Number} userId - User ID
   * @returns {Promise<Object|null>} - Updated metrics or null
   */
  async incrementLoginCount(userId) {
    const metrics = await this.findByUser(userId);
    
    if (metrics) {
      // Update existing metrics
      return this.update(metrics.id, {
        login_count: metrics.login_count + 1,
        last_active_at: new Date()
      });
    } else {
      // Create new metrics
      return this.create({
        user_id: userId,
        login_count: 1,
        questionnaires_created: 0,
        responses_submitted: 0,
        last_active_at: new Date()
      });
    }
  }

  /**
   * Increment questionnaires created count for a user
   * @param {Number} userId - User ID
   * @returns {Promise<Object|null>} - Updated metrics or null
   */
  async incrementQuestionnairesCreated(userId) {
    const metrics = await this.findByUser(userId);
    
    if (metrics) {
      // Update existing metrics
      return this.update(metrics.id, {
        questionnaires_created: metrics.questionnaires_created + 1,
        last_active_at: new Date()
      });
    } else {
      // Create new metrics
      return this.create({
        user_id: userId,
        login_count: 0,
        questionnaires_created: 1,
        responses_submitted: 0,
        last_active_at: new Date()
      });
    }
  }

  /**
   * Increment responses submitted count for a user
   * @param {Number} userId - User ID
   * @returns {Promise<Object|null>} - Updated metrics or null
   */
  async incrementResponsesSubmitted(userId) {
    const metrics = await this.findByUser(userId);
    
    if (metrics) {
      // Update existing metrics
      return this.update(metrics.id, {
        responses_submitted: metrics.responses_submitted + 1,
        last_active_at: new Date()
      });
    } else {
      // Create new metrics
      return this.create({
        user_id: userId,
        login_count: 0,
        questionnaires_created: 0,
        responses_submitted: 1,
        last_active_at: new Date()
      });
    }
  }

  /**
   * Update last active timestamp for a user
   * @param {Number} userId - User ID
   * @returns {Promise<Object|null>} - Updated metrics or null
   */
  async updateLastActive(userId) {
    const metrics = await this.findByUser(userId);
    
    if (metrics) {
      // Update existing metrics
      return this.update(metrics.id, {
        last_active_at: new Date()
      });
    } else {
      // Create new metrics
      return this.create({
        user_id: userId,
        login_count: 0,
        questionnaires_created: 0,
        responses_submitted: 0,
        last_active_at: new Date()
      });
    }
  }

  /**
   * Get most active users
   * @param {Number} limit - Number of users to return
   * @returns {Promise<Array>} - Array of user metrics
   */
  async getMostActive(limit = 10) {
    const query = `
      SELECT 
        um.*,
        u.name,
        u.email,
        u.role
      FROM ${this.tableName} um
      JOIN users u ON um.user_id = u.id
      ORDER BY (login_count + questionnaires_created + responses_submitted) DESC
      LIMIT $1
    `;
    
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  /**
   * Get recently active users
   * @param {Number} limit - Number of users to return
   * @returns {Promise<Array>} - Array of user metrics
   */
  async getRecentlyActive(limit = 10) {
    const query = `
      SELECT 
        um.*,
        u.name,
        u.email,
        u.role
      FROM ${this.tableName} um
      JOIN users u ON um.user_id = u.id
      WHERE last_active_at IS NOT NULL
      ORDER BY last_active_at DESC
      LIMIT $1
    `;
    
    const result = await this.query(query, [limit]);
    return result.rows;
  }
}

module.exports = new UserMetric();
