/**
 * Questionnaire API tests
 */

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Questionnaire API', () => {
  let authToken;
  let questionnaireId;

  // Before all tests, get auth token
  beforeAll(async () => {
    // Login as admin
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@mindtrack.com',
        password: 'admin123'
      });

    authToken = loginResponse.body.token;
  });

  // After all tests, close database connection
  afterAll(async () => {
    await db.end();
  });

  // Test creating a questionnaire
  test('POST /api/questionnaires - Create questionnaire', async () => {
    const response = await request(app)
      .post('/api/questionnaires')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Questionnaire',
        description: 'This is a test questionnaire',
        type: 'standard',
        is_active: true,
        is_qr_enabled: true,
        allow_anonymous: true
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Questionnaire created successfully');
    expect(response.body.questionnaire).toHaveProperty('id');
    expect(response.body.questionnaire.title).toBe('Test Questionnaire');
    expect(response.body.qrCode).toBeDefined();

    // Save questionnaire ID for later tests
    questionnaireId = response.body.questionnaire.id;
  });

  // Test getting all questionnaires
  test('GET /api/questionnaires - Get all questionnaires', async () => {
    const response = await request(app)
      .get('/api/questionnaires')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.questionnaires).toBeDefined();
    expect(Array.isArray(response.body.questionnaires)).toBe(true);
  });

  // Test getting a questionnaire by ID
  test('GET /api/questionnaires/:id - Get questionnaire by ID', async () => {
    const response = await request(app)
      .get(`/api/questionnaires/${questionnaireId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.questionnaire).toBeDefined();
    expect(response.body.questionnaire.id).toBe(questionnaireId);
    expect(response.body.questionnaire.title).toBe('Test Questionnaire');
  });

  // Test updating a questionnaire
  test('PUT /api/questionnaires/:id - Update questionnaire', async () => {
    const response = await request(app)
      .put(`/api/questionnaires/${questionnaireId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Test Questionnaire',
        description: 'This is an updated test questionnaire'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Questionnaire updated successfully');
    expect(response.body.questionnaire.title).toBe('Updated Test Questionnaire');
  });

  // Test adding a question to a questionnaire
  test('POST /api/questionnaires/:questionnaireId/questions - Add question to questionnaire', async () => {
    const response = await request(app)
      .post(`/api/questionnaires/${questionnaireId}/questions`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: 'Test Question',
        type: 'single_choice',
        required: true,
        options: [
          { label: 'Option 1', value: '1', score: 1 },
          { label: 'Option 2', value: '2', score: 2 },
          { label: 'Option 3', value: '3', score: 3 }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Question created successfully');
    expect(response.body.question).toHaveProperty('id');
    expect(response.body.question.text).toBe('Test Question');
  });

  // Test getting a questionnaire with questions
  test('GET /api/questionnaires/:id/questions - Get questionnaire with questions', async () => {
    const response = await request(app)
      .get(`/api/questionnaires/${questionnaireId}/questions`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.questionnaire).toBeDefined();
    expect(response.body.questions).toBeDefined();
    expect(Array.isArray(response.body.questions)).toBe(true);
    expect(response.body.questions.length).toBeGreaterThan(0);
  });

  // Test generating a QR code for a questionnaire
  test('GET /api/qr-codes/questionnaires/:id - Generate QR code for questionnaire', async () => {
    const response = await request(app)
      .get(`/api/qr-codes/questionnaires/${questionnaireId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('QR code generated successfully');
    expect(response.body.qrCode).toBeDefined();
    expect(response.body.url).toBeDefined();
  });

  // Test deleting a questionnaire
  test('DELETE /api/questionnaires/:id - Delete questionnaire', async () => {
    const response = await request(app)
      .delete(`/api/questionnaires/${questionnaireId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Questionnaire deleted successfully');
  });
});
