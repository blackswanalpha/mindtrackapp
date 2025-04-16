/**
 * Migration to create the google_form_responses table
 */
exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS google_form_responses (
      id SERIAL PRIMARY KEY,
      response_id TEXT UNIQUE,
      form_id TEXT NOT NULL,
      respondent_email TEXT,
      response_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      imported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_google_form_responses_form_id ON google_form_responses(form_id);
    CREATE INDEX IF NOT EXISTS idx_google_form_responses_created_at ON google_form_responses(created_at);
  `);
};

exports.down = async (client) => {
  await client.query(`
    DROP TABLE IF EXISTS google_form_responses;
  `);
};
