const BaseModel = require('./BaseModel');

/**
 * EmailTemplate model
 */
class EmailTemplate extends BaseModel {
  constructor() {
    super('email_templates');
  }

  /**
   * Find email templates by creator
   * @param {Number} userId - User ID of creator
   * @returns {Promise<Array>} - Array of email templates
   */
  async findByCreator(userId) {
    return this.findAll({ 
      where: { created_by_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find email template by name
   * @param {String} name - Template name
   * @returns {Promise<Object|null>} - Email template or null
   */
  async findByName(name) {
    return this.findOne({ name });
  }

  /**
   * Search email templates
   * @param {String} searchTerm - Search term
   * @returns {Promise<Array>} - Array of matching email templates
   */
  async search(searchTerm) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE name ILIKE $1 OR subject ILIKE $1
    `;
    
    const result = await this.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = new EmailTemplate();
