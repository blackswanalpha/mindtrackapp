require('dotenv').config();
const { execSync } = require('child_process');

console.log('Running API endpoint tests...');

try {
  // Run mock API tests first (these don't require a database connection)
  execSync('npx jest mock-api-endpoints.test.js --detectOpenHandles', {
    cwd: __dirname,
    stdio: 'inherit'
  });

  // Check if we should run database tests
  const runDbTests = process.env.RUN_DB_TESTS === 'true';

  if (runDbTests) {
    console.log('\nRunning database integration tests...');

    // Run questionnaire tests
    execSync('npx jest questionnaire.test.js --detectOpenHandles', {
      cwd: __dirname,
      stdio: 'inherit'
    });

    // Run response tests
    execSync('npx jest response.test.js --detectOpenHandles', {
      cwd: __dirname,
      stdio: 'inherit'
    });

    // Run QR code tests
    execSync('npx jest qrcode.test.js --detectOpenHandles', {
      cwd: __dirname,
      stdio: 'inherit'
    });
  } else {
    console.log('\nSkipping database integration tests. Set RUN_DB_TESTS=true to run them.');
  }

  console.log('\nAll tests completed successfully!');
} catch (error) {
  console.error('Tests failed with error:', error.message);
  process.exit(1);
}
