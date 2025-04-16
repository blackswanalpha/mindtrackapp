const BaseModel = require('./BaseModel');
const bcrypt = require('bcrypt');

/**
 * User model
 */
class User extends BaseModel {
  constructor() {
    super('users');
  }

  /**
   * Find a user by email
   * @param {String} email - User email
   * @returns {Promise<Object|null>} - User object or null
   */
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Create a new user with hashed password
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Create user with hashed password
    const user = await this.create({
      ...userData,
      password: hashedPassword
    });
    
    // Remove password from returned user object
    delete user.password;
    
    return user;
  }

  /**
   * Update a user
   * @param {Number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object|null>} - Updated user or null
   */
  async updateUser(id, userData) {
    // If password is being updated, hash it
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    
    const user = await this.update(id, userData);
    
    // Remove password from returned user object
    if (user) {
      delete user.password;
    }
    
    return user;
  }

  /**
   * Verify user password
   * @param {String} plainPassword - Plain text password
   * @param {String} hashedPassword - Hashed password from database
   * @returns {Promise<Boolean>} - Whether password is correct
   */
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update last login timestamp
   * @param {Number} id - User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(id) {
    await this.update(id, { last_login: new Date() });
  }

  /**
   * Find users by role
   * @param {String} role - User role
   * @returns {Promise<Array>} - Array of users
   */
  async findByRole(role) {
    return this.findAll({ where: { role } });
  }
}

module.exports = new User();
