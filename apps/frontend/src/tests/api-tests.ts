/**
 * API Tests Runner
 * 
 * This file runs all API tests in sequence.
 */

import { cleanupTestData } from './utils/api-test-utils';

// Import all test files
import './api/auth.test';
import './api/users.test';
import './api/organizations.test';
import './api/questionnaires.test';
import './api/questions.test';
import './api/responses.test';
import './api/notifications.test';

// Clean up test data after all tests
afterAll(async () => {
  await cleanupTestData();
});
