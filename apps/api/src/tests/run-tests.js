require('dotenv').config();
const { execSync } = require('child_process');

console.log('Running API endpoint tests...');

try {
  execSync('npx jest mock-api-endpoints.test.js --detectOpenHandles', {
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed with error:', error.message);
  process.exit(1);
}
