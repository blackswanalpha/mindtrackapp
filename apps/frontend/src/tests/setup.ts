/**
 * Jest Test Setup
 * 
 * This file contains setup code that runs before tests.
 */

// Set default timeout for tests (30 seconds)
jest.setTimeout(30000);

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api';

// Global beforeAll hook
beforeAll(() => {
  console.log('Starting API tests...');
});

// Global afterAll hook
afterAll(() => {
  console.log('API tests completed.');
});
