/**
 * Notification Controller
 */

const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

/**
 * Get notifications for current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.findByUser(userId);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting user notifications:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

/**
 * Get unread notifications for current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.findUnreadByUser(userId);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    res.status(500).json({ error: 'Failed to get unread notifications' });
  }
};

/**
 * Mark notification as read
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if notification exists and belongs to user
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    if (notification.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this notification' });
    }
    
    // Mark as read
    const updatedNotification = await Notification.markAsRead(id);
    
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications as read
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Notification.markAllAsRead(userId);
    
    res.status(200).json({ 
      message: `${count} notifications marked as read`,
      count
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

/**
 * Delete notification
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if notification exists and belongs to user
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    if (notification.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this notification' });
    }
    
    // Delete notification
    const deleted = await Notification.delete(id);
    
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete notification' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Create notification (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createNotification = async (req, res) => {
  try {
    // Only admins can create notifications for other users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create notifications' });
    }
    
    const { user_id, title, message, type, link } = req.body;
    
    // Validate required fields
    if (!user_id || !title || !message || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, title, message, and type are required' 
      });
    }
    
    // Create notification
    const notification = await notificationService.createNotification({
      user_id,
      title,
      message,
      type,
      link
    });
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

/**
 * Create notification for multiple users (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createNotificationForUsers = async (req, res) => {
  try {
    // Only admins can create notifications for other users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create notifications' });
    }
    
    const { user_ids, title, message, type, link } = req.body;
    
    // Validate required fields
    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({ error: 'user_ids must be a non-empty array' });
    }
    
    if (!title || !message || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, message, and type are required' 
      });
    }
    
    // Create notifications
    const notifications = await notificationService.createNotificationForUsers(
      user_ids,
      { title, message, type, link }
    );
    
    res.status(201).json({
      message: `${notifications.length} notifications created`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error creating notifications for users:', error);
    res.status(500).json({ error: 'Failed to create notifications' });
  }
};

/**
 * Create notification for users with specific role (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createNotificationForRole = async (req, res) => {
  try {
    // Only admins can create notifications for other users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create notifications' });
    }
    
    const { role, title, message, type, link } = req.body;
    
    // Validate required fields
    if (!role) {
      return res.status(400).json({ error: 'role is required' });
    }
    
    if (!title || !message || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, message, and type are required' 
      });
    }
    
    // Create notifications
    const notifications = await notificationService.createNotificationForRole(
      role,
      { title, message, type, link }
    );
    
    res.status(201).json({
      message: `${notifications.length} notifications created for users with role ${role}`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error creating notifications for role:', error);
    res.status(500).json({ error: 'Failed to create notifications' });
  }
};

/**
 * Get notification count
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getNotificationCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Notification.getCountByUser(userId);
    
    res.status(200).json(count);
  } catch (error) {
    console.error('Error getting notification count:', error);
    res.status(500).json({ error: 'Failed to get notification count' });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  createNotificationForUsers,
  createNotificationForRole,
  getNotificationCount
};
