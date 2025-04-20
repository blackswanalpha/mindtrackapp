/**
 * Questions API Tests
 */
import { apiTest, loginForTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers, testQuestionnaires, testQuestions, testOrganizations } from '../fixtures/test-data';

describe('Questions API', () => {
  let adminToken: string;
  let organizationId: number;
  let questionnaireId: number;
  let questionId: number;

  // Login as admin and create necessary data before tests
  beforeAll(async () => {
    adminToken = await loginForTest(testUsers.admin.email, testUsers.admin.password);
    setAuthToken(adminToken);
    
    // Create an organization
    const orgResponse = await apiTest.post('/organizations', {
      ...testOrganizations.main,
      name: `Test Org for Questions ${Date.now()}`
    });
    
    organizationId = orgResponse.data.id;
    
    // Create a questionnaire
    const questionnaireResponse = await apiTest.post('/questionnaires', {
      ...testQuestionnaires.depression,
      title: `Depression Assessment for Questions ${Date.now()}`,
      organization_id: organizationId
    });
    
    questionnaireId = questionnaireResponse.data.id;
  });

  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(adminToken);
  });

  describe('GET /questions', () => {
    it('should return a list of questions', async () => {
      const response = await apiTest.get('/questions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check question structure if any exist
      if (response.data.length > 0) {
        const question = response.data[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('type');
      }
    });

    it('should filter questions by questionnaire', async () => {
      const response = await apiTest.get(`/questions?questionnaire_id=${questionnaireId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned questions should belong to the questionnaire
      response.data.forEach(q => {
        expect(q.questionnaire_id).toBe(questionnaireId);
      });
    });

    it('should filter questions by type', async () => {
      // First create a question with a specific type
      await apiTest.post('/questions', {
        ...testQuestions.singleChoice,
        questionnaire_id: questionnaireId,
        type: 'single_choice'
      });
      
      const response = await apiTest.get('/questions?type=single_choice');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned questions should have single_choice type
      response.data.forEach(q => {
        expect(q.type).toBe('single_choice');
      });
    });
  });

  describe('POST /questions', () => {
    it('should create a new question', async () => {
      const newQuestion = {
        ...testQuestions.singleChoice,
        text: `Test Question ${Date.now()}`,
        questionnaire_id: questionnaireId
      };

      const response = await apiTest.post('/questions', newQuestion);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.text).toBe(newQuestion.text);
      expect(response.data.type).toBe(newQuestion.type);
      expect(response.data.questionnaire_id).toBe(questionnaireId);
      
      if (newQuestion.options) {
        expect(response.data).toHaveProperty('options');
        expect(Array.isArray(response.data.options)).toBe(true);
        expect(response.data.options.length).toBe(newQuestion.options.length);
      }

      // Save question ID for later tests
      questionId = response.data.id;
    });

    it('should create a question with multiple choice options', async () => {
      const newQuestion = {
        ...testQuestions.multipleChoice,
        text: `Multiple Choice Question ${Date.now()}`,
        questionnaire_id: questionnaireId
      };

      const response = await apiTest.post('/questions', newQuestion);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.text).toBe(newQuestion.text);
      expect(response.data.type).toBe(newQuestion.type);
      expect(response.data).toHaveProperty('options');
      expect(Array.isArray(response.data.options)).toBe(true);
      expect(response.data.options.length).toBe(newQuestion.options!.length);
      
      // Check option structure
      const option = response.data.options[0];
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('label');
    });

    it('should return 400 when creating question with invalid data', async () => {
      try {
        await apiTest.post('/questions', {
          // Missing required text
          type: 'single_choice',
          questionnaire_id: questionnaireId
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /questions/:id', () => {
    it('should return a specific question', async () => {
      const response = await apiTest.get(`/questions/${questionId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(questionId);
      expect(response.data).toHaveProperty('text');
      expect(response.data).toHaveProperty('type');
      expect(response.data).toHaveProperty('questionnaire_id');
    });

    it('should return 404 for non-existent question', async () => {
      try {
        await apiTest.get('/questions/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /questions/:id', () => {
    it('should update a question', async () => {
      const updatedData = {
        ...testQuestions.update,
        text: `Updated Question ${Date.now()}`
      };

      const response = await apiTest.put(`/questions/${questionId}`, updatedData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(questionId);
      expect(response.data.text).toBe(updatedData.text);
      expect(response.data.type).toBe(updatedData.type);
      
      if (updatedData.options) {
        expect(response.data).toHaveProperty('options');
        expect(Array.isArray(response.data.options)).toBe(true);
        expect(response.data.options.length).toBe(updatedData.options.length);
      }
    });

    it('should return 400 when updating with invalid data', async () => {
      try {
        await apiTest.put(`/questions/${questionId}`, {
          text: '' // Empty text is invalid
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should return 404 for non-existent question', async () => {
      try {
        await apiTest.put('/questions/9999999', {
          text: 'Updated Question'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /questions/:id/order', () => {
    it('should update question order', async () => {
      const newOrder = 5;
      
      const response = await apiTest.put(`/questions/${questionId}/order`, {
        order_num: newOrder
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(questionId);
      expect(response.data).toHaveProperty('order_num');
      expect(response.data.order_num).toBe(newOrder);
    });
  });

  describe('DELETE /questions/:id', () => {
    it('should delete a question', async () => {
      const response = await apiTest.delete(`/questions/${questionId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent question', async () => {
      try {
        await apiTest.delete('/questions/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
