require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool using the DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon connections
  }
});

async function checkTables() {
  try {
    console.log('Checking database tables...');

    // Get list of tables
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    // Check questionnaires table structure
    if (tablesResult.rows.some(row => row.table_name === 'questionnaires')) {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'questionnaires'
        ORDER BY ordinal_position
      `);

      console.log('\nQuestionnaires table structure:');
      columnsResult.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    } else {
      console.log('\nQuestionnaires table does not exist');
    }

    // Check questions table structure
    if (tablesResult.rows.some(row => row.table_name === 'questions')) {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'questions'
        ORDER BY ordinal_position
      `);

      console.log('\nQuestions table structure:');
      columnsResult.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    } else {
      console.log('\nQuestions table does not exist');
    }

    // Check scoring_configs table structure
    if (tablesResult.rows.some(row => row.table_name === 'scoring_configs')) {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'scoring_configs'
        ORDER BY ordinal_position
      `);

      console.log('\nScoring configs table structure:');
      columnsResult.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    } else {
      console.log('\nScoring configs table does not exist');
    }

    // Check email_templates table structure
    if (tablesResult.rows.some(row => row.table_name === 'email_templates')) {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'email_templates'
        ORDER BY ordinal_position
      `);

      console.log('\nEmail templates table structure:');
      columnsResult.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    } else {
      console.log('\nEmail templates table does not exist');
    }

  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await pool.end();
    console.log('\nDatabase connection closed');
  }
}

checkTables();
