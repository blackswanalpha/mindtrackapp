/**
 * Users API Tests
 */
import { apiTest, loginForTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers } from '../fixtures/test-data';

describe('Users API', () => {
  let adminToken: string;
  let userId: number;

  // Login as admin before tests
  beforeAll(async () => {
    adminToken = await loginForTest(testUsers.admin.email, testUsers.admin.password);
  });

  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(adminToken);
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await apiTest.get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      
      // Check user structure
      const user = response.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      // Password should not be returned
      expect(user).not.toHaveProperty('password');
    });

    it('should filter users by role', async () => {
      const response = await apiTest.get('/users?role=admin');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned users should have admin role
      response.data.forEach(user => {
        expect(user.role).toBe('admin');
      });
    });

    it('should return 401 when not authenticated', async () => {
      setAuthToken(null);
      
      try {
        await apiTest.get('/users');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: `test-user-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test User',
        role: 'user'
      };

      const response = await apiTest.post('/users', newUser);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.email).toBe(newUser.email);
      expect(response.data.name).toBe(newUser.name);
      expect(response.data.role).toBe(newUser.role);
      // Password should not be returned
      expect(response.data).not.toHaveProperty('password');

      // Save user ID for later tests
      userId = response.data.id;
    });

    it('should return 400 when creating user with invalid data', async () => {
      try {
        await apiTest.post('/users', {
          email: 'invalid-email',
          password: '123' // Too short
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should return 409 when creating user with existing email', async () => {
      try {
        await apiTest.post('/users', {
          email: testUsers.admin.email,
          password: 'Password123!',
          name: 'Duplicate User',
          role: 'user'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(409);
      }
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
      const response = await apiTest.get(`/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(userId);
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('role');
      // Password should not be returned
      expect(response.data).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      try {
        await apiTest.get('/users/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const updatedData = {
        name: `Updated Name ${Date.now()}`,
        role: 'user'
      };

      const response = await apiTest.put(`/users/${userId}`, updatedData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(userId);
      expect(response.data.name).toBe(updatedData.name);
      expect(response.data.role).toBe(updatedData.role);
    });

    it('should return 400 when updating with invalid data', async () => {
      try {
        await apiTest.put(`/users/${userId}`, {
          email: 'invalid-email'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should return 404 for non-existent user', async () => {
      try {
        await apiTest.put('/users/9999999', {
          name: 'Updated Name'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const response = await apiTest.delete(`/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent user', async () => {
      try {
        await apiTest.delete('/users/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
