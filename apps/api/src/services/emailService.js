/**
 * Email service for sending notifications
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Load email template
 * @param {string} templateName - Template name
 * @returns {function} Compiled template function
 */
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  return handlebars.compile(templateSource);
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name
 * @param {Object} options.data - Template data
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    // Create transporter
    const transporter = createTransporter();

    // Load template
    const compiledTemplate = loadTemplate(template);

    // Render template with data
    const html = compiledTemplate(data);

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send response completion notification
 * @param {Object} options - Notification options
 * @param {string} options.email - Recipient email
 * @param {string} options.uniqueCode - Unique response code
 * @param {Object} options.response - Response data
 * @param {Object} options.questionnaire - Questionnaire data
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendResponseCompletionEmail = async ({ email, uniqueCode, response, questionnaire }) => {
  return sendEmail({
    to: email,
    subject: `Your ${questionnaire.title} Results`,
    template: 'response-completion',
    data: {
      uniqueCode,
      questionnaire,
      response,
      score: response.score,
      riskLevel: response.risk_level,
      date: new Date().toLocaleDateString(),
      viewResultsUrl: `${process.env.FRONTEND_URL}/responses/view/${uniqueCode}`
    }
  });
};

/**
 * Send flagged response notification to healthcare providers
 * @param {Object} options - Notification options
 * @param {string} options.email - Recipient email
 * @param {Object} options.response - Response data
 * @param {Object} options.questionnaire - Questionnaire data
 * @param {Object} options.patient - Patient data
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendFlaggedResponseEmail = async ({ email, response, questionnaire, patient }) => {
  return sendEmail({
    to: email,
    subject: `[ALERT] High Risk Response - ${questionnaire.title}`,
    template: 'flagged-response',
    data: {
      questionnaire,
      response,
      patient,
      score: response.score,
      riskLevel: response.risk_level,
      date: new Date().toLocaleDateString(),
      viewResponseUrl: `${process.env.FRONTEND_URL}/responses/${response.id}`
    }
  });
};

/**
 * Send AI analysis completion notification
 * @param {Object} options - Notification options
 * @param {string} options.email - Recipient email
 * @param {Object} options.analysis - Analysis data
 * @param {Object} options.response - Response data
 * @param {Object} options.questionnaire - Questionnaire data
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendAnalysisCompletionEmail = async ({ email, analysis, response, questionnaire }) => {
  return sendEmail({
    to: email,
    subject: `AI Analysis Complete - ${questionnaire.title}`,
    template: 'analysis-completion',
    data: {
      analysis,
      response,
      questionnaire,
      date: new Date().toLocaleDateString(),
      viewAnalysisUrl: `${process.env.FRONTEND_URL}/responses/${response.id}/analysis`
    }
  });
};

/**
 * Send custom email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {Object} options.template - Email template (optional)
 * @param {string} options.customMessage - Custom message (optional)
 * @param {Object} options.data - Template data
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendCustomEmail = async ({ email, subject, template, customMessage, data }) => {
  // If template is provided, use it
  if (template) {
    return sendEmail({
      to: email,
      subject,
      template: 'custom',
      data: {
        ...data,
        customMessage,
        templateBody: template.body
      }
    });
  }

  // Otherwise, use a basic template with just the custom message
  return sendEmail({
    to: email,
    subject,
    template: 'basic',
    data: {
      ...data,
      customMessage
    }
  });
};

module.exports = {
  sendEmail,
  sendResponseCompletionEmail,
  sendFlaggedResponseEmail,
  sendAnalysisCompletionEmail,
  sendCustomEmail
};
