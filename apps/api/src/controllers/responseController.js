const Response = require('../models/Response');
const Answer = require('../models/Answer');
const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');
const ScoringConfig = require('../models/ScoringConfig');

/**
 * Get all responses
 * @route GET /api/responses
 */
const getResponses = async (req, res, next) => {
  try {
    const {
      questionnaire_id,
      user_id,
      organization_id,
      patient_identifier,
      risk_level,
      flagged_for_review
    } = req.query;

    let responses;

    if (questionnaire_id) {
      // Get responses by questionnaire
      responses = await Response.findByQuestionnaire(questionnaire_id);
    } else if (user_id) {
      // Get responses by user
      responses = await Response.findByUser(user_id);
    } else if (organization_id) {
      // Get responses by organization
      responses = await Response.findByOrganization(organization_id);
    } else if (patient_identifier) {
      // Get responses by patient identifier
      responses = await Response.findByPatientIdentifier(patient_identifier);
    } else if (risk_level) {
      // Get responses by risk level
      responses = await Response.findByRiskLevel(risk_level);
    } else if (flagged_for_review === 'true') {
      // Get flagged responses
      responses = await Response.findFlagged();
    } else {
      // Get all responses
      responses = await Response.findAll({
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });
    }

    res.json({
      responses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get response by ID
 * @route GET /api/responses/:id
 */
const getResponseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await Response.findById(id);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.json({
      response
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create response
 * @route POST /api/responses
 */
const createResponse = async (req, res, next) => {
  try {
    const {
      questionnaire_id,
      patient_identifier,
      patient_name,
      patient_email,
      patient_age,
      patient_gender,
      organization_id,
      answers
    } = req.body;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(questionnaire_id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Check if questionnaire is active
    if (!questionnaire.is_active) {
      return res.status(400).json({ message: 'Questionnaire is not active' });
    }

    // Check if questionnaire requires authentication
    if (questionnaire.requires_auth && !req.user) {
      return res.status(401).json({ message: 'Authentication required to submit response' });
    }

    // Check if questionnaire allows anonymous responses
    if (!questionnaire.allow_anonymous && !req.user) {
      return res.status(401).json({ message: 'Anonymous responses not allowed for this questionnaire' });
    }

    // Check if max responses has been reached
    if (questionnaire.max_responses) {
      const responseCount = await Response.count({ questionnaire_id });

      if (responseCount >= questionnaire.max_responses) {
        return res.status(400).json({ message: 'Maximum number of responses reached for this questionnaire' });
      }
    }

    // Check if questionnaire has expired
    if (questionnaire.expires_at && new Date(questionnaire.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Questionnaire has expired' });
    }

    // Create response
    const response = await Response.create({
      questionnaire_id,
      user_id: req.user ? req.user.id : null,
      patient_identifier,
      patient_name,
      patient_email,
      patient_age,
      patient_gender,
      organization_id,
      completed_at: new Date()
    });

    // Create answers if provided
    if (answers && Array.isArray(answers) && answers.length > 0) {
      await Answer.createBulk(response.id, answers);
    }

    // Calculate score if scoring config exists
    try {
      const scoringConfig = await ScoringConfig.findByQuestionnaire(questionnaire_id);

      if (scoringConfig) {
        await ScoringConfig.calculateScore(response.id);
      }
    } catch (scoringError) {
      console.error('Error calculating score:', scoringError);
      // Continue without scoring
    }

    res.status(201).json({
      message: 'Response submitted successfully',
      response
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update response
 * @route PUT /api/responses/:id
 */
const updateResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      patient_identifier,
      patient_name,
      patient_email,
      patient_age,
      patient_gender,
      flagged_for_review
    } = req.body;

    // Check if response exists
    const existingResponse = await Response.findById(id);

    if (!existingResponse) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if user is authorized to update
    if (
      (!req.user || (existingResponse.user_id !== req.user.id)) &&
      req.user.role !== 'admin' &&
      req.user.role !== 'healthcare_provider'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this response' });
    }

    // Update response
    const updatedResponse = await Response.update(id, {
      patient_identifier,
      patient_name,
      patient_email,
      patient_age,
      patient_gender,
      flagged_for_review
    });

    res.json({
      message: 'Response updated successfully',
      response: updatedResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete response
 * @route DELETE /api/responses/:id
 */
const deleteResponse = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if response exists
    const existingResponse = await Response.findById(id);

    if (!existingResponse) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if user is authorized to delete
    if (
      (!req.user || (existingResponse.user_id !== req.user.id)) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this response' });
    }

    // Delete response
    await Response.delete(id);

    res.json({
      message: 'Response deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get response with answers
 * @route GET /api/responses/:id/answers
 */
const getResponseWithAnswers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await Response.findWithAnswers(id);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.json({
      response
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Flag response for review
 * @route PUT /api/responses/:id/flag
 */
const flagResponseForReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { flagged } = req.body;

    // Check if response exists
    const existingResponse = await Response.findById(id);

    if (!existingResponse) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if user is authorized to flag
    if (req.user.role !== 'admin' && req.user.role !== 'healthcare_provider') {
      return res.status(403).json({ message: 'Not authorized to flag responses' });
    }

    // Update response
    const updatedResponse = await Response.update(id, {
      flagged_for_review: flagged !== undefined ? flagged : true
    });

    res.json({
      message: `Response ${flagged === false ? 'unflagged' : 'flagged'} successfully`,
      response: updatedResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get response recipients
 * @route POST /api/responses/recipients
 */
const getResponseRecipients = async (req, res, next) => {
  try {
    const { response_ids } = req.body;

    if (!response_ids || !Array.isArray(response_ids) || response_ids.length === 0) {
      return res.status(400).json({ message: 'Response IDs are required' });
    }

    // Get responses with email addresses
    const recipients = [];

    for (const id of response_ids) {
      const response = await Response.findById(id);

      if (response && response.patient_email) {
        recipients.push(response);
      }
    }

    res.json({
      recipients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export responses
 * @route POST /api/responses/export
 */
const exportResponses = async (req, res, next) => {
  try {
    const { response_ids } = req.body;

    if (!response_ids || !Array.isArray(response_ids) || response_ids.length === 0) {
      return res.status(400).json({ message: 'Response IDs are required' });
    }

    // Get responses with answers
    const responses = [];

    for (const id of response_ids) {
      const response = await Response.findWithAnswers(id);

      if (response) {
        responses.push(response);
      }
    }

    // Generate CSV
    const csv = await Response.generateCSV(responses);

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="responses-${new Date().toISOString().split('T')[0]}.csv"`);

    // Send CSV
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResponses,
  getResponseById,
  createResponse,
  updateResponse,
  deleteResponse,
  getResponseWithAnswers,
  flagResponseForReview,
  getResponseRecipients,
  exportResponses
};
