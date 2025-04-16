const BaseModel = require('./BaseModel');

/**
 * Questionnaire model
 */
class Questionnaire extends BaseModel {
  constructor() {
    super('questionnaires');
  }

  /**
   * Find questionnaires by creator
   * @param {Number} userId - User ID of creator
   * @returns {Promise<Array>} - Array of questionnaires
   */
  async findByCreator(userId) {
    return this.findAll({ where: { created_by_id: userId } });
  }

  /**
   * Find questionnaires by organization
   * @param {Number} organizationId - Organization ID
   * @returns {Promise<Array>} - Array of questionnaires
   */
  async findByOrganization(organizationId) {
    return this.findAll({ where: { organization_id: organizationId } });
  }

  /**
   * Find active questionnaires
   * @returns {Promise<Array>} - Array of active questionnaires
   */
  async findActive() {
    return this.findAll({ where: { is_active: true } });
  }

  /**
   * Find public questionnaires
   * @returns {Promise<Array>} - Array of public questionnaires
   */
  async findPublic() {
    return this.findAll({ where: { is_public: true, is_active: true } });
  }

  /**
   * Find questionnaire templates
   * @returns {Promise<Array>} - Array of template questionnaires
   */
  async findTemplates() {
    return this.findAll({ where: { is_template: true } });
  }

  /**
   * Create a new version of a questionnaire
   * @param {Number} parentId - Parent questionnaire ID
   * @param {Object} data - New questionnaire data
   * @returns {Promise<Object>} - Created questionnaire
   */
  async createVersion(parentId, data) {
    const parent = await this.findById(parentId);
    
    if (!parent) {
      throw new Error('Parent questionnaire not found');
    }
    
    // Get the current max version
    const query = 'SELECT MAX(version) as max_version FROM questionnaires WHERE parent_id = $1 OR id = $1';
    const result = await this.query(query, [parentId]);
    const maxVersion = result.rows[0].max_version || 1;
    
    // Create new version
    return this.create({
      ...data,
      parent_id: parentId,
      version: maxVersion + 1
    });
  }

  /**
   * Find questionnaires by tag
   * @param {String} tag - Tag to search for
   * @returns {Promise<Array>} - Array of questionnaires
   */
  async findByTag(tag) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE tags @> $1
    `;
    
    const result = await this.query(query, [JSON.stringify([tag])]);
    return result.rows;
  }

  /**
   * Search questionnaires by title or description
   * @param {String} searchTerm - Search term
   * @returns {Promise<Array>} - Array of matching questionnaires
   */
  async search(searchTerm) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE title ILIKE $1 OR description ILIKE $1
    `;
    
    const result = await this.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = new Questionnaire();
