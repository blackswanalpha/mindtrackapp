const BaseModel = require('./BaseModel');

/**
 * Notification model
 */
class Notification extends BaseModel {
  constructor() {
    super('notifications');
  }

  /**
   * Find notifications by user
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of notifications
   */
  async findByUser(userId) {
    return this.findAll({ 
      where: { user_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find unread notifications by user
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of unread notifications
   */
  async findUnreadByUser(userId) {
    return this.findAll({ 
      where: { user_id: userId, is_read: false },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find notifications by type
   * @param {String} type - Notification type
   * @returns {Promise<Array>} - Array of notifications
   */
  async findByType(type) {
    return this.findAll({ 
      where: { type },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Mark notification as read
   * @param {Number} id - Notification ID
   * @returns {Promise<Object|null>} - Updated notification or null
   */
  async markAsRead(id) {
    return this.update(id, { is_read: true });
  }

  /**
   * Mark all notifications as read for a user
   * @param {Number} userId - User ID
   * @returns {Promise<Number>} - Number of updated notifications
   */
  async markAllAsRead(userId) {
    const query = `
      UPDATE ${this.tableName}
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
      RETURNING id
    `;
    
    const result = await this.query(query, [userId]);
    return result.rowCount;
  }

  /**
   * Delete old notifications
   * @param {Number} days - Number of days to keep
   * @returns {Promise<Number>} - Number of deleted notifications
   */
  async deleteOld(days = 30) {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE created_at < NOW() - INTERVAL '${days} days'
      RETURNING id
    `;
    
    const result = await this.query(query);
    return result.rowCount;
  }

  /**
   * Get notification count by user
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - Count object
   */
  async getCountByUser(userId) {
    const query = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread
      FROM ${this.tableName}
      WHERE user_id = $1
    `;
    
    const result = await this.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = new Notification();
