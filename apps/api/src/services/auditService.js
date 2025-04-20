/**
 * Audit Service
 */

const AuditLog = require('../models/AuditLog');

/**
 * Log an action
 * @param {Object} data - Audit log data
 * @param {Number} data.user_id - User ID
 * @param {String} data.action - Action type
 * @param {String} data.entity_type - Entity type
 * @param {Number} data.entity_id - Entity ID
 * @param {Object} data.details - Additional details
 * @param {String} data.ip_address - IP address
 * @returns {Promise<Object>} - Created audit log
 */
const logAction = async (data) => {
  try {
    return await AuditLog.logAction(data);
  } catch (error) {
    console.error('Error logging action:', error);
    // Don't throw error to prevent disrupting main flow
    return null;
  }
};

/**
 * Log authentication action
 * @param {Number} userId - User ID
 * @param {String} action - Action type (login, logout, failed_login)
 * @param {String} ipAddress - IP address
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} - Created audit log
 */
const logAuthAction = async (userId, action, ipAddress, details = {}) => {
  return await logAction({
    user_id: userId,
    action,
    entity_type: 'user',
    entity_id: userId,
    details,
    ip_address: ipAddress
  });
};

/**
 * Log questionnaire action
 * @param {Number} userId - User ID
 * @param {String} action - Action type (create, update, delete, view)
 * @param {Number} questionnaireId - Questionnaire ID
 * @param {String} ipAddress - IP address
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} - Created audit log
 */
const logQuestionnaireAction = async (userId, action, questionnaireId, ipAddress, details = {}) => {
  return await logAction({
    user_id: userId,
    action,
    entity_type: 'questionnaire',
    entity_id: questionnaireId,
    details,
    ip_address: ipAddress
  });
};

/**
 * Log response action
 * @param {Number} userId - User ID
 * @param {String} action - Action type (create, update, delete, view)
 * @param {Number} responseId - Response ID
 * @param {String} ipAddress - IP address
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} - Created audit log
 */
const logResponseAction = async (userId, action, responseId, ipAddress, details = {}) => {
  return await logAction({
    user_id: userId,
    action,
    entity_type: 'response',
    entity_id: responseId,
    details,
    ip_address: ipAddress
  });
};

/**
 * Log organization action
 * @param {Number} userId - User ID
 * @param {String} action - Action type (create, update, delete, view)
 * @param {Number} organizationId - Organization ID
 * @param {String} ipAddress - IP address
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} - Created audit log
 */
const logOrganizationAction = async (userId, action, organizationId, ipAddress, details = {}) => {
  return await logAction({
    user_id: userId,
    action,
    entity_type: 'organization',
    entity_id: organizationId,
    details,
    ip_address: ipAddress
  });
};

/**
 * Log user action
 * @param {Number} actorId - Actor user ID
 * @param {String} action - Action type (create, update, delete, view)
 * @param {Number} targetUserId - Target user ID
 * @param {String} ipAddress - IP address
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} - Created audit log
 */
const logUserAction = async (actorId, action, targetUserId, ipAddress, details = {}) => {
  return await logAction({
    user_id: actorId,
    action,
    entity_type: 'user',
    entity_id: targetUserId,
    details,
    ip_address: ipAddress
  });
};

/**
 * Log email action
 * @param {Number} userId - User ID
 * @param {String} action - Action type (send)
 * @param {Number} emailId - Email ID
 * @param {String} ipAddress - IP address
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} - Created audit log
 */
const logEmailAction = async (userId, action, emailId, ipAddress, details = {}) => {
  return await logAction({
    user_id: userId,
    action,
    entity_type: 'email',
    entity_id: emailId,
    details,
    ip_address: ipAddress
  });
};

module.exports = {
  logAction,
  logAuthAction,
  logQuestionnaireAction,
  logResponseAction,
  logOrganizationAction,
  logUserAction,
  logEmailAction
};
