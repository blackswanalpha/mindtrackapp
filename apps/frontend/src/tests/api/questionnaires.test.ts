/**
 * Questionnaires API Tests
 */
import { apiTest, loginForTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers, testQuestionnaires, testOrganizations } from '../fixtures/test-data';

describe('Questionnaires API', () => {
  let adminToken: string;
  let organizationId: number;
  let questionnaireId: number;

  // Login as admin and create an organization before tests
  beforeAll(async () => {
    adminToken = await loginForTest(testUsers.admin.email, testUsers.admin.password);
    setAuthToken(adminToken);
    
    // Create an organization for the questionnaires
    const orgResponse = await apiTest.post('/organizations', {
      ...testOrganizations.main,
      name: `Test Org for Questionnaires ${Date.now()}`
    });
    
    organizationId = orgResponse.data.id;
  });

  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(adminToken);
  });

  describe('GET /questionnaires', () => {
    it('should return a list of questionnaires', async () => {
      const response = await apiTest.get('/questionnaires');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check questionnaire structure if any exist
      if (response.data.length > 0) {
        const questionnaire = response.data[0];
        expect(questionnaire).toHaveProperty('id');
        expect(questionnaire).toHaveProperty('title');
        expect(questionnaire).toHaveProperty('type');
      }
    });

    it('should filter questionnaires by type', async () => {
      // First create a questionnaire with a specific type
      await apiTest.post('/questionnaires', {
        ...testQuestionnaires.depression,
        organization_id: organizationId,
        type: 'assessment'
      });
      
      const response = await apiTest.get('/questionnaires?type=assessment');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned questionnaires should have assessment type
      response.data.forEach(q => {
        expect(q.type).toBe('assessment');
      });
    });

    it('should filter questionnaires by organization', async () => {
      const response = await apiTest.get(`/questionnaires?organization_id=${organizationId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned questionnaires should belong to the organization
      response.data.forEach(q => {
        expect(q.organization_id).toBe(organizationId);
      });
    });
  });

  describe('POST /questionnaires', () => {
    it('should create a new questionnaire', async () => {
      const newQuestionnaire = {
        ...testQuestionnaires.depression,
        title: `Depression Assessment ${Date.now()}`,
        organization_id: organizationId
      };

      const response = await apiTest.post('/questionnaires', newQuestionnaire);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newQuestionnaire.title);
      expect(response.data.description).toBe(newQuestionnaire.description);
      expect(response.data.type).toBe(newQuestionnaire.type);
      expect(response.data.organization_id).toBe(organizationId);

      // Save questionnaire ID for later tests
      questionnaireId = response.data.id;
    });

    it('should return 400 when creating questionnaire with invalid data', async () => {
      try {
        await apiTest.post('/questionnaires', {
          // Missing required title
          description: 'Invalid questionnaire',
          organization_id: organizationId
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /questionnaires/:id', () => {
    it('should return a specific questionnaire', async () => {
      const response = await apiTest.get(`/questionnaires/${questionnaireId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(questionnaireId);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('description');
      expect(response.data).toHaveProperty('type');
      expect(response.data).toHaveProperty('organization_id');
    });

    it('should return 404 for non-existent questionnaire', async () => {
      try {
        await apiTest.get('/questionnaires/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /questionnaires/:id', () => {
    it('should update a questionnaire', async () => {
      const updatedData = {
        ...testQuestionnaires.update,
        title: `Updated Questionnaire ${Date.now()}`
      };

      const response = await apiTest.put(`/questionnaires/${questionnaireId}`, updatedData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(questionnaireId);
      expect(response.data.title).toBe(updatedData.title);
      expect(response.data.description).toBe(updatedData.description);
      expect(response.data.type).toBe(updatedData.type);
    });

    it('should return 400 when updating with invalid data', async () => {
      try {
        await apiTest.put(`/questionnaires/${questionnaireId}`, {
          title: '' // Empty title is invalid
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should return 404 for non-existent questionnaire', async () => {
      try {
        await apiTest.put('/questionnaires/9999999', {
          title: 'Updated Questionnaire'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('POST /questionnaires/:id/duplicate', () => {
    it('should duplicate a questionnaire', async () => {
      const response = await apiTest.post(`/questionnaires/${questionnaireId}/duplicate`);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).not.toBe(questionnaireId); // Should be a new ID
      expect(response.data.title).toContain('Copy of'); // Title should indicate it's a copy
    });
  });

  describe('GET /questionnaires/:id/questions', () => {
    it('should return questions for a questionnaire', async () => {
      const response = await apiTest.get(`/questionnaires/${questionnaireId}/questions`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('GET /questionnaires/:id/responses', () => {
    it('should return responses for a questionnaire', async () => {
      const response = await apiTest.get(`/questionnaires/${questionnaireId}/responses`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('DELETE /questionnaires/:id', () => {
    it('should delete a questionnaire', async () => {
      const response = await apiTest.delete(`/questionnaires/${questionnaireId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent questionnaire', async () => {
      try {
        await apiTest.delete('/questionnaires/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
