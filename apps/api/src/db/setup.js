/**
 * Database setup script
 * This script creates the necessary tables and initial data for the MindTrack application
 */

require('dotenv').config();
const { getPool } = require('./neon');
const { execSync } = require('child_process');
const path = require('path');

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Run migrations
    console.log('Running migrations...');
    execSync('npm run migrate:up', { stdio: 'inherit' });
    
    // Get database connection
    const pool = getPool();
    
    // Check if admin user exists
    const adminResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@mindtrack.com']
    );
    
    // Create admin user if it doesn't exist
    if (adminResult.rows.length === 0) {
      console.log('Creating admin user...');
      
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@mindtrack.com', hashedPassword, 'admin']
      );
      
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
    
    // Create sample organization if it doesn't exist
    const orgResult = await pool.query(
      'SELECT * FROM organizations WHERE name = $1',
      ['MindTrack Demo Clinic']
    );
    
    if (orgResult.rows.length === 0) {
      console.log('Creating sample organization...');
      
      const orgResult = await pool.query(
        'INSERT INTO organizations (name, description, type, contact_email) VALUES ($1, $2, $3, $4) RETURNING id',
        ['MindTrack Demo Clinic', 'Demo organization for MindTrack', 'healthcare', 'demo@mindtrack.com']
      );
      
      const orgId = orgResult.rows[0].id;
      
      // Add admin user to organization
      const adminUser = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@mindtrack.com']);
      const adminId = adminUser.rows[0].id;
      
      await pool.query(
        'INSERT INTO organization_members (organization_id, user_id, role) VALUES ($1, $2, $3)',
        [orgId, adminId, 'admin']
      );
      
      console.log('Sample organization created successfully.');
    } else {
      console.log('Sample organization already exists.');
    }
    
    console.log('Database setup completed successfully!');
    console.log('You can now log in with:');
    console.log('Email: admin@mindtrack.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
