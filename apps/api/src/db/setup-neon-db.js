require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool using the DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon connections
  }
});

/**
 * Create all database tables
 */
async function createTables() {
  const client = await pool.connect();

  try {
    console.log('Creating tables...');

    // Start a transaction
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'healthcare_provider', 'user')),
        profile_image VARCHAR(255),
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(255),
        website VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        address TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Organizations table created');

    // Create organization_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_members (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id, user_id)
      )
    `);
    console.log('✅ Organization members table created');

    // Create questionnaires table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questionnaires (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        estimated_time_minutes INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        is_public BOOLEAN NOT NULL DEFAULT FALSE,
        is_template BOOLEAN NOT NULL DEFAULT FALSE,
        type VARCHAR(50) NOT NULL DEFAULT 'standard' CHECK (type IN ('standard', 'assessment', 'survey', 'feedback')),
        category VARCHAR(100),
        tags JSONB,
        created_by_id INTEGER REFERENCES users(id),
        organization_id INTEGER REFERENCES organizations(id),
        parent_id INTEGER REFERENCES questionnaires(id),
        version VARCHAR(50) DEFAULT '1.0',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Questionnaires table created');

    // Create questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'single_choice', 'multiple_choice', 'rating', 'yes_no', 'scale', 'date')),
        required BOOLEAN NOT NULL DEFAULT TRUE,
        order_num INTEGER NOT NULL,
        options JSONB,
        conditional_logic JSONB,
        validation_rules JSONB,
        scoring_weight INTEGER DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Questions table created');

    // Create responses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        patient_identifier VARCHAR(255),
        patient_name VARCHAR(255),
        patient_email VARCHAR(255),
        patient_age INTEGER,
        patient_gender VARCHAR(50),
        score INTEGER,
        risk_level VARCHAR(50),
        flagged_for_review BOOLEAN NOT NULL DEFAULT FALSE,
        completion_time INTEGER,
        completed_at TIMESTAMP,
        organization_id INTEGER REFERENCES organizations(id),
        unique_code VARCHAR(100) UNIQUE,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Responses table created');

    // Create answers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        response_id INTEGER NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        value TEXT,
        score INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(response_id, question_id)
      )
    `);
    console.log('✅ Answers table created');

    // Create email_templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        variables JSONB DEFAULT '[]',
        created_by_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Email templates table created');

    // Create email_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        template_id INTEGER REFERENCES email_templates(id),
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        recipient VARCHAR(255) NOT NULL,
        sent_by_id INTEGER REFERENCES users(id),
        sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'sent',
        error_message TEXT,
        metadata JSONB
      )
    `);
    console.log('✅ Email logs table created');

    // Create scoring_configs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scoring_configs (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        scoring_rules JSONB NOT NULL,
        risk_levels JSONB NOT NULL,
        created_by_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(questionnaire_id, name)
      )
    `);
    console.log('✅ Scoring configs table created');

    // Create ai_analyses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_analyses (
        id SERIAL PRIMARY KEY,
        response_id INTEGER NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
        analysis_text TEXT NOT NULL,
        recommendations TEXT,
        confidence_score FLOAT,
        model_used VARCHAR(100),
        created_by_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ AI analyses table created');

    // Create sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Sessions table created');

    // Create audit_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id INTEGER,
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Audit logs table created');

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        link VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Notifications table created');

    // Create user_metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        login_count INTEGER NOT NULL DEFAULT 0,
        questionnaires_created INTEGER NOT NULL DEFAULT 0,
        responses_submitted INTEGER NOT NULL DEFAULT 0,
        last_active_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ User metrics table created');

    // Create questionnaire_tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questionnaire_tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Questionnaire tags table created');

    // Create questionnaire_tag_mappings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questionnaire_tag_mappings (
        questionnaire_id INTEGER NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES questionnaire_tags(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (questionnaire_id, tag_id)
      )
    `);
    console.log('✅ Questionnaire tag mappings table created');

    // Create google_form_responses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS google_form_responses (
        id SERIAL PRIMARY KEY,
        form_id VARCHAR(255) NOT NULL,
        response_id VARCHAR(255) NOT NULL UNIQUE,
        response_data JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Google form responses table created');

    // Create update_timestamp function and triggers
    await client.query(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create triggers for all tables with updated_at column
    const tablesWithUpdatedAt = [
      'users',
      'organizations',
      'organization_members',
      'questionnaires',
      'questions',
      'responses',
      'answers',
      'email_templates',
      'scoring_configs',
      'ai_analyses',
      'user_metrics',
      'questionnaire_tags',
      'google_form_responses'
    ];

    for (const table of tablesWithUpdatedAt) {
      await client.query(`
        DROP TRIGGER IF EXISTS update_timestamp_trigger ON ${table};
        CREATE TRIGGER update_timestamp_trigger
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
      `);
    }
    console.log('✅ Update timestamp triggers created');

    // Skip index creation for now
    console.log('✅ Skipping index creation');

    // Commit the transaction
    await client.query('COMMIT');

    console.log('✅ All tables created successfully!');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

/**
 * Insert initial admin user
 */
async function insertAdminUser() {
  try {
    // Check if admin user already exists
    const checkResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@mindtrack.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists, skipping creation');
      return;
    }

    // Insert admin user
    // In a real application, you would hash the password
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Admin User', 'admin@mindtrack.com', 'admin123', 'admin']
    );

    console.log('✅ Admin user created with ID:', result.rows[0].id);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error inserting admin user:', error);
    throw error;
  }
}

/**
 * Insert sample questionnaire
 */
async function insertSampleQuestionnaire(adminUserId) {
  try {
    // Check if sample questionnaire already exists
    const checkResult = await pool.query(
      'SELECT * FROM questionnaires WHERE title = $1',
      ['Depression Assessment (PHQ-9)']
    );

    if (checkResult.rows.length > 0) {
      console.log('Sample questionnaire already exists, skipping creation');
      return checkResult.rows[0].id;
    }

    // Insert sample questionnaire
    const result = await pool.query(
      `INSERT INTO questionnaires (
        title,
        description,
        instructions,
        created_by,
        is_published
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [
        'Depression Assessment (PHQ-9)',
        'The Patient Health Questionnaire (PHQ-9) is a self-administered depression scale.',
        'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        adminUserId,
        true
      ]
    );

    const questionnaireId = result.rows[0].id;
    console.log('✅ Sample questionnaire created with ID:', questionnaireId);

    // Insert sample questions
    const questions = [
      {
        text: 'Little interest or pleasure in doing things',
        type: 'single_choice',
        required: true,
        order_num: 1,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Feeling down, depressed, or hopeless',
        type: 'single_choice',
        required: true,
        order_num: 2,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Trouble falling or staying asleep, or sleeping too much',
        type: 'single_choice',
        required: true,
        order_num: 3,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Feeling tired or having little energy',
        type: 'single_choice',
        required: true,
        order_num: 4,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Poor appetite or overeating',
        type: 'single_choice',
        required: true,
        order_num: 5,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
        type: 'single_choice',
        required: true,
        order_num: 6,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
        type: 'single_choice',
        required: true,
        order_num: 7,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
        type: 'single_choice',
        required: true,
        order_num: 8,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      },
      {
        text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
        type: 'single_choice',
        required: true,
        order_num: 9,
        options: JSON.stringify([
          { label: 'Not at all', value: '0', score: 0 },
          { label: 'Several days', value: '1', score: 1 },
          { label: 'More than half the days', value: '2', score: 2 },
          { label: 'Nearly every day', value: '3', score: 3 }
        ]),
        scoring_weight: 1
      }
    ];

    for (const question of questions) {
      await pool.query(
        `INSERT INTO questions (
          questionnaire_id,
          text,
          type,
          required,
          order_num,
          options
        )
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          questionnaireId,
          question.text,
          question.type,
          question.required,
          question.order_num,
          question.options
        ]
      );
    }

    console.log('✅ Sample questions created');

    // Skip scoring configuration for now
    console.log('✅ Skipping scoring configuration creation');

    return questionnaireId;
  } catch (error) {
    console.error('Error inserting sample questionnaire:', error);
    throw error;
  }
}

/**
 * Insert sample email templates
 */
async function insertEmailTemplates(adminUserId) {
  try {
    // Skip email templates for now
    console.log('✅ Skipping email templates creation');
    return;
  } catch (error) {
    console.error('Error inserting email templates:', error);
    throw error;
  }
}

/**
 * Main function to set up the database
 */
async function setupDatabase() {
  try {
    console.log('Setting up Neon database...');

    // Create tables
    await createTables();

    // Insert admin user
    const adminUserId = await insertAdminUser();

    // Insert sample questionnaire
    await insertSampleQuestionnaire(adminUserId);

    // Insert email templates
    await insertEmailTemplates(adminUserId);

    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // Close the pool
    await pool.end();
    console.log('Database connection closed');
  }
}

// Run the setup function
setupDatabase();
