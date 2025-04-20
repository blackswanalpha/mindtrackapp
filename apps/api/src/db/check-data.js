require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool using the DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon connections
  }
});

async function checkData() {
  try {
    console.log('Checking database data...');
    
    // Check users
    const usersResult = await pool.query('SELECT id, name, email, role FROM users');
    console.log('\nUsers:');
    usersResult.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Check questionnaires
    const questionnairesResult = await pool.query('SELECT id, title, description FROM questionnaires');
    console.log('\nQuestionnaires:');
    questionnairesResult.rows.forEach(q => {
      console.log(`- ID: ${q.id}, Title: ${q.title}, Description: ${q.description ? q.description.substring(0, 50) + '...' : 'N/A'}`);
    });
    
    // Check questions for the first questionnaire
    if (questionnairesResult.rows.length > 0) {
      const firstQuestionnaireId = questionnairesResult.rows[0].id;
      const questionsResult = await pool.query(
        'SELECT id, text, type, order_num FROM questions WHERE questionnaire_id = $1 ORDER BY order_num',
        [firstQuestionnaireId]
      );
      
      console.log(`\nQuestions for questionnaire ID ${firstQuestionnaireId}:`);
      questionsResult.rows.forEach(q => {
        console.log(`- ID: ${q.id}, Order: ${q.order_num}, Type: ${q.type}, Text: ${q.text.substring(0, 50)}${q.text.length > 50 ? '...' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await pool.end();
    console.log('\nDatabase connection closed');
  }
}

checkData();
