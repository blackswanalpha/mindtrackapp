/**
 * Responses API Tests
 */
import { apiTest, loginForTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers, testQuestionnaires, testQuestions, testResponses, testOrganizations } from '../fixtures/test-data';

describe('Responses API', () => {
  let adminToken: string;
  let organizationId: number;
  let questionnaireId: number;
  let questionIds: number[] = [];
  let responseId: number;

  // Login as admin and create necessary data before tests
  beforeAll(async () => {
    adminToken = await loginForTest(testUsers.admin.email, testUsers.admin.password);
    setAuthToken(adminToken);
    
    // Create an organization
    const orgResponse = await apiTest.post('/organizations', {
      ...testOrganizations.main,
      name: `Test Org for Responses ${Date.now()}`
    });
    
    organizationId = orgResponse.data.id;
    
    // Create a questionnaire
    const questionnaireResponse = await apiTest.post('/questionnaires', {
      ...testQuestionnaires.depression,
      title: `Depression Assessment for Responses ${Date.now()}`,
      organization_id: organizationId
    });
    
    questionnaireId = questionnaireResponse.data.id;
    
    // Create questions
    const question1Response = await apiTest.post('/questions', {
      ...testQuestions.singleChoice,
      text: `Single Choice Question ${Date.now()}`,
      questionnaire_id: questionnaireId
    });
    
    const question2Response = await apiTest.post('/questions', {
      ...testQuestions.multipleChoice,
      text: `Multiple Choice Question ${Date.now()}`,
      questionnaire_id: questionnaireId
    });
    
    const question3Response = await apiTest.post('/questions', {
      ...testQuestions.text,
      text: `Text Question ${Date.now()}`,
      questionnaire_id: questionnaireId
    });
    
    questionIds = [
      question1Response.data.id,
      question2Response.data.id,
      question3Response.data.id
    ];
  });

  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(adminToken);
  });

  describe('GET /responses', () => {
    it('should return a list of responses', async () => {
      const response = await apiTest.get('/responses');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check response structure if any exist
      if (response.data.length > 0) {
        const responseItem = response.data[0];
        expect(responseItem).toHaveProperty('id');
        expect(responseItem).toHaveProperty('questionnaire_id');
        expect(responseItem).toHaveProperty('patient_email');
      }
    });

    it('should filter responses by questionnaire', async () => {
      const response = await apiTest.get(`/responses?questionnaire_id=${questionnaireId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned responses should belong to the questionnaire
      response.data.forEach(r => {
        expect(r.questionnaire_id).toBe(questionnaireId);
      });
    });
  });

  describe('POST /responses', () => {
    it('should create a new response', async () => {
      // Prepare response data with actual question IDs
      const responseData = {
        ...testResponses.complete,
        questionnaire_id: questionnaireId,
        patient_email: `patient-${Date.now()}@example.com`,
        answers: [
          {
            question_id: questionIds[0],
            value: 2
          },
          {
            question_id: questionIds[1],
            value: [1, 3]
          },
          {
            question_id: questionIds[2],
            value: 'Test response text.'
          }
        ]
      };

      const response = await apiTest.post('/responses', responseData);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.questionnaire_id).toBe(questionnaireId);
      expect(response.data.patient_email).toBe(responseData.patient_email);
      expect(response.data).toHaveProperty('answers');
      expect(Array.isArray(response.data.answers)).toBe(true);
      expect(response.data.answers.length).toBe(responseData.answers.length);

      // Save response ID for later tests
      responseId = response.data.id;
    });

    it('should create a partial response', async () => {
      // Prepare response data with actual question IDs
      const responseData = {
        ...testResponses.partial,
        questionnaire_id: questionnaireId,
        patient_email: `partial-patient-${Date.now()}@example.com`,
        answers: [
          {
            question_id: questionIds[0],
            value: 1
          }
        ]
      };

      const response = await apiTest.post('/responses', responseData);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.questionnaire_id).toBe(questionnaireId);
      expect(response.data.patient_email).toBe(responseData.patient_email);
      expect(response.data).toHaveProperty('answers');
      expect(Array.isArray(response.data.answers)).toBe(true);
      expect(response.data.answers.length).toBe(responseData.answers.length);
    });

    it('should return 400 when creating response with invalid data', async () => {
      try {
        await apiTest.post('/responses', {
          // Missing required questionnaire_id
          patient_email: 'patient@example.com',
          answers: []
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /responses/:id', () => {
    it('should return a specific response', async () => {
      const response = await apiTest.get(`/responses/${responseId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(responseId);
      expect(response.data).toHaveProperty('questionnaire_id');
      expect(response.data).toHaveProperty('patient_email');
      expect(response.data).toHaveProperty('answers');
      expect(Array.isArray(response.data.answers)).toBe(true);
    });

    it('should return 404 for non-existent response', async () => {
      try {
        await apiTest.get('/responses/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('GET /responses/:id/score', () => {
    it('should return score for a response', async () => {
      const response = await apiTest.get(`/responses/${responseId}/score`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('score');
      expect(typeof response.data.score).toBe('number');
      expect(response.data).toHaveProperty('max_score');
      expect(typeof response.data.max_score).toBe('number');
      expect(response.data).toHaveProperty('percentage');
      expect(typeof response.data.percentage).toBe('number');
    });
  });

  describe('GET /responses/:id/analysis', () => {
    it('should return analysis for a response', async () => {
      const response = await apiTest.get(`/responses/${responseId}/analysis`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('analysis');
      expect(typeof response.data.analysis).toBe('string');
      expect(response.data.analysis.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /responses/:id', () => {
    it('should delete a response', async () => {
      const response = await apiTest.delete(`/responses/${responseId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent response', async () => {
      try {
        await apiTest.delete('/responses/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
