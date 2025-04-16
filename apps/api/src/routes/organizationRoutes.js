const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

/**
 * @route GET /api/organizations
 * @desc Get all organizations
 * @access Private
 */
router.get(
  '/',
  auth,
  organizationController.getOrganizations
);

/**
 * @route GET /api/organizations/me
 * @desc Get organizations for current user
 * @access Private
 */
router.get(
  '/me',
  auth,
  organizationController.getUserOrganizations
);

/**
 * @route GET /api/organizations/:id
 * @desc Get organization by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid organization ID')
  ],
  validate,
  auth,
  organizationController.getOrganizationById
);

/**
 * @route POST /api/organizations
 * @desc Create organization
 * @access Private
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('type').optional().isString().withMessage('Type must be a string'),
    body('contact_email').optional().isEmail().withMessage('contact_email must be a valid email'),
    body('contact_phone').optional().isString().withMessage('contact_phone must be a string'),
    body('address').optional().isString().withMessage('address must be a string'),
    body('logo_url').optional().isURL().withMessage('logo_url must be a valid URL'),
    body('settings').optional().isObject().withMessage('settings must be an object')
  ],
  validate,
  auth,
  organizationController.createOrganization
);

/**
 * @route PUT /api/organizations/:id
 * @desc Update organization
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid organization ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('type').optional().isString().withMessage('Type must be a string'),
    body('contact_email').optional().isEmail().withMessage('contact_email must be a valid email'),
    body('contact_phone').optional().isString().withMessage('contact_phone must be a string'),
    body('address').optional().isString().withMessage('address must be a string'),
    body('logo_url').optional().isURL().withMessage('logo_url must be a valid URL'),
    body('settings').optional().isObject().withMessage('settings must be an object')
  ],
  validate,
  auth,
  organizationController.updateOrganization
);

/**
 * @route DELETE /api/organizations/:id
 * @desc Delete organization
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid organization ID')
  ],
  validate,
  auth,
  organizationController.deleteOrganization
);

/**
 * @route GET /api/organizations/:id/members
 * @desc Get organization members
 * @access Private
 */
router.get(
  '/:id/members',
  [
    param('id').isInt().withMessage('Invalid organization ID')
  ],
  validate,
  auth,
  organizationController.getOrganizationMembers
);

/**
 * @route POST /api/organizations/:id/members
 * @desc Add member to organization
 * @access Private
 */
router.post(
  '/:id/members',
  [
    param('id').isInt().withMessage('Invalid organization ID'),
    body('user_id').isInt().withMessage('user_id is required and must be an integer'),
    body('role')
      .optional()
      .isIn(['admin', 'member', 'viewer'])
      .withMessage('Invalid role')
  ],
  validate,
  auth,
  organizationController.addOrganizationMember
);

/**
 * @route DELETE /api/organizations/:id/members/:userId
 * @desc Remove member from organization
 * @access Private
 */
router.delete(
  '/:id/members/:userId',
  [
    param('id').isInt().withMessage('Invalid organization ID'),
    param('userId').isInt().withMessage('Invalid user ID')
  ],
  validate,
  auth,
  organizationController.removeOrganizationMember
);

/**
 * @route PUT /api/organizations/:id/members/:userId
 * @desc Update member role in organization
 * @access Private
 */
router.put(
  '/:id/members/:userId',
  [
    param('id').isInt().withMessage('Invalid organization ID'),
    param('userId').isInt().withMessage('Invalid user ID'),
    body('role')
      .isIn(['admin', 'member', 'viewer'])
      .withMessage('Invalid role')
  ],
  validate,
  auth,
  organizationController.updateOrganizationMemberRole
);

module.exports = router;
