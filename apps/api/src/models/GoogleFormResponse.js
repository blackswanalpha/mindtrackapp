const BaseModel = require('./BaseModel');

class GoogleFormResponse extends BaseModel {
  constructor() {
    super('google_form_responses');
  }
  
  /**
   * Save multiple form responses to the database
   * @param {string} formId - The Google Form ID
   * @param {Array} responses - Array of form responses
   * @returns {Promise<Array>} - Saved responses
   */
  async saveResponses(formId, responses) {
    const savedResponses = [];
    
    for (const response of responses) {
      // Check if response already exists
      const existingResponse = await this.query(
        'SELECT id FROM google_form_responses WHERE response_id = $1',
        [response.responseId]
      );
      
      if (existingResponse.rows.length === 0) {
        // Extract email from answers if available
        let respondentEmail = '';
        if (response.answers) {
          // Find email question (you'll need to identify which question collects email)
          // This will need to be updated based on the actual form structure
          Object.entries(response.answers).forEach(([questionId, answer]) => {
            if (answer.textAnswers && 
                answer.textAnswers.answers && 
                answer.textAnswers.answers[0] && 
                answer.textAnswers.answers[0].value.includes('@')) {
              respondentEmail = answer.textAnswers.answers[0].value;
            }
          });
        }
        
        // Insert new response
        const result = await this.query(
          `INSERT INTO google_form_responses 
           (response_id, form_id, respondent_email, response_data) 
           VALUES ($1, $2, $3, $4) 
           RETURNING *`,
          [response.responseId, formId, respondentEmail, JSON.stringify(response)]
        );
        
        savedResponses.push(result.rows[0]);
      }
    }
    
    return savedResponses;
  }
  
  /**
   * Get all form responses with pagination
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} - Responses with pagination info
   */
  async getAll({ page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' }) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT * FROM google_form_responses
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total FROM google_form_responses
    `;
    
    const [results, countResult] = await Promise.all([
      this.query(query, [limit, offset]),
      this.query(countQuery)
    ]);
    
    return {
      responses: results.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
        pages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      }
    };
  }
  
  /**
   * Get a single form response by ID
   * @param {number} id - Response ID
   * @returns {Promise<Object>} - Response data
   */
  async getById(id) {
    const result = await this.query(
      'SELECT * FROM google_form_responses WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }
  
  /**
   * Get response statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_responses,
        MIN(created_at) as first_response,
        MAX(created_at) as last_response,
        COUNT(DISTINCT respondent_email) as unique_respondents
      FROM google_form_responses
    `;
    
    const result = await this.query(query);
    return result.rows[0];
  }
}

module.exports = new GoogleFormResponse();
