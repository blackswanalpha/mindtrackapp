/**
 * Organizations API Tests
 */
import { apiTest, loginForTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers, testOrganizations } from '../fixtures/test-data';

describe('Organizations API', () => {
  let adminToken: string;
  let organizationId: number;

  // Login as admin before tests
  beforeAll(async () => {
    adminToken = await loginForTest(testUsers.admin.email, testUsers.admin.password);
  });

  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(adminToken);
  });

  describe('GET /organizations', () => {
    it('should return a list of organizations', async () => {
      const response = await apiTest.get('/organizations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check organization structure if any exist
      if (response.data.length > 0) {
        const organization = response.data[0];
        expect(organization).toHaveProperty('id');
        expect(organization).toHaveProperty('name');
      }
    });

    it('should filter organizations by type', async () => {
      // First create an organization with a specific type if needed
      const createResponse = await apiTest.post('/organizations', {
        ...testOrganizations.main,
        type: 'healthcare'
      });
      
      const response = await apiTest.get('/organizations?type=healthcare');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned organizations should have healthcare type
      response.data.forEach(org => {
        expect(org.type).toBe('healthcare');
      });
    });

    it('should return 401 when not authenticated', async () => {
      setAuthToken(null);
      
      try {
        await apiTest.get('/organizations');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('POST /organizations', () => {
    it('should create a new organization', async () => {
      const newOrg = {
        ...testOrganizations.main,
        name: `Test Org ${Date.now()}`
      };

      const response = await apiTest.post('/organizations', newOrg);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newOrg.name);
      expect(response.data.description).toBe(newOrg.description);
      expect(response.data.type).toBe(newOrg.type);

      // Save organization ID for later tests
      organizationId = response.data.id;
    });

    it('should return 400 when creating organization with invalid data', async () => {
      try {
        await apiTest.post('/organizations', {
          // Missing required name
          description: 'Invalid organization'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /organizations/:id', () => {
    it('should return a specific organization', async () => {
      const response = await apiTest.get(`/organizations/${organizationId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(organizationId);
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('description');
      expect(response.data).toHaveProperty('type');
    });

    it('should return 404 for non-existent organization', async () => {
      try {
        await apiTest.get('/organizations/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /organizations/:id', () => {
    it('should update an organization', async () => {
      const updatedData = {
        ...testOrganizations.update,
        name: `Updated Org ${Date.now()}`
      };

      const response = await apiTest.put(`/organizations/${organizationId}`, updatedData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(organizationId);
      expect(response.data.name).toBe(updatedData.name);
      expect(response.data.description).toBe(updatedData.description);
      expect(response.data.type).toBe(updatedData.type);
    });

    it('should return 400 when updating with invalid data', async () => {
      try {
        await apiTest.put(`/organizations/${organizationId}`, {
          name: '' // Empty name is invalid
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should return 404 for non-existent organization', async () => {
      try {
        await apiTest.put('/organizations/9999999', {
          name: 'Updated Organization'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('GET /organizations/:id/members', () => {
    it('should return organization members', async () => {
      const response = await apiTest.get(`/organizations/${organizationId}/members`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check member structure if any exist
      if (response.data.length > 0) {
        const member = response.data[0];
        expect(member).toHaveProperty('user_id');
        expect(member).toHaveProperty('organization_id');
        expect(member).toHaveProperty('role');
      }
    });
  });

  describe('POST /organizations/:id/members', () => {
    it('should add a member to an organization', async () => {
      // First create a user to add as a member
      const userResponse = await apiTest.post('/users', {
        email: `org-member-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Organization Member',
        role: 'user'
      });
      
      const userId = userResponse.data.id;
      
      const response = await apiTest.post(`/organizations/${organizationId}/members`, {
        user_id: userId,
        role: 'member'
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('user_id');
      expect(response.data.user_id).toBe(userId);
      expect(response.data).toHaveProperty('organization_id');
      expect(response.data.organization_id).toBe(organizationId);
      expect(response.data).toHaveProperty('role');
      expect(response.data.role).toBe('member');
    });
  });

  describe('DELETE /organizations/:id/members/:userId', () => {
    it('should remove a member from an organization', async () => {
      // First create a user and add as a member
      const userResponse = await apiTest.post('/users', {
        email: `org-member-remove-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Organization Member to Remove',
        role: 'user'
      });
      
      const userId = userResponse.data.id;
      
      await apiTest.post(`/organizations/${organizationId}/members`, {
        user_id: userId,
        role: 'member'
      });
      
      // Now remove the member
      const response = await apiTest.delete(`/organizations/${organizationId}/members/${userId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });
  });

  describe('DELETE /organizations/:id', () => {
    it('should delete an organization', async () => {
      const response = await apiTest.delete(`/organizations/${organizationId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent organization', async () => {
      try {
        await apiTest.delete('/organizations/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
