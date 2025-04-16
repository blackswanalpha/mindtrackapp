const { execSync } = require('child_process');

console.log('Building with ESLint and TypeScript checks disabled...');

try {
  execSync('next build --no-lint', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
