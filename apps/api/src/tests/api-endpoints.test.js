const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

// Mock JWT token for testing
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

// Test users
const adminUser = { id: 1, email: 'admin@example.com', role: 'admin' };
const providerUser = { id: 2, email: 'provider@example.com', role: 'healthcare_provider' };
const regularUser = { id: 3, email: 'user@example.com', role: 'user' };

// Generate tokens
const adminToken = generateToken(adminUser);
const providerToken = generateToken(providerUser);
const userToken = generateToken(regularUser);

describe('API Endpoints', () => {
  // Health check
  describe('GET /api/v1/health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  // Scoring endpoints
  describe('Scoring Endpoints', () => {
    let scoringConfigId;

    // Create scoring config
    it('should create a new scoring config', async () => {
      const res = await request(app)
        .post('/api/v1/scoring/configs')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          questionnaire_id: 1,
          name: 'Test Scoring Config',
          scoring_method: 'sum',
          rules: { type: 'sum', max_score: 27 },
          max_score: 27,
          passing_score: 10
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      scoringConfigId = res.body.id;
    });

    // Get scoring config by ID
    it('should get a scoring config by ID', async () => {
      if (!scoringConfigId) {
        console.log('Skipping test: No scoring config ID available');
        return;
      }

      const res = await request(app)
        .get(`/api/v1/scoring/configs/${scoringConfigId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', scoringConfigId);
    });

    // Get scoring configs for a questionnaire
    it('should get scoring configs for a questionnaire', async () => {
      const res = await request(app)
        .get('/api/v1/scoring/questionnaires/1/configs')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Calculate score for a response
    it('should calculate score for a response', async () => {
      const res = await request(app)
        .post('/api/v1/scoring/responses/1/calculate')
        .set('Authorization', `Bearer ${providerToken}`);

      // Even if the response doesn't exist, we should get a proper error
      expect([200, 404]).toContain(res.statusCode);
    });
  });

  // Notification endpoints
  describe('Notification Endpoints', () => {
    // Get user notifications
    it('should get notifications for current user', async () => {
      const res = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Get unread notifications
    it('should get unread notifications for current user', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/unread')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Create notification (admin only)
    it('should create a notification (admin only)', async () => {
      const res = await request(app)
        .post('/api/v1/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          user_id: 3,
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info'
        });

      expect(res.statusCode).toEqual(201);
    });

    // Regular user should not be able to create notifications
    it('should not allow regular users to create notifications', async () => {
      const res = await request(app)
        .post('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          user_id: 3,
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info'
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  // Statistics endpoints
  describe('Statistics Endpoints', () => {
    // Get questionnaire statistics
    it('should get statistics for a questionnaire', async () => {
      const res = await request(app)
        .get('/api/v1/statistics/questionnaires/1')
        .set('Authorization', `Bearer ${providerToken}`);

      // Even if the questionnaire doesn't exist, we should get a proper error
      expect([200, 404]).toContain(res.statusCode);
    });

    // Get system statistics (admin only)
    it('should get system statistics (admin only)', async () => {
      const res = await request(app)
        .get('/api/v1/statistics/system')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
    });

    // Regular user should not be able to access system statistics
    it('should not allow regular users to access system statistics', async () => {
      const res = await request(app)
        .get('/api/v1/statistics/system')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  // User metrics endpoints
  describe('User Metrics Endpoints', () => {
    // Get user metrics
    it('should get metrics for current user', async () => {
      const res = await request(app)
        .get('/api/v1/user-metrics')
        .set('Authorization', `Bearer ${userToken}`);

      // Even if no metrics exist yet, we should get a proper response
      expect([200, 404]).toContain(res.statusCode);
    });

    // Update last active timestamp
    it('should update last active timestamp', async () => {
      const res = await request(app)
        .put('/api/v1/user-metrics/last-active')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
    });

    // Get most active users (admin only)
    it('should get most active users (admin only)', async () => {
      const res = await request(app)
        .get('/api/v1/user-metrics/most-active')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Regular user should not be able to access most active users
    it('should not allow regular users to access most active users', async () => {
      const res = await request(app)
        .get('/api/v1/user-metrics/most-active')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });
});
