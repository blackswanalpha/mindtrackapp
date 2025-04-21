const Response = require('../models/Response');
const Answer = require('../models/Answer');
const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');
const ScoringConfig = require('../models/ScoringConfig');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { generateUniqueCode } = require('../utils/codeGenerator');

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
 * Get response by unique code
 * @route GET /api/responses/code/:uniqueCode
 */
const getResponseByUniqueCode = async (req, res, next) => {
  try {
    const { uniqueCode } = req.params;

    const response = await Response.findByUniqueCode(uniqueCode);

    if (!response) {
      return res.status(404).json({ message: `Response with code ${uniqueCode} not found. Please check the URL and try again.` });
    }

    // Get the questionnaire for this response
    const questionnaire = await Questionnaire.findById(response.questionnaire_id);

    // Get the answers for this response
    const answers = await Answer.findByResponse(response.id);

    res.json({
      response: {
        ...response,
        questionnaire_title: questionnaire ? questionnaire.title : 'Unknown Questionnaire',
        answers
      }
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

    // Validate answers
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.error('Invalid answers format:', answers);
      return res.status(400).json({ message: 'Answers are required and must be an array' });
    }

    // Log answers for debugging
    console.log('Received answers:', JSON.stringify(answers));
    console.log('Questionnaire ID:', questionnaire_id);

    // Get questions to validate answers
    const questions = await Question.findByQuestionnaire(questionnaire_id);
    const questionMap = {};
    questions.forEach(q => { questionMap[q.id] = q; });

    // Validate required questions
    const requiredQuestions = questions.filter(q => q.required).map(q => q.id);
    const answeredQuestions = answers.map(a => parseInt(a.question_id));
    const missingRequiredQuestions = requiredQuestions.filter(id => !answeredQuestions.includes(id));

    if (missingRequiredQuestions.length > 0) {
      console.error('Missing required questions:', missingRequiredQuestions);
      console.log('Required questions:', requiredQuestions);
      console.log('Answered questions:', answeredQuestions);

      // Get the question texts for better error messages
      const missingQuestionTexts = missingRequiredQuestions.map(id => {
        const question = questions.find(q => q.id === id);
        return question ? question.text : `Question ID ${id}`;
      });

      return res.status(400).json({
        message: 'Missing answers for required questions',
        missing_questions: missingRequiredQuestions,
        missing_question_texts: missingQuestionTexts
      });
    }

    // Generate unique code
    const uniqueCode = generateUniqueCode();

    // Calculate completion time if available
    const startTime = req.body.start_time ? new Date(req.body.start_time) : null;
    const endTime = new Date();
    const completionTime = startTime ? Math.round((endTime - startTime) / 1000) : null;

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
      unique_code: uniqueCode,
      completion_time: completionTime,
      completed_at: endTime
    });

    // Process answers and calculate scores
    const processedAnswers = [];
    let totalScore = 0;

    for (const answer of answers) {
      const question = questionMap[answer.question_id];
      let score = 0;

      // Calculate score if question has scoring options
      if (question && question.options) {
        try {
          // Handle both string and object options
          const options = typeof question.options === 'string' ?
            JSON.parse(question.options) : question.options;

          const selectedOption = options.find(opt => opt.value === answer.value);
          if (selectedOption && selectedOption.score !== undefined) {
            score = selectedOption.score * (question.scoring_weight || 1);
            totalScore += score;
          }
        } catch (parseError) {
          console.error('Error parsing question options:', parseError);
        }
      }

      processedAnswers.push({
        ...answer,
        score
      });
    }

    // Create answers
    await Answer.createBulk(response.id, processedAnswers);

    // Update response with score
    await Response.update(response.id, { score: totalScore });
    response.score = totalScore;

    // Determine risk level based on score
    // This is a simple example - in a real app, you'd use more sophisticated logic
    let riskLevel = 'low';
    if (totalScore > 15) riskLevel = 'high';
    else if (totalScore > 7) riskLevel = 'medium';

    await Response.update(response.id, { risk_level: riskLevel });
    response.risk_level = riskLevel;

    // Send email notification if email is provided
    if (patient_email) {
      try {
        await emailService.sendResponseCompletionEmail({
          email: patient_email,
          uniqueCode,
          response,
          questionnaire
        });
        console.log(`Response completion email sent to ${patient_email}`);
      } catch (emailError) {
        console.error('Error sending response completion email:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    // Send notification to healthcare providers if high risk
    if (riskLevel === 'high' && organization_id) {
      try {
        // Get organization admins
        const admins = await User.findByOrganizationAndRole(organization_id, 'healthcare_provider');

        for (const admin of admins) {
          if (admin.email) {
            await emailService.sendFlaggedResponseEmail({
              email: admin.email,
              response,
              questionnaire,
              patient: {
                name: patient_name,
                email: patient_email,
                identifier: patient_identifier
              }
            });
          }
        }

        console.log(`High risk notification sent to healthcare providers for response ${response.id}`);
      } catch (notificationError) {
        console.error('Error sending high risk notification:', notificationError);
        // Don't fail the request if notification sending fails
      }
    }

    res.status(201).json({
      message: 'Response submitted successfully',
      response,
      unique_code: uniqueCode,
      score: totalScore,
      risk_level: riskLevel
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
  getResponseByUniqueCode,
  createResponse,
  updateResponse,
  deleteResponse,
  getResponseWithAnswers,
  flagResponseForReview,
  getResponseRecipients,
  exportResponses
};
