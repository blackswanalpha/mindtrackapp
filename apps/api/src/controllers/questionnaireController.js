const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');
const Response = require('../models/Response');
const qrCodeService = require('../services/qrCodeService');

/**
 * Get all questionnaires
 * @route GET /api/questionnaires
 */
const getQuestionnaires = async (req, res, next) => {
  try {
    const {
      is_active,
      is_public,
      is_template,
      created_by_id,
      organization_id,
      search
    } = req.query;

    let questionnaires;

    if (search) {
      // Search by title or description
      questionnaires = await Questionnaire.search(search);
    } else if (is_active === 'true') {
      // Get active questionnaires
      questionnaires = await Questionnaire.findActive();
    } else if (is_public === 'true') {
      // Get public questionnaires
      questionnaires = await Questionnaire.findPublic();
    } else if (is_template === 'true') {
      // Get template questionnaires
      questionnaires = await Questionnaire.findTemplates();
    } else if (created_by_id) {
      // Get questionnaires by creator
      questionnaires = await Questionnaire.findByCreator(created_by_id);
    } else if (organization_id) {
      // Get questionnaires by organization
      questionnaires = await Questionnaire.findByOrganization(organization_id);
    } else {
      // Get all questionnaires
      questionnaires = await Questionnaire.findAll({
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });
    }

    res.json({
      questionnaires
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get questionnaire by ID
 * @route GET /api/questionnaires/:id
 */
const getQuestionnaireById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    res.json({
      questionnaire
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create questionnaire
 * @route POST /api/questionnaires
 */
const createQuestionnaire = async (req, res, next) => {
  try {
    const {
      title,
      description,
      instructions,
      type,
      category,
      estimated_time_minutes,
      is_active,
      is_adaptive,
      is_qr_enabled,
      is_template,
      is_public,
      allow_anonymous,
      requires_auth,
      max_responses,
      expires_at,
      tags,
      organization_id,
      questions
    } = req.body;

    // Create questionnaire
    const questionnaire = await Questionnaire.create({
      title,
      description,
      instructions,
      type: type || 'standard',
      category,
      estimated_time_minutes,
      is_active: is_active !== undefined ? is_active : true,
      is_adaptive: is_adaptive !== undefined ? is_adaptive : false,
      is_qr_enabled: is_qr_enabled !== undefined ? is_qr_enabled : true,
      is_template: is_template !== undefined ? is_template : false,
      is_public: is_public !== undefined ? is_public : false,
      allow_anonymous: allow_anonymous !== undefined ? allow_anonymous : true,
      requires_auth: requires_auth !== undefined ? requires_auth : false,
      max_responses,
      expires_at,
      tags: tags ? JSON.stringify(tags) : null,
      organization_id,
      created_by_id: req.user ? req.user.id : null
    });

    // Create questions if provided
    if (questions && Array.isArray(questions) && questions.length > 0) {
      await Question.createBulk(questionnaire.id, questions);
    }

    // Generate QR code for the questionnaire
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const qrCodeDataUrl = await qrCodeService.generateQuestionnaireQRCode(questionnaire.id, baseUrl);

    // Log the creation
    console.log(`Questionnaire created: ${questionnaire.id} - ${title}`);

    res.status(201).json({
      message: 'Questionnaire created successfully',
      questionnaire,
      qrCode: qrCodeDataUrl,
      url: `${baseUrl}/questionnaires/respond/${questionnaire.id}`
    });
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    next(error);
  }
};

/**
 * Update questionnaire
 * @route PUT /api/questionnaires/:id
 */
const updateQuestionnaire = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      category,
      estimated_time,
      is_active,
      is_adaptive,
      is_qr_enabled,
      is_template,
      is_public,
      allow_anonymous,
      requires_auth,
      max_responses,
      expires_at,
      tags,
      organization_id
    } = req.body;

    // Check if questionnaire exists
    const existingQuestionnaire = await Questionnaire.findById(id);

    if (!existingQuestionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Check if user is authorized to update
    if (existingQuestionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this questionnaire' });
    }

    // Update questionnaire
    const updatedQuestionnaire = await Questionnaire.update(id, {
      title,
      description,
      type,
      category,
      estimated_time,
      is_active,
      is_adaptive,
      is_qr_enabled,
      is_template,
      is_public,
      allow_anonymous,
      requires_auth,
      max_responses,
      expires_at,
      tags: tags ? JSON.stringify(tags) : existingQuestionnaire.tags,
      organization_id
    });

    res.json({
      message: 'Questionnaire updated successfully',
      questionnaire: updatedQuestionnaire
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete questionnaire
 * @route DELETE /api/questionnaires/:id
 */
const deleteQuestionnaire = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if questionnaire exists
    const existingQuestionnaire = await Questionnaire.findById(id);

    if (!existingQuestionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Check if user is authorized to delete
    if (existingQuestionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this questionnaire' });
    }

    // Delete questionnaire
    await Questionnaire.delete(id);

    res.json({
      message: 'Questionnaire deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get questionnaire with questions
 * @route GET /api/questionnaires/:id/questions
 */
const getQuestionnaireWithQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get questionnaire
    const questionnaire = await Questionnaire.findById(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Get questions
    const questions = await Question.findByQuestionnaire(id);

    res.json({
      questionnaire,
      questions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new version of questionnaire
 * @route POST /api/questionnaires/:id/version
 */
const createQuestionnaireVersion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check if questionnaire exists
    const existingQuestionnaire = await Questionnaire.findById(id);

    if (!existingQuestionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Check if user is authorized to create version
    if (existingQuestionnaire.created_by_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create version of this questionnaire' });
    }

    // Create new version
    const newQuestionnaire = await Questionnaire.createVersion(id, {
      title: title || `${existingQuestionnaire.title} (Copy)`,
      description: description || existingQuestionnaire.description,
      type: existingQuestionnaire.type,
      category: existingQuestionnaire.category,
      estimated_time: existingQuestionnaire.estimated_time,
      is_active: false, // New version is inactive by default
      is_adaptive: existingQuestionnaire.is_adaptive,
      is_qr_enabled: existingQuestionnaire.is_qr_enabled,
      is_template: existingQuestionnaire.is_template,
      is_public: existingQuestionnaire.is_public,
      allow_anonymous: existingQuestionnaire.allow_anonymous,
      requires_auth: existingQuestionnaire.requires_auth,
      max_responses: existingQuestionnaire.max_responses,
      expires_at: existingQuestionnaire.expires_at,
      tags: existingQuestionnaire.tags,
      organization_id: existingQuestionnaire.organization_id,
      created_by_id: req.user.id
    });

    // Get questions from original questionnaire
    const questions = await Question.findByQuestionnaire(id);

    // Create questions for new version
    if (questions.length > 0) {
      const newQuestions = questions.map(q => {
        const { id, questionnaire_id, created_at, updated_at, ...questionData } = q;
        return questionData;
      });

      await Question.createBulk(newQuestionnaire.id, newQuestions);
    }

    res.status(201).json({
      message: 'Questionnaire version created successfully',
      questionnaire: newQuestionnaire
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get questionnaire statistics
 * @route GET /api/questionnaires/:id/statistics
 */
const getQuestionnaireStatistics = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findById(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Get response statistics
    const statistics = await Response.getStatistics(id);

    res.json({
      statistics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestionnaires,
  getQuestionnaireById,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireWithQuestions,
  createQuestionnaireVersion,
  getQuestionnaireStatistics
};
