const User = require('../models/User');

/**
 * Get all users
 * @route GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    
    // Remove passwords from response
    const usersResponse = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      users: usersResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, profile_image } = req.body;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is authorized to update
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Update user
    const updatedUser = await User.updateUser(id, {
      name,
      email,
      role,
      profile_image
    });
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is authorized to delete
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }
    
    // Delete user
    await User.delete(id);
    
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 * @route PUT /api/users/:id/password
 */
const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Check if user exists
    const existingUser = await User.findById(id);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is authorized to update password
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user\'s password' });
    }
    
    // Verify current password (only if not admin)
    if (req.user.id === parseInt(id)) {
      const isPasswordValid = await User.verifyPassword(currentPassword, existingUser.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
    }
    
    // Update password
    await User.updateUser(id, {
      password: newPassword
    });
    
    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get users by role
 * @route GET /api/users/role/:role
 */
const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    
    const users = await User.findByRole(role);
    
    // Remove passwords from response
    const usersResponse = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      users: usersResponse
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  getUsersByRole
};
