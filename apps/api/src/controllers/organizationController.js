const Organization = require('../models/Organization');

/**
 * Get all organizations
 * @route GET /api/organizations
 */
const getOrganizations = async (req, res, next) => {
  try {
    const { with_member_count } = req.query;
    
    let organizations;
    
    if (with_member_count === 'true') {
      // Get organizations with member count
      organizations = await Organization.findWithMemberCount();
    } else {
      // Get all organizations
      organizations = await Organization.findAll({
        orderBy: [{ column: 'name', direction: 'ASC' }]
      });
    }
    
    res.json({
      organizations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization by ID
 * @route GET /api/organizations/:id
 */
const getOrganizationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const organization = await Organization.findById(id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    res.json({
      organization
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create organization
 * @route POST /api/organizations
 */
const createOrganization = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      contact_email,
      contact_phone,
      address,
      logo_url,
      settings
    } = req.body;
    
    // Create organization
    const organization = await Organization.create({
      name,
      description,
      type,
      contact_email,
      contact_phone,
      address,
      logo_url,
      settings: settings ? JSON.stringify(settings) : null
    });
    
    // Add creator as admin member
    await Organization.addMember(organization.id, req.user.id, 'admin');
    
    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update organization
 * @route PUT /api/organizations/:id
 */
const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      contact_email,
      contact_phone,
      address,
      logo_url,
      settings
    } = req.body;
    
    // Check if organization exists
    const existingOrganization = await Organization.findById(id);
    
    if (!existingOrganization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Check if user is authorized to update
    const memberRole = await Organization.getMemberRole(id, req.user.id);
    
    if (memberRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this organization' });
    }
    
    // Update organization
    const updatedOrganization = await Organization.update(id, {
      name,
      description,
      type,
      contact_email,
      contact_phone,
      address,
      logo_url,
      settings: settings ? JSON.stringify(settings) : existingOrganization.settings
    });
    
    res.json({
      message: 'Organization updated successfully',
      organization: updatedOrganization
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete organization
 * @route DELETE /api/organizations/:id
 */
const deleteOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if organization exists
    const existingOrganization = await Organization.findById(id);
    
    if (!existingOrganization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Check if user is authorized to delete
    const memberRole = await Organization.getMemberRole(id, req.user.id);
    
    if (memberRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this organization' });
    }
    
    // Delete organization
    await Organization.delete(id);
    
    res.json({
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization members
 * @route GET /api/organizations/:id/members
 */
const getOrganizationMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if organization exists
    const organization = await Organization.findWithMembers(id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    res.json({
      organization,
      members: organization.members
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to organization
 * @route POST /api/organizations/:id/members
 */
const addOrganizationMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, role = 'member' } = req.body;
    
    // Check if organization exists
    const existingOrganization = await Organization.findById(id);
    
    if (!existingOrganization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Check if user is authorized to add members
    const memberRole = await Organization.getMemberRole(id, req.user.id);
    
    if (memberRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add members to this organization' });
    }
    
    // Check if user is already a member
    const isMember = await Organization.isMember(id, user_id);
    
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of this organization' });
    }
    
    // Add member
    const member = await Organization.addMember(id, user_id, role);
    
    res.status(201).json({
      message: 'Member added successfully',
      member
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from organization
 * @route DELETE /api/organizations/:id/members/:userId
 */
const removeOrganizationMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    
    // Check if organization exists
    const existingOrganization = await Organization.findById(id);
    
    if (!existingOrganization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Check if user is authorized to remove members
    const memberRole = await Organization.getMemberRole(id, req.user.id);
    
    if (memberRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to remove members from this organization' });
    }
    
    // Check if user is a member
    const isMember = await Organization.isMember(id, userId);
    
    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this organization' });
    }
    
    // Remove member
    await Organization.removeMember(id, userId);
    
    res.json({
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update member role in organization
 * @route PUT /api/organizations/:id/members/:userId
 */
const updateOrganizationMemberRole = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;
    
    // Check if organization exists
    const existingOrganization = await Organization.findById(id);
    
    if (!existingOrganization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Check if user is authorized to update member roles
    const memberRole = await Organization.getMemberRole(id, req.user.id);
    
    if (memberRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update member roles in this organization' });
    }
    
    // Check if user is a member
    const isMember = await Organization.isMember(id, userId);
    
    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this organization' });
    }
    
    // Update member role
    const updatedMember = await Organization.updateMemberRole(id, userId, role);
    
    res.json({
      message: 'Member role updated successfully',
      member: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organizations for current user
 * @route GET /api/organizations/me
 */
const getUserOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.findByUser(req.user.id);
    
    res.json({
      organizations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  addOrganizationMember,
  removeOrganizationMember,
  updateOrganizationMemberRole,
  getUserOrganizations
};
