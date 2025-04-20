const BaseModel = require('./BaseModel');

/**
 * AuditLog model
 */
class AuditLog extends BaseModel {
  constructor() {
    super('audit_logs');
  }

  /**
   * Find audit logs by user
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of audit logs
   */
  async findByUser(userId) {
    return this.findAll({ 
      where: { user_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find audit logs by action
   * @param {String} action - Action type
   * @returns {Promise<Array>} - Array of audit logs
   */
  async findByAction(action) {
    return this.findAll({ 
      where: { action },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find audit logs by entity
   * @param {String} entityType - Entity type
   * @param {Number} entityId - Entity ID
   * @returns {Promise<Array>} - Array of audit logs
   */
  async findByEntity(entityType, entityId) {
    return this.findAll({ 
      where: { entity_type: entityType, entity_id: entityId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find audit logs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} - Array of audit logs
   */
  async findByDateRange(startDate, endDate) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE created_at BETWEEN $1 AND $2
      ORDER BY created_at DESC
    `;
    
    const result = await this.query(query, [startDate, endDate]);
    return result.rows;
  }

  /**
   * Find audit logs by IP address
   * @param {String} ipAddress - IP address
   * @returns {Promise<Array>} - Array of audit logs
   */
  async findByIpAddress(ipAddress) {
    return this.findAll({ 
      where: { ip_address: ipAddress },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Log an action
   * @param {Object} data - Audit log data
   * @param {Number} data.user_id - User ID
   * @param {String} data.action - Action type
   * @param {String} data.entity_type - Entity type
   * @param {Number} data.entity_id - Entity ID
   * @param {Object} data.details - Additional details
   * @param {String} data.ip_address - IP address
   * @returns {Promise<Object>} - Created audit log
   */
  async logAction(data) {
    return this.create({
      user_id: data.user_id,
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      details: data.details ? JSON.stringify(data.details) : null,
      ip_address: data.ip_address,
      created_at: new Date()
    });
  }

  /**
   * Get audit statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_logs,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT action) as unique_actions,
        COUNT(DISTINCT entity_type) as unique_entity_types,
        MIN(created_at) as first_log,
        MAX(created_at) as last_log
      FROM ${this.tableName}
    `;
    
    const result = await this.query(query);
    return result.rows[0];
  }
}

module.exports = new AuditLog();
