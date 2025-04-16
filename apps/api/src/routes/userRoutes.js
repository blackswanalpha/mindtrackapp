const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private/Admin
 */
router.get('/', auth, authorize('admin'), userController.getUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid user ID')
  ],
  validate,
  auth,
  userController.getUserById
);

/**
 * @route PUT /api/users/:id
 * @desc Update user
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid user ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn(['admin', 'healthcare_provider', 'user'])
      .withMessage('Invalid role')
  ],
  validate,
  auth,
  userController.updateUser
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private/Admin
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid user ID')
  ],
  validate,
  auth,
  userController.deleteUser
);

/**
 * @route PUT /api/users/:id/password
 * @desc Update user password
 * @access Private
 */
router.put(
  '/:id/password',
  [
    param('id').isInt().withMessage('Invalid user ID'),
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  validate,
  auth,
  userController.updatePassword
);

/**
 * @route GET /api/users/role/:role
 * @desc Get users by role
 * @access Private/Admin
 */
router.get(
  '/role/:role',
  [
    param('role')
      .isIn(['admin', 'healthcare_provider', 'user'])
      .withMessage('Invalid role')
  ],
  validate,
  auth,
  authorize('admin'),
  userController.getUsersByRole
);

module.exports = router;
