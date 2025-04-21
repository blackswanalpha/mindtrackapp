/**
 * QR Code API tests
 */

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('QR Code API', () => {
  let authToken;
  let questionnaireId;

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
        title: 'Test QR Code Questionnaire',
        description: 'This is a test questionnaire for QR code tests',
        type: 'standard',
        is_active: true,
        is_qr_enabled: true,
        allow_anonymous: true
      });

    questionnaireId = questionnaireResponse.body.questionnaire.id;
  });

  // After all tests, clean up
  afterAll(async () => {
    // Delete the test questionnaire
    await request(app)
      .delete(`/api/questionnaires/${questionnaireId}`)
      .set('Authorization', `Bearer ${authToken}`);

    await db.end();
  });

  // Test generating a QR code for a questionnaire
  test('GET /api/qr-codes/questionnaires/:id - Generate QR code for questionnaire', async () => {
    const response = await request(app)
      .get(`/api/qr-codes/questionnaires/${questionnaireId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('QR code generated successfully');
    expect(response.body.qrCode).toBeDefined();
    expect(response.body.url).toBeDefined();
  });

  // Test generating a QR code with a specific style
  test('GET /api/qr-codes/questionnaires/:id?style=modern - Generate QR code with style', async () => {
    const response = await request(app)
      .get(`/api/qr-codes/questionnaires/${questionnaireId}?style=modern`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('QR code generated successfully');
    expect(response.body.qrCode).toBeDefined();
    expect(response.body.style).toBe('modern');
  });

  // Test generating a QR code with SVG format
  test('GET /api/qr-codes/questionnaires/:id?format=svg - Generate QR code with SVG format', async () => {
    const response = await request(app)
      .get(`/api/qr-codes/questionnaires/${questionnaireId}?format=svg`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('QR code generated successfully');
    expect(response.body.qrCode).toBeDefined();
    expect(response.body.svg).toBeDefined();
  });

  // Test downloading a QR code for a questionnaire
  test('GET /api/qr-codes/questionnaires/:id/download - Download QR code for questionnaire', async () => {
    const response = await request(app)
      .get(`/api/qr-codes/questionnaires/${questionnaireId}/download`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('image/png');
    expect(response.headers['content-disposition']).toContain(`questionnaire-${questionnaireId}-qr.png`);
  });

  // Test downloading a QR code as SVG
  test('GET /api/qr-codes/questionnaires/:id/svg - Download QR code as SVG', async () => {
    const response = await request(app)
      .get(`/api/qr-codes/questionnaires/${questionnaireId}/svg`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('image/svg+xml');
    expect(response.headers['content-disposition']).toContain(`questionnaire-${questionnaireId}-qr.svg`);
  });

  // Test generating a random style QR code
  test('POST /api/qr-codes/random - Generate random style QR code', async () => {
    const response = await request(app)
      .post('/api/qr-codes/random')
      .send({
        url: 'https://example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Random style QR code generated successfully');
    expect(response.body.dataURL).toBeDefined();
    expect(response.body.svg).toBeDefined();
    expect(response.body.style).toBeDefined();
  });
});
