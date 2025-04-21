const BaseModel = require('./BaseModel');

/**
 * Response model
 */
class Response extends BaseModel {
  constructor() {
    super('responses');
  }

  /**
   * Find responses by questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Array>} - Array of responses
   */
  async findByQuestionnaire(questionnaireId) {
    return this.findAll({
      where: { questionnaire_id: questionnaireId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find responses by user
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of responses
   */
  async findByUser(userId) {
    return this.findAll({
      where: { user_id: userId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find responses by organization
   * @param {Number} organizationId - Organization ID
   * @returns {Promise<Array>} - Array of responses
   */
  async findByOrganization(organizationId) {
    return this.findAll({
      where: { organization_id: organizationId },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find responses by patient identifier
   * @param {String} patientIdentifier - Patient identifier
   * @returns {Promise<Array>} - Array of responses
   */
  async findByPatientIdentifier(patientIdentifier) {
    return this.findAll({
      where: { patient_identifier: patientIdentifier },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find responses by risk level
   * @param {String} riskLevel - Risk level
   * @returns {Promise<Array>} - Array of responses
   */
  async findByRiskLevel(riskLevel) {
    return this.findAll({
      where: { risk_level: riskLevel },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find flagged responses
   * @returns {Promise<Array>} - Array of flagged responses
   */
  async findFlagged() {
    return this.findAll({
      where: { flagged_for_review: true },
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Find response by unique code
   * @param {String} uniqueCode - Unique code
   * @returns {Promise<Object|null>} - Response or null
   */
  async findByUniqueCode(uniqueCode) {
    return this.findOne({
      where: { unique_code: uniqueCode }
    });
  }

  /**
   * Find responses with answers and questions
   * @param {Number} responseId - Response ID
   * @returns {Promise<Object|null>} - Response with answers and questions
   */
  async findWithAnswers(responseId) {
    const query = `
      SELECT
        r.*,
        json_agg(
          json_build_object(
            'id', a.id,
            'question_id', a.question_id,
            'value', a.value,
            'question', json_build_object(
              'id', q.id,
              'text', q.text,
              'type', q.type,
              'options', q.options
            )
          )
        ) as answers
      FROM responses r
      LEFT JOIN answers a ON r.id = a.response_id
      LEFT JOIN questions q ON a.question_id = q.id
      WHERE r.id = $1
      GROUP BY r.id
    `;

    const result = await this.query(query, [responseId]);
    return result.rows[0] || null;
  }

  /**
   * Get response statistics for a questionnaire
   * @param {Number} questionnaireId - Questionnaire ID
   * @returns {Promise<Object>} - Statistics object
   */
  async getStatistics(questionnaireId) {
    const query = `
      SELECT
        COUNT(*) as total_responses,
        COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_responses,
        AVG(score) as average_score,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_count,
        COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk_count,
        COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk_count,
        AVG(completion_time) as average_completion_time
      FROM responses
      WHERE questionnaire_id = $1
    `;

    const result = await this.query(query, [questionnaireId]);
    return result.rows[0];
  }
  /**
   * Generate CSV from responses
   * @param {Array} responses - Array of responses with answers
   * @returns {Promise<String>} - CSV string
   */
  async generateCSV(responses) {
    if (!responses || responses.length === 0) {
      return 'No data';
    }

    // Get all unique question IDs
    const questionIds = new Set();

    for (const response of responses) {
      if (response.answers) {
        for (const answer of response.answers) {
          questionIds.add(answer.question_id);
        }
      }
    }

    // Get questions
    const questions = [];

    for (const id of questionIds) {
      const question = await this.db.query('SELECT id, text FROM questions WHERE id = $1', [id]);

      if (question.rows.length > 0) {
        questions.push(question.rows[0]);
      }
    }

    // Sort questions by ID
    questions.sort((a, b) => a.id - b.id);

    // Generate CSV header
    let csv = 'Response ID,Questionnaire ID,Patient Email,Patient Name,Score,Risk Level,Completed At';

    for (const question of questions) {
      csv += `,"${question.text.replace(/"/g, '""')}"`;
    }

    csv += '\n';

    // Generate CSV rows
    for (const response of responses) {
      csv += `${response.id},${response.questionnaire_id},"${response.patient_email || ''}","${response.patient_name || ''}",${response.score || ''},${response.risk_level || ''},${response.completed_at || ''}`;

      // Add answers
      for (const question of questions) {
        const answer = response.answers?.find(a => a.question_id === question.id);

        if (answer) {
          let value = answer.value;

          // Format value based on question type
          if (answer.question?.type === 'multiple_choice' && Array.isArray(value)) {
            value = value.join(', ');
          }

          csv += `,"${value?.toString().replace(/"/g, '""') || ''}"`;
        } else {
          csv += ',';
        }
      }

      csv += '\n';
    }

    return csv;
  }
}

module.exports = new Response();
