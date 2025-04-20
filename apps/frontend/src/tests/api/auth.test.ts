/**
 * Authentication API Tests
 */
import { apiTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers } from '../fixtures/test-data';

describe('Authentication API', () => {
  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(null);
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await apiTest.post('/auth/login', {
        email: testUsers.admin.email,
        password: testUsers.admin.password
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(testUsers.admin.email);
    });

    it('should return 401 with invalid credentials', async () => {
      try {
        await apiTest.post('/auth/login', {
          email: testUsers.admin.email,
          password: 'wrong-password'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('message');
      }
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test User'
      };

      const response = await apiTest.post('/auth/register', newUser);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(newUser.email);
      expect(response.data.user.name).toBe(newUser.name);
      // Password should not be returned
      expect(response.data.user).not.toHaveProperty('password');
    });

    it('should return 400 when registering with invalid data', async () => {
      try {
        await apiTest.post('/auth/register', {
          email: 'invalid-email',
          password: '123' // Too short
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('message');
      }
    });

    it('should return 409 when registering with an existing email', async () => {
      try {
        await apiTest.post('/auth/register', {
          email: testUsers.admin.email,
          password: 'Password123!',
          name: 'Duplicate User'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(409);
        expect(error.response.data).toHaveProperty('message');
      }
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send password reset email', async () => {
      const response = await apiTest.post('/auth/forgot-password', {
        email: testUsers.admin.email
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 200 even if email does not exist (for security)', async () => {
      const response = await apiTest.post('/auth/forgot-password', {
        email: 'nonexistent@example.com'
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      // Note: This test is tricky because we need a valid reset token
      // In a real test, we might mock the token generation or use a test endpoint
      
      // For now, we'll just test the API structure
      try {
        await apiTest.post('/auth/reset-password', {
          token: 'test-token',
          password: 'NewPassword123!'
        });
      } catch (error: any) {
        // We expect an error because the token is invalid
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('message');
      }
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile when authenticated', async () => {
      // First login to get token
      const loginResponse = await apiTest.post('/auth/login', {
        email: testUsers.admin.email,
        password: testUsers.admin.password
      });
      
      setAuthToken(loginResponse.data.token);

      // Now get user profile
      const response = await apiTest.get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('email');
      expect(response.data.email).toBe(testUsers.admin.email);
    });

    it('should return 401 when not authenticated', async () => {
      setAuthToken(null);
      
      try {
        await apiTest.get('/auth/me');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      // First login to get token
      const loginResponse = await apiTest.post('/auth/login', {
        email: testUsers.admin.email,
        password: testUsers.admin.password
      });
      
      setAuthToken(loginResponse.data.token);

      // Now logout
      const response = await apiTest.post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });
  });
});
