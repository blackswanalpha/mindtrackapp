/**
 * Email controller
 */

const emailService = require('../services/emailService');
const Response = require('../models/Response');
const Questionnaire = require('../models/Questionnaire');
const EmailTemplate = require('../models/EmailTemplate');
const EmailLog = require('../models/EmailLog');

/**
 * Send email to response recipients
 * @route POST /api/email/send
 */
const sendEmail = async (req, res, next) => {
  try {
    const { response_ids, subject, template_id, custom_message } = req.body;
    
    if (!response_ids || !Array.isArray(response_ids) || response_ids.length === 0) {
      return res.status(400).json({ message: 'Response IDs are required' });
    }
    
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    
    // Get responses with email addresses
    const responses = [];
    
    for (const id of response_ids) {
      const response = await Response.findById(id);
      
      if (response && response.patient_email) {
        // Get questionnaire
        const questionnaire = await Questionnaire.findById(response.questionnaire_id);
        
        responses.push({
          response,
          questionnaire
        });
      }
    }
    
    if (responses.length === 0) {
      return res.status(400).json({ message: 'No valid responses with email addresses found' });
    }
    
    // Get template if provided
    let template = null;
    
    if (template_id) {
      template = await EmailTemplate.findById(template_id);
      
      if (!template) {
        return res.status(404).json({ message: 'Email template not found' });
      }
    }
    
    // Send emails
    const results = [];
    
    for (const { response, questionnaire } of responses) {
      try {
        // Send email
        const emailResult = await emailService.sendCustomEmail({
          email: response.patient_email,
          subject,
          template,
          customMessage: custom_message,
          data: {
            response,
            questionnaire,
            uniqueCode: response.unique_code
          }
        });
        
        // Log email
        await EmailLog.create({
          recipient: response.patient_email,
          subject,
          template_id: template?.id,
          response_id: response.id,
          sent_by_id: req.user.id,
          sent_at: new Date()
        });
        
        results.push({
          response_id: response.id,
          email: response.patient_email,
          success: true
        });
      } catch (error) {
        console.error(`Error sending email to ${response.patient_email}:`, error);
        
        results.push({
          response_id: response.id,
          email: response.patient_email,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      message: 'Emails sent',
      results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get email templates
 * @route GET /api/email/templates
 */
const getTemplates = async (req, res, next) => {
  try {
    const templates = await EmailTemplate.findAll();
    
    res.json({
      templates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get email template by ID
 * @route GET /api/email/templates/:id
 */
const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const template = await EmailTemplate.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    
    res.json({
      template
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create email template
 * @route POST /api/email/templates
 */
const createTemplate = async (req, res, next) => {
  try {
    const { name, subject, body, variables } = req.body;
    
    if (!name || !subject || !body) {
      return res.status(400).json({ message: 'Name, subject, and body are required' });
    }
    
    const template = await EmailTemplate.create({
      name,
      subject,
      body,
      variables: variables || [],
      created_by_id: req.user.id
    });
    
    res.status(201).json({
      message: 'Email template created',
      template
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update email template
 * @route PUT /api/email/templates/:id
 */
const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subject, body, variables } = req.body;
    
    const template = await EmailTemplate.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    
    const updatedTemplate = await EmailTemplate.update(id, {
      name,
      subject,
      body,
      variables
    });
    
    res.json({
      message: 'Email template updated',
      template: updatedTemplate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete email template
 * @route DELETE /api/email/templates/:id
 */
const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const template = await EmailTemplate.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    
    await EmailTemplate.delete(id);
    
    res.json({
      message: 'Email template deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get email logs
 * @route GET /api/email/logs
 */
const getLogs = async (req, res, next) => {
  try {
    const logs = await EmailLog.findAll({
      orderBy: [{ column: 'sent_at', direction: 'DESC' }]
    });
    
    res.json({
      logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendEmail,
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getLogs
};
