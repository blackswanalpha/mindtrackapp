const BaseModel = require('./BaseModel');

/**
 * QuestionnaireTag model
 */
class QuestionnaireTag extends BaseModel {
  constructor() {
    super('questionnaire_tags');
  }

  /**
   * Find tag by name
   * @param {String} name - Tag name
   * @returns {Promise<Object|null>} - Tag or null
   */
  async findByName(name) {
    return this.findOne({ name });
  }

  /**
   * Find tags by questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Array>} - Array of tags
   */
  async findByQuestionnaire(questionnaireId) {
    const query = `
      SELECT t.*
      FROM ${this.tableName} t
      JOIN questionnaire_tag_mappings m ON t.id = m.tag_id
      WHERE m.questionnaire_id = $1
      ORDER BY t.name
    `;
    
    const result = await this.query(query, [questionnaireId]);
    return result.rows;
  }

  /**
   * Add tag to questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @param {Number} tagId - Tag ID
   * @returns {Promise<Boolean>} - Success status
   */
  async addToQuestionnaire(questionnaireId, tagId) {
    try {
      const query = `
        INSERT INTO questionnaire_tag_mappings (questionnaire_id, tag_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (questionnaire_id, tag_id) DO NOTHING
      `;
      
      await this.query(query, [questionnaireId, tagId]);
      return true;
    } catch (error) {
      console.error('Error adding tag to questionnaire:', error);
      return false;
    }
  }

  /**
   * Remove tag from questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @param {Number} tagId - Tag ID
   * @returns {Promise<Boolean>} - Success status
   */
  async removeFromQuestionnaire(questionnaireId, tagId) {
    try {
      const query = `
        DELETE FROM questionnaire_tag_mappings
        WHERE questionnaire_id = $1 AND tag_id = $2
      `;
      
      await this.query(query, [questionnaireId, tagId]);
      return true;
    } catch (error) {
      console.error('Error removing tag from questionnaire:', error);
      return false;
    }
  }

  /**
   * Find questionnaires by tag
   * @param {Number} tagId - Tag ID
   * @returns {Promise<Array>} - Array of questionnaires
   */
  async findQuestionnaires(tagId) {
    const query = `
      SELECT q.*
      FROM questionnaires q
      JOIN questionnaire_tag_mappings m ON q.id = m.questionnaire_id
      WHERE m.tag_id = $1
      ORDER BY q.title
    `;
    
    const result = await this.query(query, [tagId]);
    return result.rows;
  }

  /**
   * Get tag usage statistics
   * @returns {Promise<Array>} - Array of tag usage stats
   */
  async getUsageStatistics() {
    const query = `
      SELECT 
        t.id,
        t.name,
        t.color,
        COUNT(m.questionnaire_id) as usage_count
      FROM ${this.tableName} t
      LEFT JOIN questionnaire_tag_mappings m ON t.id = m.tag_id
      GROUP BY t.id, t.name, t.color
      ORDER BY usage_count DESC
    `;
    
    const result = await this.query(query);
    return result.rows;
  }
}

module.exports = new QuestionnaireTag();
