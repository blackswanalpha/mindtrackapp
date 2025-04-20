/**
 * Notification Service
 */

const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a notification
 * @param {Object} data - Notification data
 * @param {Number} data.user_id - User ID
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {String} data.type - Notification type
 * @param {String} data.link - Optional link
 * @returns {Promise<Object>} - Created notification
 */
const createNotification = async (data) => {
  try {
    return await Notification.create({
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      is_read: false,
      link: data.link || null,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create notifications for multiple users
 * @param {Array} userIds - Array of user IDs
 * @param {Object} data - Notification data
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {String} data.type - Notification type
 * @param {String} data.link - Optional link
 * @returns {Promise<Array>} - Created notifications
 */
const createNotificationForUsers = async (userIds, data) => {
  try {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await createNotification({
        user_id: userId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link
      });
      
      notifications.push(notification);
    }
    
    return notifications;
  } catch (error) {
    console.error('Error creating notifications for users:', error);
    throw error;
  }
};

/**
 * Create notifications for users with specific role
 * @param {String} role - User role
 * @param {Object} data - Notification data
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {String} data.type - Notification type
 * @param {String} data.link - Optional link
 * @returns {Promise<Array>} - Created notifications
 */
const createNotificationForRole = async (role, data) => {
  try {
    // Get users with the specified role
    const users = await User.findByRole(role);
    
    if (!users || users.length === 0) {
      return [];
    }
    
    const userIds = users.map(user => user.id);
    return await createNotificationForUsers(userIds, data);
  } catch (error) {
    console.error('Error creating notifications for role:', error);
    throw error;
  }
};

/**
 * Create high-risk response notification
 * @param {Object} response - Response object
 * @param {Object} questionnaire - Questionnaire object
 * @returns {Promise<Array>} - Created notifications
 */
const createHighRiskNotification = async (response, questionnaire) => {
  try {
    const title = 'High Risk Response Detected';
    const message = `A high risk response was submitted for "${questionnaire.title}" with a score of ${response.score}.`;
    const link = `/responses/${response.id}`;
    
    return await createNotificationForRole('healthcare_provider', {
      title,
      message,
      type: 'high_risk',
      link
    });
  } catch (error) {
    console.error('Error creating high risk notification:', error);
    throw error;
  }
};

/**
 * Create new response notification
 * @param {Object} response - Response object
 * @param {Object} questionnaire - Questionnaire object
 * @returns {Promise<Object>} - Created notification
 */
const createNewResponseNotification = async (response, questionnaire) => {
  try {
    // If questionnaire has a creator, notify them
    if (questionnaire.created_by_id) {
      const title = 'New Response Received';
      const message = `A new response was submitted for your questionnaire "${questionnaire.title}".`;
      const link = `/responses/${response.id}`;
      
      return await createNotification({
        user_id: questionnaire.created_by_id,
        title,
        message,
        type: 'new_response',
        link
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error creating new response notification:', error);
    throw error;
  }
};

/**
 * Clean up old notifications
 * @param {Number} days - Number of days to keep
 * @returns {Promise<Number>} - Number of deleted notifications
 */
const cleanupOldNotifications = async (days = 30) => {
  try {
    return await Notification.deleteOld(days);
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  createNotificationForUsers,
  createNotificationForRole,
  createHighRiskNotification,
  createNewResponseNotification,
  cleanupOldNotifications
};
