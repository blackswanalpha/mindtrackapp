const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { body, param } = require('express-validator');

/**
 * @route GET /api/notifications
 * @desc Get notifications for current user
 * @access Private
 */
router.get(
  '/',
  auth,
  notificationController.getUserNotifications
);

/**
 * @route GET /api/notifications/unread
 * @desc Get unread notifications for current user
 * @access Private
 */
router.get(
  '/unread',
  auth,
  notificationController.getUnreadNotifications
);

/**
 * @route GET /api/notifications/count
 * @desc Get notification count for current user
 * @access Private
 */
router.get(
  '/count',
  auth,
  notificationController.getNotificationCount
);

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
router.put(
  '/:id/read',
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  auth,
  notificationController.markAsRead
);

/**
 * @route PUT /api/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
router.put(
  '/read-all',
  auth,
  notificationController.markAllAsRead
);

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete notification
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('ID must be an integer')
  ],
  validate,
  auth,
  notificationController.deleteNotification
);

/**
 * @route POST /api/notifications
 * @desc Create notification (admin only)
 * @access Private (Admin)
 */
router.post(
  '/',
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('link').optional()
  ],
  validate,
  auth,
  authorize(['admin']),
  notificationController.createNotification
);

/**
 * @route POST /api/notifications/bulk
 * @desc Create notification for multiple users (admin only)
 * @access Private (Admin)
 */
router.post(
  '/bulk',
  [
    body('user_ids').isArray().withMessage('User IDs must be an array'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('link').optional()
  ],
  validate,
  auth,
  authorize(['admin']),
  notificationController.createNotificationForUsers
);

/**
 * @route POST /api/notifications/role
 * @desc Create notification for users with specific role (admin only)
 * @access Private (Admin)
 */
router.post(
  '/role',
  [
    body('role').notEmpty().withMessage('Role is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('link').optional()
  ],
  validate,
  auth,
  authorize(['admin']),
  notificationController.createNotificationForRole
);

module.exports = router;
