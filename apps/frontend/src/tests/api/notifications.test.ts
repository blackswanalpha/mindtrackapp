/**
 * Notifications API Tests
 */
import { apiTest, loginForTest, setAuthToken } from '../utils/api-test-utils';
import { testUsers, testNotificationTemplates } from '../fixtures/test-data';

describe('Notifications API', () => {
  let adminToken: string;
  let templateId: number;

  // Login as admin before tests
  beforeAll(async () => {
    adminToken = await loginForTest(testUsers.admin.email, testUsers.admin.password);
  });

  // Reset auth token before each test
  beforeEach(() => {
    setAuthToken(adminToken);
  });

  describe('GET /notifications/templates', () => {
    it('should return a list of notification templates', async () => {
      const response = await apiTest.get('/notifications/templates');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check template structure if any exist
      if (response.data.length > 0) {
        const template = response.data[0];
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('subject');
        expect(template).toHaveProperty('body');
        expect(template).toHaveProperty('type');
      }
    });

    it('should filter templates by type', async () => {
      // First create a template with a specific type
      await apiTest.post('/notifications/templates', {
        ...testNotificationTemplates.welcome,
        name: `Welcome Template ${Date.now()}`,
        type: 'welcome'
      });
      
      const response = await apiTest.get('/notifications/templates?type=welcome');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned templates should have welcome type
      response.data.forEach(t => {
        expect(t.type).toBe('welcome');
      });
    });

    it('should filter templates by active status', async () => {
      const response = await apiTest.get('/notifications/templates?is_active=true');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned templates should be active
      response.data.forEach(t => {
        expect(t.is_active).toBe(true);
      });
    });
  });

  describe('POST /notifications/templates', () => {
    it('should create a new notification template', async () => {
      const newTemplate = {
        ...testNotificationTemplates.welcome,
        name: `Welcome Template ${Date.now()}`
      };

      const response = await apiTest.post('/notifications/templates', newTemplate);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newTemplate.name);
      expect(response.data.subject).toBe(newTemplate.subject);
      expect(response.data.body).toBe(newTemplate.body);
      expect(response.data.type).toBe(newTemplate.type);
      expect(response.data.is_active).toBe(newTemplate.is_active);

      // Save template ID for later tests
      templateId = response.data.id;
    });

    it('should return 400 when creating template with invalid data', async () => {
      try {
        await apiTest.post('/notifications/templates', {
          // Missing required name
          subject: 'Test Subject',
          body: 'Test body',
          type: 'welcome'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /notifications/templates/:id', () => {
    it('should return a specific notification template', async () => {
      const response = await apiTest.get(`/notifications/templates/${templateId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(templateId);
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('subject');
      expect(response.data).toHaveProperty('body');
      expect(response.data).toHaveProperty('type');
    });

    it('should return 404 for non-existent template', async () => {
      try {
        await apiTest.get('/notifications/templates/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /notifications/templates/:id', () => {
    it('should update a notification template', async () => {
      const updatedData = {
        ...testNotificationTemplates.update,
        name: `Updated Template ${Date.now()}`
      };

      const response = await apiTest.put(`/notifications/templates/${templateId}`, updatedData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(templateId);
      expect(response.data.name).toBe(updatedData.name);
      expect(response.data.subject).toBe(updatedData.subject);
      expect(response.data.body).toBe(updatedData.body);
      expect(response.data.type).toBe(updatedData.type);
      expect(response.data.is_active).toBe(updatedData.is_active);
    });

    it('should return 400 when updating with invalid data', async () => {
      try {
        await apiTest.put(`/notifications/templates/${templateId}`, {
          name: '' // Empty name is invalid
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should return 404 for non-existent template', async () => {
      try {
        await apiTest.put('/notifications/templates/9999999', {
          name: 'Updated Template'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PATCH /notifications/templates/:id/status', () => {
    it('should update template status', async () => {
      const newStatus = false;
      
      const response = await apiTest.patch(`/notifications/templates/${templateId}/status`, {
        is_active: newStatus
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(templateId);
      expect(response.data).toHaveProperty('is_active');
      expect(response.data.is_active).toBe(newStatus);
    });
  });

  describe('POST /notifications/send', () => {
    it('should send a notification', async () => {
      const notificationData = {
        template_id: templateId,
        recipient: 'recipient@example.com',
        data: {
          name: 'Test Recipient',
          questionnaire_title: 'Test Questionnaire',
          score: 10
        }
      };

      const response = await apiTest.post('/notifications/send', notificationData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('notification_id');
    });

    it('should return 400 when sending with invalid data', async () => {
      try {
        await apiTest.post('/notifications/send', {
          // Missing required template_id
          recipient: 'recipient@example.com'
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /notifications/logs', () => {
    it('should return notification logs', async () => {
      const response = await apiTest.get('/notifications/logs');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Check log structure if any exist
      if (response.data.length > 0) {
        const log = response.data[0];
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('template_id');
        expect(log).toHaveProperty('recipient');
        expect(log).toHaveProperty('status');
        expect(log).toHaveProperty('sent_at');
      }
    });

    it('should filter logs by status', async () => {
      const response = await apiTest.get('/notifications/logs?status=sent');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned logs should have sent status
      response.data.forEach(log => {
        expect(log.status).toBe('sent');
      });
    });
  });

  describe('DELETE /notifications/templates/:id', () => {
    it('should delete a notification template', async () => {
      const response = await apiTest.delete(`/notifications/templates/${templateId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent template', async () => {
      try {
        await apiTest.delete('/notifications/templates/9999999');
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
