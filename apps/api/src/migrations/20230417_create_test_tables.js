const db = require('../config/db');

/**
 * Create test tables for questionnaires, questions, and responses
 */
const up = async () => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Create testquestionnaire table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testquestionnaire (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        source_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);
    
    // Create testquestion table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testquestion (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER NOT NULL REFERENCES testquestionnaire(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        required BOOLEAN DEFAULT FALSE,
        options TEXT,
        order_num INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);
    
    // Create testresponse table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testresponse (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER NOT NULL REFERENCES testquestionnaire(id) ON DELETE CASCADE,
        respondent_email VARCHAR(255) NOT NULL,
        unique_code VARCHAR(50),
        response_data JSONB NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);
    
    // Create indexes
    await client.query('CREATE INDEX idx_testquestion_questionnaire_id ON testquestion(questionnaire_id)');
    await client.query('CREATE INDEX idx_testresponse_questionnaire_id ON testresponse(questionnaire_id)');
    await client.query('CREATE INDEX idx_testresponse_unique_code ON testresponse(unique_code)');
    
    await client.query('COMMIT');
    console.log('Test tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating test tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Drop test tables
 */
const down = async () => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Drop tables in reverse order
    await client.query('DROP TABLE IF EXISTS testresponse');
    await client.query('DROP TABLE IF EXISTS testquestion');
    await client.query('DROP TABLE IF EXISTS testquestionnaire');
    
    await client.query('COMMIT');
    console.log('Test tables dropped successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error dropping test tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { up, down };
