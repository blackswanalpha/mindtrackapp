const BaseModel = require('./BaseModel');

/**
 * EmailLog model
 */
class EmailLog extends BaseModel {
  constructor() {
    super('email_logs');
  }

  /**
   * Find email logs by sender
   * @param {Number} userId - User ID of sender
   * @returns {Promise<Array>} - Array of email logs
   */
  async findBySender(userId) {
    return this.findAll({ 
      where: { sent_by_id: userId },
      orderBy: [{ column: 'sent_at', direction: 'DESC' }]
    });
  }

  /**
   * Find email logs by recipient
   * @param {String} recipient - Recipient email
   * @returns {Promise<Array>} - Array of email logs
   */
  async findByRecipient(recipient) {
    return this.findAll({ 
      where: { recipient },
      orderBy: [{ column: 'sent_at', direction: 'DESC' }]
    });
  }

  /**
   * Find email logs by template
   * @param {Number} templateId - Template ID
   * @returns {Promise<Array>} - Array of email logs
   */
  async findByTemplate(templateId) {
    return this.findAll({ 
      where: { template_id: templateId },
      orderBy: [{ column: 'sent_at', direction: 'DESC' }]
    });
  }

  /**
   * Find email logs by response
   * @param {Number} responseId - Response ID
   * @returns {Promise<Array>} - Array of email logs
   */
  async findByResponse(responseId) {
    return this.findAll({ 
      where: { response_id: responseId },
      orderBy: [{ column: 'sent_at', direction: 'DESC' }]
    });
  }

  /**
   * Get email statistics
   * @returns {Promise<Object>} - Email statistics
   */
  async getStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_emails,
        COUNT(DISTINCT recipient) as unique_recipients,
        COUNT(DISTINCT template_id) as templates_used,
        COUNT(DISTINCT sent_by_id) as unique_senders,
        MAX(sent_at) as last_sent_at
      FROM ${this.tableName}
    `;
    
    const result = await this.query(query);
    return result.rows[0];
  }
}

module.exports = new EmailLog();
