const BaseModel = require('./BaseModel');

/**
 * Organization model
 */
class Organization extends BaseModel {
  constructor() {
    super('organizations');
  }

  /**
   * Find organizations with member count
   * @returns {Promise<Array>} - Array of organizations with member count
   */
  async findWithMemberCount() {
    const query = `
      SELECT 
        o.*,
        COUNT(om.id) as member_count
      FROM organizations o
      LEFT JOIN organization_members om ON o.id = om.organization_id
      GROUP BY o.id
      ORDER BY o.name
    `;
    
    const result = await this.query(query);
    return result.rows;
  }

  /**
   * Find organizations by user membership
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Array of organizations
   */
  async findByUser(userId) {
    const query = `
      SELECT 
        o.*,
        om.role as member_role
      FROM organizations o
      JOIN organization_members om ON o.id = om.organization_id
      WHERE om.user_id = $1
      ORDER BY o.name
    `;
    
    const result = await this.query(query, [userId]);
    return result.rows;
  }

  /**
   * Find organization with members
   * @param {Number} organizationId - Organization ID
   * @returns {Promise<Object|null>} - Organization with members or null
   */
  async findWithMembers(organizationId) {
    const query = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'role', u.role,
            'member_role', om.role
          )
        ) as members
      FROM organizations o
      LEFT JOIN organization_members om ON o.id = om.organization_id
      LEFT JOIN users u ON om.user_id = u.id
      WHERE o.id = $1
      GROUP BY o.id
    `;
    
    const result = await this.query(query, [organizationId]);
    return result.rows[0] || null;
  }

  /**
   * Add a member to an organization
   * @param {Number} organizationId - Organization ID
   * @param {Number} userId - User ID
   * @param {String} role - Member role
   * @returns {Promise<Object>} - Created membership
   */
  async addMember(organizationId, userId, role = 'member') {
    const query = `
      INSERT INTO organization_members (organization_id, user_id, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await this.query(query, [organizationId, userId, role]);
    return result.rows[0];
  }

  /**
   * Remove a member from an organization
   * @param {Number} organizationId - Organization ID
   * @param {Number} userId - User ID
   * @returns {Promise<Boolean>} - Success status
   */
  async removeMember(organizationId, userId) {
    const query = `
      DELETE FROM organization_members
      WHERE organization_id = $1 AND user_id = $2
      RETURNING id
    `;
    
    const result = await this.query(query, [organizationId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Update a member's role in an organization
   * @param {Number} organizationId - Organization ID
   * @param {Number} userId - User ID
   * @param {String} role - New role
   * @returns {Promise<Object|null>} - Updated membership or null
   */
  async updateMemberRole(organizationId, userId, role) {
    const query = `
      UPDATE organization_members
      SET role = $3, updated_at = NOW()
      WHERE organization_id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await this.query(query, [organizationId, userId, role]);
    return result.rows[0] || null;
  }

  /**
   * Check if a user is a member of an organization
   * @param {Number} organizationId - Organization ID
   * @param {Number} userId - User ID
   * @returns {Promise<Boolean>} - Whether user is a member
   */
  async isMember(organizationId, userId) {
    const query = `
      SELECT id FROM organization_members
      WHERE organization_id = $1 AND user_id = $2
    `;
    
    const result = await this.query(query, [organizationId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Get a user's role in an organization
   * @param {Number} organizationId - Organization ID
   * @param {Number} userId - User ID
   * @returns {Promise<String|null>} - User's role or null
   */
  async getMemberRole(organizationId, userId) {
    const query = `
      SELECT role FROM organization_members
      WHERE organization_id = $1 AND user_id = $2
    `;
    
    const result = await this.query(query, [organizationId, userId]);
    return result.rows[0]?.role || null;
  }
}

module.exports = new Organization();
