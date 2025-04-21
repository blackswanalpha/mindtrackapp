/**
 * Migration script to add missing columns to the questionnaires table
 */

require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool using the DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon connections
  }
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('Starting migration...');

    // Start a transaction
    await client.query('BEGIN');

    // Check if the questionnaires table exists
    const tableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'questionnaires'
      );
    `);

    const tableExists = tableCheckResult.rows[0].exists;

    if (!tableExists) {
      console.log('Creating questionnaires table...');

      // Create the questionnaires table
      await client.query(`
        CREATE TABLE questionnaires (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          instructions TEXT,
          type VARCHAR(50) DEFAULT 'standard',
          category VARCHAR(100),
          estimated_time_minutes INTEGER,
          is_active BOOLEAN DEFAULT TRUE,
          is_adaptive BOOLEAN DEFAULT FALSE,
          is_qr_enabled BOOLEAN DEFAULT TRUE,
          is_template BOOLEAN DEFAULT FALSE,
          is_public BOOLEAN DEFAULT FALSE,
          allow_anonymous BOOLEAN DEFAULT TRUE,
          requires_auth BOOLEAN DEFAULT FALSE,
          max_responses INTEGER,
          expires_at TIMESTAMP,
          tags JSONB,
          organization_id INTEGER,
          created_by_id INTEGER,
          parent_id INTEGER,
          version INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log('Questionnaires table created successfully.');
    } else {
      console.log('Questionnaires table already exists. Checking for missing columns...');

      // Get existing columns
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'questionnaires';
      `);

      const existingColumns = columnsResult.rows.map(row => row.column_name);
      console.log('Existing columns:', existingColumns);

      // Define required columns and their definitions
      const requiredColumns = {
        type: 'VARCHAR(50) DEFAULT \'standard\'',
        instructions: 'TEXT',
        category: 'VARCHAR(100)',
        estimated_time_minutes: 'INTEGER',
        is_active: 'BOOLEAN DEFAULT TRUE',
        is_adaptive: 'BOOLEAN DEFAULT FALSE',
        is_qr_enabled: 'BOOLEAN DEFAULT TRUE',
        is_template: 'BOOLEAN DEFAULT FALSE',
        is_public: 'BOOLEAN DEFAULT FALSE',
        allow_anonymous: 'BOOLEAN DEFAULT TRUE',
        requires_auth: 'BOOLEAN DEFAULT FALSE',
        max_responses: 'INTEGER',
        expires_at: 'TIMESTAMP',
        tags: 'JSONB',
        organization_id: 'INTEGER',
        created_by_id: 'INTEGER',
        parent_id: 'INTEGER',
        version: 'INTEGER DEFAULT 1'
      };

      // Add missing columns
      for (const [column, definition] of Object.entries(requiredColumns)) {
        if (!existingColumns.includes(column)) {
          console.log(`Adding missing column: ${column}`);
          await client.query(`ALTER TABLE questionnaires ADD COLUMN ${column} ${definition};`);
        }
      }
    }

    // Check if the questions table exists
    const questionsTableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'questions'
      );
    `);

    const questionsTableExists = questionsTableCheckResult.rows[0].exists;

    if (!questionsTableExists) {
      console.log('Creating questions table...');

      // Create the questions table
      await client.query(`
        CREATE TABLE questions (
          id SERIAL PRIMARY KEY,
          questionnaire_id INTEGER NOT NULL,
          text TEXT NOT NULL,
          description TEXT,
          type VARCHAR(50) NOT NULL,
          required BOOLEAN DEFAULT TRUE,
          order_num INTEGER,
          options JSONB,
          conditional_logic JSONB,
          validation_rules JSONB,
          scoring_weight NUMERIC DEFAULT 1,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log('Questions table created successfully.');
    } else {
      console.log('Questions table already exists. Checking for missing columns...');

      // Get existing columns
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'questions';
      `);

      const existingColumns = columnsResult.rows.map(row => row.column_name);
      console.log('Existing columns in questions table:', existingColumns);

      // Define required columns and their definitions
      const requiredColumns = {
        questionnaire_id: 'INTEGER NOT NULL',
        text: 'TEXT NOT NULL',
        description: 'TEXT',
        type: 'VARCHAR(50) NOT NULL',
        required: 'BOOLEAN DEFAULT TRUE',
        order_num: 'INTEGER',
        options: 'JSONB',
        conditional_logic: 'JSONB',
        validation_rules: 'JSONB',
        scoring_weight: 'NUMERIC DEFAULT 1'
      };

      // Add missing columns
      for (const [column, definition] of Object.entries(requiredColumns)) {
        if (!existingColumns.includes(column)) {
          console.log(`Adding missing column to questions table: ${column}`);
          await client.query(`ALTER TABLE questions ADD COLUMN ${column} ${definition};`);
        }
      }
    }

    // Check if the responses table exists
    const responsesTableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'responses'
      );
    `);

    const responsesTableExists = responsesTableCheckResult.rows[0].exists;

    if (!responsesTableExists) {
      console.log('Creating responses table...');

      // Create the responses table
      await client.query(`
        CREATE TABLE responses (
          id SERIAL PRIMARY KEY,
          questionnaire_id INTEGER NOT NULL,
          user_id INTEGER,
          patient_identifier VARCHAR(255),
          patient_name VARCHAR(255),
          patient_email VARCHAR(255),
          patient_age INTEGER,
          patient_gender VARCHAR(50),
          organization_id INTEGER,
          score NUMERIC,
          risk_level VARCHAR(50),
          flagged_for_review BOOLEAN DEFAULT FALSE,
          unique_code VARCHAR(50),
          completion_time INTEGER,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log('Responses table created successfully.');
    } else {
      console.log('Responses table already exists. Checking for missing columns...');

      // Get existing columns
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'responses';
      `);

      const existingColumns = columnsResult.rows.map(row => row.column_name);
      console.log('Existing columns in responses table:', existingColumns);

      // Define required columns and their definitions
      const requiredColumns = {
        questionnaire_id: 'INTEGER NOT NULL',
        user_id: 'INTEGER',
        patient_identifier: 'VARCHAR(255)',
        patient_name: 'VARCHAR(255)',
        patient_email: 'VARCHAR(255)',
        patient_age: 'INTEGER',
        patient_gender: 'VARCHAR(50)',
        organization_id: 'INTEGER',
        score: 'NUMERIC',
        risk_level: 'VARCHAR(50)',
        flagged_for_review: 'BOOLEAN DEFAULT FALSE',
        unique_code: 'VARCHAR(50)',
        completion_time: 'INTEGER',
        completed_at: 'TIMESTAMP'
      };

      // Add missing columns
      for (const [column, definition] of Object.entries(requiredColumns)) {
        if (!existingColumns.includes(column)) {
          console.log(`Adding missing column to responses table: ${column}`);
          await client.query(`ALTER TABLE responses ADD COLUMN ${column} ${definition};`);
        }
      }
    }

    // Check if the answers table exists
    const answersTableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'answers'
      );
    `);

    const answersTableExists = answersTableCheckResult.rows[0].exists;

    if (!answersTableExists) {
      console.log('Creating answers table...');

      // Create the answers table
      await client.query(`
        CREATE TABLE answers (
          id SERIAL PRIMARY KEY,
          response_id INTEGER NOT NULL,
          question_id INTEGER NOT NULL,
          value TEXT,
          score NUMERIC,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log('Answers table created successfully.');
    } else {
      console.log('Answers table already exists. Checking for missing columns...');

      // Get existing columns
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'answers';
      `);

      const existingColumns = columnsResult.rows.map(row => row.column_name);
      console.log('Existing columns in answers table:', existingColumns);

      // Define required columns and their definitions
      const requiredColumns = {
        response_id: 'INTEGER NOT NULL',
        question_id: 'INTEGER NOT NULL',
        value: 'TEXT',
        score: 'NUMERIC'
      };

      // Add missing columns
      for (const [column, definition] of Object.entries(requiredColumns)) {
        if (!existingColumns.includes(column)) {
          console.log(`Adding missing column to answers table: ${column}`);
          await client.query(`ALTER TABLE answers ADD COLUMN ${column} ${definition};`);
        }
      }
    }

    // Commit the transaction
    await client.query('COMMIT');

    console.log('Migration completed successfully.');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    // Release the client
    client.release();

    // Close the pool
    await pool.end();
  }
}

// Run the migration
runMigration().catch(console.error);
