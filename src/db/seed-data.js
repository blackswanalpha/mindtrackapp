require('dotenv').config();
const { getPool } = require('./neon');
const bcrypt = require('bcrypt');

// Get database pool
const pool = getPool();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Healthcare Provider',
    email: 'provider@example.com',
    password: 'password123',
    role: 'healthcare_provider'
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

const questionnaires = [
  {
    title: 'Depression Assessment',
    description: 'Standard assessment for depression symptoms',
    instructions: 'Please answer each question based on how you have been feeling over the past two weeks.',
    created_by: 1 // Will be replaced with actual user ID
  },
  {
    title: 'Anxiety Screening',
    description: 'Screening tool for anxiety disorders',
    instructions: 'Rate each item based on how you have been feeling during the past week.',
    created_by: 1 // Will be replaced with actual user ID
  },
  {
    title: 'Well-being Check',
    description: 'General mental health and well-being assessment',
    instructions: 'Consider your overall well-being when answering these questions.',
    created_by: 2 // Will be replaced with actual user ID
  }
];

const questions = [
  // Depression Assessment questions
  {
    questionnaire_id: 1, // Will be replaced with actual questionnaire ID
    text: 'Little interest or pleasure in doing things',
    type: 'multiple_choice',
    options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
    order: 1,
    required: true
  },
  {
    questionnaire_id: 1, // Will be replaced with actual questionnaire ID
    text: 'Feeling down, depressed, or hopeless',
    type: 'multiple_choice',
    options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
    order: 2,
    required: true
  },
  {
    questionnaire_id: 1, // Will be replaced with actual questionnaire ID
    text: 'Trouble falling or staying asleep, or sleeping too much',
    type: 'multiple_choice',
    options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
    order: 3,
    required: true
  },
  
  // Anxiety Screening questions
  {
    questionnaire_id: 2, // Will be replaced with actual questionnaire ID
    text: 'Feeling nervous, anxious, or on edge',
    type: 'multiple_choice',
    options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
    order: 1,
    required: true
  },
  {
    questionnaire_id: 2, // Will be replaced with actual questionnaire ID
    text: 'Not being able to stop or control worrying',
    type: 'multiple_choice',
    options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
    order: 2,
    required: true
  },
  {
    questionnaire_id: 2, // Will be replaced with actual questionnaire ID
    text: 'Worrying too much about different things',
    type: 'multiple_choice',
    options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
    order: 3,
    required: true
  },
  
  // Well-being Check questions
  {
    questionnaire_id: 3, // Will be replaced with actual questionnaire ID
    text: 'I've been feeling optimistic about the future',
    type: 'multiple_choice',
    options: JSON.stringify(['None of the time', 'Rarely', 'Some of the time', 'Often', 'All of the time']),
    order: 1,
    required: true
  },
  {
    questionnaire_id: 3, // Will be replaced with actual questionnaire ID
    text: 'I've been feeling useful',
    type: 'multiple_choice',
    options: JSON.stringify(['None of the time', 'Rarely', 'Some of the time', 'Often', 'All of the time']),
    order: 2,
    required: true
  },
  {
    questionnaire_id: 3, // Will be replaced with actual questionnaire ID
    text: 'I've been feeling relaxed',
    type: 'multiple_choice',
    options: JSON.stringify(['None of the time', 'Rarely', 'Some of the time', 'Often', 'All of the time']),
    order: 3,
    required: true
  },
  {
    questionnaire_id: 3, // Will be replaced with actual questionnaire ID
    text: 'Is there anything else you would like to share about your well-being?',
    type: 'text',
    options: null,
    order: 4,
    required: false
  }
];

// Function to create tables if they don't exist
async function createTables() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        profile_image VARCHAR(255),
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');

    // Create questionnaires table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questionnaires (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        created_by INTEGER REFERENCES users(id),
        is_published BOOLEAN DEFAULT false,
        is_archived BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Questionnaires table created or already exists');

    // Create questions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER REFERENCES questionnaires(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        options JSONB,
        order_num INTEGER NOT NULL,
        required BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Questions table created or already exists');

    // Create responses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        questionnaire_id INTEGER REFERENCES questionnaires(id) ON DELETE CASCADE,
        respondent_email VARCHAR(255),
        unique_code VARCHAR(50) UNIQUE NOT NULL,
        is_completed BOOLEAN DEFAULT false,
        flagged BOOLEAN DEFAULT false,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Responses table created or already exists');

    // Create answers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        response_id INTEGER REFERENCES responses(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        answer_text TEXT,
        answer_option INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Answers table created or already exists');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Function to insert users
async function insertUsers() {
  try {
    const saltRounds = 10;
    const userIds = [];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      
      const result = await pool.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE
        SET name = $1, password = $3, role = $4
        RETURNING id
      `, [user.name, user.email, hashedPassword, user.role]);
      
      userIds.push(result.rows[0].id);
      console.log(`User created or updated: ${user.email}`);
    }
    
    return userIds;
  } catch (error) {
    console.error('Error inserting users:', error);
    throw error;
  }
}

// Function to insert questionnaires
async function insertQuestionnaires(userIds) {
  try {
    const questionnaireIds = [];
    
    for (let i = 0; i < questionnaires.length; i++) {
      const questionnaire = questionnaires[i];
      // Use the corresponding user ID or default to the first user
      const createdBy = userIds[i % userIds.length];
      
      const result = await pool.query(`
        INSERT INTO questionnaires (title, description, instructions, created_by, is_published)
        VALUES ($1, $2, $3, $4, true)
        RETURNING id
      `, [questionnaire.title, questionnaire.description, questionnaire.instructions, createdBy]);
      
      questionnaireIds.push(result.rows[0].id);
      console.log(`Questionnaire created: ${questionnaire.title}`);
    }
    
    return questionnaireIds;
  } catch (error) {
    console.error('Error inserting questionnaires:', error);
    throw error;
  }
}

// Function to insert questions
async function insertQuestions(questionnaireIds) {
  try {
    for (const question of questions) {
      // Map the question to the correct questionnaire
      const questionnaireIndex = question.questionnaire_id - 1;
      const questionnaireId = questionnaireIds[questionnaireIndex];
      
      await pool.query(`
        INSERT INTO questions (questionnaire_id, text, type, options, order_num, required)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [questionnaireId, question.text, question.type, question.options, question.order, question.required]);
      
      console.log(`Question created: ${question.text.substring(0, 30)}...`);
    }
  } catch (error) {
    console.error('Error inserting questions:', error);
    throw error;
  }
}

// Main function to seed the database
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Create tables
    await createTables();
    
    // Insert users and get their IDs
    const userIds = await insertUsers();
    
    // Insert questionnaires and get their IDs
    const questionnaireIds = await insertQuestionnaires(userIds);
    
    // Insert questions
    await insertQuestions(questionnaireIds);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the pool
    await pool.end();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase();
