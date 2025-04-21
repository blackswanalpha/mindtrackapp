/**
 * Response API tests
 */

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Response API', () => {
  let authToken;
  let questionnaireId;
  let questionId;
  let responseId;

  // Before all tests, set up test data
  beforeAll(async () => {
    // Login as admin
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@mindtrack.com',
        password: 'admin123'
      });

    authToken = loginResponse.body.token;

    // Create a test questionnaire
    const questionnaireResponse = await request(app)
      .post('/api/questionnaires')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Response Questionnaire',
        description: 'This is a test questionnaire for response tests',
        type: 'standard',
        is_active: true,
        is_qr_enabled: true,
        allow_anonymous: true
      });

    questionnaireId = questionnaireResponse.body.questionnaire.id;

    // Create a test question
    const questionResponse = await request(app)
      .post(`/api/questionnaires/${questionnaireId}/questions`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: 'Test Question for Response',
        type: 'single_choice',
        required: true,
        options: [
          { label: 'Option 1', value: '1', score: 1 },
          { label: 'Option 2', value: '2', score: 2 },
          { label: 'Option 3', value: '3', score: 3 }
        ]
      });

    questionId = questionResponse.body.question.id;
  });

  // After all tests, clean up
  afterAll(async () => {
    // Delete the test questionnaire
    await request(app)
      .delete(`/api/questionnaires/${questionnaireId}`)
      .set('Authorization', `Bearer ${authToken}`);

    await db.end();
  });

  // Test creating a response
  test('POST /api/responses - Create response', async () => {
    const response = await request(app)
      .post('/api/responses')
      .send({
        questionnaire_id: questionnaireId,
        patient_email: 'test@example.com',
        answers: [
          {
            question_id: questionId,
            value: '3'
          }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Response submitted successfully');
    expect(response.body.response).toHaveProperty('id');
    expect(response.body.unique_code).toBeDefined();
    expect(response.body.score).toBeDefined();
    expect(response.body.risk_level).toBeDefined();

    // Save response ID for later tests
    responseId = response.body.response.id;
  });

  // Test getting all responses
  test('GET /api/responses - Get all responses', async () => {
    const response = await request(app)
      .get('/api/responses')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.responses).toBeDefined();
    expect(Array.isArray(response.body.responses)).toBe(true);
  });

  // Test getting a response by ID
  test('GET /api/responses/:id - Get response by ID', async () => {
    const response = await request(app)
      .get(`/api/responses/${responseId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.response).toBeDefined();
    expect(response.body.response.id).toBe(responseId);
  });

  // Test getting a response with answers
  test('GET /api/responses/:id/answers - Get response with answers', async () => {
    const response = await request(app)
      .get(`/api/responses/${responseId}/answers`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.response).toBeDefined();
    expect(response.body.response.answers).toBeDefined();
    expect(Array.isArray(response.body.response.answers)).toBe(true);
    expect(response.body.response.answers.length).toBeGreaterThan(0);
  });

  // Test updating a response
  test('PUT /api/responses/:id - Update response', async () => {
    const response = await request(app)
      .put(`/api/responses/${responseId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        patient_email: 'updated@example.com',
        flagged_for_review: true
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Response updated successfully');
    expect(response.body.response.patient_email).toBe('updated@example.com');
    expect(response.body.response.flagged_for_review).toBe(true);
  });

  // Test flagging a response for review
  test('PUT /api/responses/:id/flag - Flag response for review', async () => {
    const response = await request(app)
      .put(`/api/responses/${responseId}/flag`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        flagged: true
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Response flagged successfully');
    expect(response.body.response.flagged_for_review).toBe(true);
  });

  // Test getting response recipients
  test('POST /api/responses/recipients - Get response recipients', async () => {
    const response = await request(app)
      .post('/api/responses/recipients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        response_ids: [responseId]
      });

    expect(response.status).toBe(200);
    expect(response.body.recipients).toBeDefined();
    expect(Array.isArray(response.body.recipients)).toBe(true);
  });

  // Test deleting a response
  test('DELETE /api/responses/:id - Delete response', async () => {
    const response = await request(app)
      .delete(`/api/responses/${responseId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Response deleted successfully');
  });
});
