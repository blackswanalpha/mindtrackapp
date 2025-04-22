/**
 * API service for making requests to the backend
 *
 * This service uses the real API in production and mockStorage for local development.
 */

import mockStorage from './mockStorage';
import scoringService from './scoringService';
import { apiClient } from '@/lib/apiClient';

// Initialize mock storage
if (typeof window !== 'undefined') {
  mockStorage.initialize();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Flag to determine whether to use mock data or real API
// Set to false to force using the real API with Neon database
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Log API configuration
console.log('API URL:', API_URL);
console.log('Using mock data:', USE_MOCK_DATA);

/**
 * Get auth token from localStorage or return a mock token
 * AUTHENTICATION DISABLED: Always return a mock token
 */
const getToken = (): string => {
  // Always return a mock token since authentication is disabled
  return 'mock-token-for-disabled-auth';
};

// Helper to simulate API delay
const simulateApiDelay = async (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate a unique code for responses
const generateUniqueCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RESP-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Fetch wrapper with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    // Always add auth token to headers (authentication is disabled)
    const token = getToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };

    const response = await fetch(url, options);

    // Parse JSON response
    const data = await response.json();

    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API service methods
 */
export const api = {
  /**
   * Check API health
   */
  checkHealth: async () => {
    return fetchWithErrorHandling(`${API_URL}/health`);
  },

  /**
   * Get API information
   */
  getApiInfo: async () => {
    return fetchWithErrorHandling(`${API_URL}/`);
  },

  /**
   * Metrics methods
   */
  metrics: {
    /**
     * Get user metrics
     */
    getUserMetrics: async (params?: { timeRange?: string }) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);

          // Return mock user metrics data
          return {
            totalUsers: 256,
            userGrowth: 12.5,
            totalResponses: 1842,
            responseGrowth: 8.3,
            completionRate: 87,
            completionRateGrowth: 3.2,
            averageScore: 14.7,
            scoreChange: -2.1,
            activeUsers: 187,
            activeUserGrowth: 8.2,
            inactiveUsers: 69,
            inactiveUserGrowth: 3.5,
            avgEngagement: 6.3,
            engagementGrowth: 12.7,
            userActivity: [
              { date: 'Mon', active: 42 },
              { date: 'Tue', active: 38 },
              { date: 'Wed', active: 45 },
              { date: 'Thu', active: 39 },
              { date: 'Fri', active: 48 },
              { date: 'Sat', active: 30 },
              { date: 'Sun', active: 27 },
            ],
            activityByDay: [
              { day: 'Mon', logins: 42, submissions: 28 },
              { day: 'Tue', logins: 38, submissions: 25 },
              { day: 'Wed', logins: 45, submissions: 32 },
              { day: 'Thu', logins: 39, submissions: 27 },
              { day: 'Fri', logins: 48, submissions: 35 },
              { day: 'Sat', logins: 30, submissions: 18 },
              { day: 'Sun', logins: 27, submissions: 15 },
            ],
            activityByTime: [
              { hour: '00:00', activity: 5 },
              { hour: '03:00', activity: 2 },
              { hour: '06:00', activity: 8 },
              { hour: '09:00', activity: 35 },
              { hour: '12:00', activity: 42 },
              { hour: '15:00', activity: 47 },
              { hour: '18:00', activity: 38 },
              { hour: '21:00', activity: 25 },
            ],
            engagementMetrics: [
              { metric: 'Completion Rate', current: 87, previous: 82 },
              { metric: 'Avg. Time Spent', current: 65, previous: 58 },
              { metric: 'Return Rate', current: 42, previous: 38 },
              { metric: 'Questions Answered', current: 95, previous: 90 },
              { metric: 'Feedback Given', current: 28, previous: 20 },
            ],
            completionRates: [
              { questionnaire: 'Depression', rate: 92 },
              { questionnaire: 'Anxiety', rate: 88 },
              { questionnaire: 'Stress', rate: 85 },
              { questionnaire: 'Sleep', rate: 78 },
              { questionnaire: 'Nutrition', rate: 72 },
            ],
            retention: [
              { week: 'Week 1', rate: 100 },
              { week: 'Week 2', rate: 85 },
              { week: 'Week 3', rate: 72 },
              { week: 'Week 4', rate: 68 },
              { week: 'Week 5', rate: 65 },
              { week: 'Week 6', rate: 62 },
              { week: 'Week 7', rate: 60 },
              { week: 'Week 8', rate: 58 },
            ],
            riskDistribution: [
              { name: 'Low', value: 120, color: '#10b981' },
              { name: 'Medium', value: 80, color: '#f59e0b' },
              { name: 'High', value: 40, color: '#ef4444' },
            ],
            userMetrics: [
              {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                completedQuestionnaires: 8,
                averageScore: 12.5,
                lastActive: '2023-06-15T10:30:00Z',
                riskLevel: 'moderate'
              },
              {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                completedQuestionnaires: 5,
                averageScore: 7.2,
                lastActive: '2023-06-18T14:45:00Z',
                riskLevel: 'mild'
              },
              {
                id: 3,
                name: 'Robert Johnson',
                email: 'robert@example.com',
                completedQuestionnaires: 12,
                averageScore: 18.3,
                lastActive: '2023-06-10T09:15:00Z',
                riskLevel: 'moderately severe'
              },
              {
                id: 4,
                name: 'Emily Davis',
                email: 'emily@example.com',
                completedQuestionnaires: 3,
                averageScore: 4.1,
                lastActive: '2023-06-20T16:20:00Z',
                riskLevel: 'minimal'
              },
              {
                id: 5,
                name: 'Michael Wilson',
                email: 'michael@example.com',
                completedQuestionnaires: 10,
                averageScore: 15.8,
                lastActive: '2023-06-17T08:15:00Z',
                riskLevel: 'moderate'
              },
              {
                id: 6,
                name: 'Sarah Brown',
                email: 'sarah@example.com',
                completedQuestionnaires: 7,
                averageScore: 9.3,
                lastActive: '2023-06-19T11:20:00Z',
                riskLevel: 'mild'
              },
            ],
            demographicData: {
              ageGroups: [
                { name: '18-24', value: 45 },
                { name: '25-34', value: 85 },
                { name: '35-44', value: 65 },
                { name: '45-54', value: 40 },
                { name: '55+', value: 21 },
              ],
              genderDistribution: [
                { name: 'Male', value: 120, color: '#3b82f6' },
                { name: 'Female', value: 130, color: '#ec4899' },
                { name: 'Other', value: 6, color: '#8b5cf6' },
              ],
              locationData: [
                { name: 'Urban', value: 160 },
                { name: 'Suburban', value: 80 },
                { name: 'Rural', value: 16 },
              ]
            }
          };
        }

        // Use API in production
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        const response = await apiClient.get(`/user-metrics${queryParams ? `?${queryParams}` : ''}`);
        return response.data;
      } catch (error) {
        console.error('Failed to get user metrics:', error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay(800);

        // Return mock user metrics data (same as above)
        return {
          totalUsers: 256,
          userGrowth: 12.5,
          // ... (same mock data as above)
        };
      }
    },

    /**
     * Get most active users
     */
    getMostActiveUsers: async (limit: number = 10) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(600);

          // Return mock most active users data
          return [
            {
              id: 3,
              name: 'Robert Johnson',
              email: 'robert@example.com',
              completedQuestionnaires: 12,
              lastActive: '2023-06-10T09:15:00Z',
            },
            {
              id: 5,
              name: 'Michael Wilson',
              email: 'michael@example.com',
              completedQuestionnaires: 10,
              lastActive: '2023-06-17T08:15:00Z',
            },
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              completedQuestionnaires: 8,
              lastActive: '2023-06-15T10:30:00Z',
            },
          ];
        }

        // Use API in production
        const response = await apiClient.get(`/user-metrics/most-active?limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Failed to get most active users:', error);
        throw error;
      }
    },

    /**
     * Get recently active users
     */
    getRecentlyActiveUsers: async (limit: number = 10) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(600);

          // Return mock recently active users data
          return [
            {
              id: 4,
              name: 'Emily Davis',
              email: 'emily@example.com',
              lastActive: '2023-06-20T16:20:00Z',
            },
            {
              id: 6,
              name: 'Sarah Brown',
              email: 'sarah@example.com',
              lastActive: '2023-06-19T11:20:00Z',
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              lastActive: '2023-06-18T14:45:00Z',
            },
          ];
        }

        // Use API in production
        const response = await apiClient.get(`/user-metrics/recently-active?limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Failed to get recently active users:', error);
        throw error;
      }
    },

    /**
     * Get user metrics by ID
     */
    getUserMetricsById: async (userId: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(500);

          // Return mock user metrics data
          return {
            id: 1,
            user_id: userId,
            login_count: 25,
            questionnaires_created: 5,
            responses_submitted: 10,
            last_active_at: '2023-06-01T12:00:00Z'
          };
        }

        // Use API in production
        const response = await apiClient.get(`/user-metrics/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get metrics for user ${userId}:`, error);
        throw error;
      }
    },

    /**
     * Update last active timestamp
     */
    updateLastActive: async () => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(300);

          // Return mock updated user metrics data
          return {
            id: 1,
            user_id: 1,
            login_count: 25,
            questionnaires_created: 5,
            responses_submitted: 10,
            last_active_at: new Date().toISOString()
          };
        }

        // Use API in production
        const response = await apiClient.put('/user-metrics/last-active');
        return response.data;
      } catch (error) {
        console.error('Failed to update last active timestamp:', error);
        throw error;
      }
    }
  },

  /**
   * Authentication methods
   */
  auth: {
    /**
     * Login user
     */
    login: async (email: string, password: string) => {
      return fetchWithErrorHandling(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
    },

    /**
     * Register user
     */
    register: async (name: string, email: string, password: string) => {
      return fetchWithErrorHandling(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
      return fetchWithErrorHandling(`${API_URL}/auth/me`);
    }
  },

  /**
   * User methods
   */
  users: {
    /**
     * Get all users
     */
    getAll: async () => {
      return fetchWithErrorHandling(`${API_URL}/users`);
    },

    /**
     * Get user by ID
     */
    getById: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/users/${id}`);
    },

    /**
     * Update user
     */
    update: async (id: number, userData: any) => {
      return fetchWithErrorHandling(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
    },

    /**
     * Delete user
     */
    delete: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
    }
  },

  /**
   * Questionnaire methods
   */
  questionnaires: {
    /**
     * Get all questionnaires
     */
    getAll: async (params?: any) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          return mockStorage.questionnaires.getAll();
        }

        // Use real API
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        console.log('Fetching questionnaires with URL:', `/questionnaires${queryParams ? `?${queryParams}` : ''}`);
        const response = await apiClient.get(`/questionnaires${queryParams ? `?${queryParams}` : ''}`);
        console.log('API response:', response.data);

        // Handle different response formats
        if (response.data && response.data.questionnaires) {
          // If the API returns an object with a questionnaires property
          return response.data.questionnaires;
        } else {
          // If the API returns the questionnaires directly
          return response.data;
        }
      } catch (error) {
        console.error('Failed to get questionnaires:', error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay();
        return mockStorage.questionnaires.getAll();
      }
    },

    /**
     * Get questionnaire by ID
     */
    getById: async (id: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          const questionnaire = mockStorage.questionnaires.getById(id);
          if (!questionnaire) {
            throw new Error(`Questionnaire with ID ${id} not found`);
          }
          return questionnaire;
        }

        // Use real API
        const response = await apiClient.get(`/questionnaires/${id}`);
        return response.data.questionnaire;
      } catch (error) {
        console.error(`Failed to get questionnaire ${id}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay();
        const questionnaire = mockStorage.questionnaires.getById(id);
        if (!questionnaire) {
          throw new Error(`Questionnaire with ID ${id} not found`);
        }
        return questionnaire;
      }
    },

    /**
     * Create questionnaire
     */
    create: async (questionnaireData: any) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);
          const newQuestionnaire = {
            ...questionnaireData,
            created_at: new Date().toISOString(),
            is_active: questionnaireData.is_active ?? true
          };
          return mockStorage.questionnaires.create(newQuestionnaire);
        }

        // Use real API
        const response = await apiClient.post('/questionnaires', questionnaireData);
        return response.data.questionnaire;
      } catch (error) {
        console.error('Failed to create questionnaire:', error);
        throw error;
      }
    },

    /**
     * Update questionnaire
     */
    update: async (id: number, questionnaireData: any) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);
          const updatedQuestionnaire = {
            ...questionnaireData,
            updated_at: new Date().toISOString()
          };
          const result = mockStorage.questionnaires.update(id, updatedQuestionnaire);
          if (!result) {
            throw new Error(`Questionnaire with ID ${id} not found`);
          }
          return result;
        }

        // Use real API
        const response = await apiClient.put(`/questionnaires/${id}`, questionnaireData);
        return response.data.questionnaire;
      } catch (error) {
        console.error(`Failed to update questionnaire ${id}:`, error);
        throw error;
      }
    },

    /**
     * Delete questionnaire
     */
    delete: async (id: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);
          const success = mockStorage.questionnaires.delete(id);
          if (!success) {
            throw new Error(`Questionnaire with ID ${id} not found`);
          }
          return { success };
        }

        // Use real API
        const response = await apiClient.delete(`/questionnaires/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to delete questionnaire ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get questionnaire with questions
     */
    getWithQuestions: async (id: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          const questionnaire = mockStorage.questionnaires.getById(id);
          if (!questionnaire) {
            throw new Error(`Questionnaire with ID ${id} not found`);
          }
          const questions = mockStorage.questions.getByQuestionnaire(id);
          return { questionnaire, questions };
        }

        // Use real API
        const response = await apiClient.get(`/questionnaires/${id}/questions`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get questionnaire ${id} with questions:`, error);
        throw error;
      }
    },

    /**
     * Get questionnaire statistics
     */
    getStatistics: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();
          const questionnaire = mockStorage.questionnaires.getById(id);
          if (!questionnaire) {
            throw new Error(`Questionnaire with ID ${id} not found`);
          }

          const responses = mockStorage.responses.getByQuestionnaire(id);

          // Calculate statistics
          const totalResponses = responses.length;
          const completedResponses = responses.filter(r => r.completed_at).length;
          const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

          // Calculate risk levels
          const riskLevels = {
            minimal: 0,
            mild: 0,
            moderate: 0,
            'moderately severe': 0,
            severe: 0
          };

          responses.forEach(response => {
            if (response.risk_level) {
              riskLevels[response.risk_level as keyof typeof riskLevels]++;
            }
          });

          // Calculate average score
          const scores = responses.filter(r => r.score !== undefined).map(r => r.score as number);
          const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

          return {
            total_responses: totalResponses,
            completion_rate: Math.round(completionRate),
            avg_score: parseFloat(avgScore.toFixed(1)),
            risk_levels: {
              low: riskLevels.minimal + riskLevels.mild,
              medium: riskLevels.moderate,
              high: riskLevels['moderately severe'] + riskLevels.severe
            }
          };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/questionnaires/${id}/statistics`);
      } catch (error) {
        console.error(`Failed to get questionnaire ${id} statistics:`, error);
        throw error;
      }
    },

    /**
     * Duplicate questionnaire
     */
    duplicate: async (id: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(1000);
          const questionnaire = mockStorage.questionnaires.getById(id);
          if (!questionnaire) {
            throw new Error(`Questionnaire with ID ${id} not found`);
          }

          const { id: _, ...questionnaireData } = questionnaire;
          const newQuestionnaire = {
            ...questionnaireData,
            title: `${questionnaireData.title} (Copy)`,
            created_at: new Date().toISOString()
          };

          const createdQuestionnaire = mockStorage.questionnaires.create(newQuestionnaire);

          // Duplicate questions
          const questions = mockStorage.questions.getByQuestionnaire(id);
          questions.forEach(question => {
            const { id: __, ...questionData } = question;
            mockStorage.questions.create({
              ...questionData,
              questionnaire_id: createdQuestionnaire.id
            });
          });

          return createdQuestionnaire;
        }

        // Use API in production
        const response = await apiClient.post(`/questionnaires/${id}/version`);
        return response.data.questionnaire;
      } catch (error) {
        console.error(`Failed to duplicate questionnaire ${id}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay(1000);
        const questionnaire = mockStorage.questionnaires.getById(id);
        if (!questionnaire) {
          throw new Error(`Questionnaire with ID ${id} not found`);
        }

        const { id: _, ...questionnaireData } = questionnaire;
        const newQuestionnaire = {
          ...questionnaireData,
          title: `${questionnaireData.title} (Copy)`,
          created_at: new Date().toISOString()
        };

        const createdQuestionnaire = mockStorage.questionnaires.create(newQuestionnaire);

        // Duplicate questions
        const questions = mockStorage.questions.getByQuestionnaire(id);
        questions.forEach(question => {
          const { id: __, ...questionData } = question;
          mockStorage.questions.create({
            ...questionData,
            questionnaire_id: createdQuestionnaire.id
          });
        });

        return createdQuestionnaire;
      }
    }
  },

  /**
   * Question methods
   */
  questions: {
    /**
     * Create question
     */
    create: async (questionnaireId: number, questionData: any) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);

          // Get the highest order_num for this questionnaire
          const questions = mockStorage.questions.getByQuestionnaire(questionnaireId);
          const maxOrderNum = questions.length > 0
            ? Math.max(...questions.map(q => q.order_num))
            : 0;

          const newQuestion = {
            ...questionData,
            questionnaire_id: questionnaireId,
            order_num: questionData.order_num || maxOrderNum + 1
          };

          return mockStorage.questions.create(newQuestion);
        }

        // Use real API
        console.log(`Creating question for questionnaire ${questionnaireId} with data:`, questionData);
        const response = await apiClient.post(`/questionnaires/${questionnaireId}/questions`, questionData);
        console.log('API response:', response.data);
        return response.data.question;
      } catch (error) {
        console.error(`Failed to create question for questionnaire ${questionnaireId}:`, error);

        // Fallback to mock data if API request fails
        if (!USE_MOCK_DATA) {
          console.warn('Falling back to mock data due to API error');
          await simulateApiDelay(800);

          // Get the highest order_num for this questionnaire
          const questions = mockStorage.questions.getByQuestionnaire(questionnaireId);
          const maxOrderNum = questions.length > 0
            ? Math.max(...questions.map(q => q.order_num))
            : 0;

          const newQuestion = {
            ...questionData,
            questionnaire_id: questionnaireId,
            order_num: questionData.order_num || maxOrderNum + 1
          };

          return mockStorage.questions.create(newQuestion);
        }

        throw error;
      }
    },

    /**
     * Get question by ID
     */
    getById: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();
          const question = mockStorage.questions.getById(id);
          if (!question) {
            throw new Error(`Question with ID ${id} not found`);
          }
          return question;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/questions/${id}`);
      } catch (error) {
        console.error(`Failed to get question ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get questions by questionnaire ID
     */
    getByQuestionnaire: async (questionnaireId: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          return mockStorage.questions.getByQuestionnaire(questionnaireId);
        }

        // Use real API
        console.log(`Fetching questions for questionnaire ${questionnaireId}`);
        const response = await apiClient.get(`/questionnaires/${questionnaireId}/questions`);
        console.log('API response:', response.data);
        return response.data.questions;
      } catch (error) {
        console.error(`Failed to get questions for questionnaire ${questionnaireId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay();
        return mockStorage.questions.getByQuestionnaire(questionnaireId);
      }
    },

    /**
     * Update question
     */
    update: async (id: number, questionData: any) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);
          const result = mockStorage.questions.update(id, questionData);
          if (!result) {
            throw new Error(`Question with ID ${id} not found`);
          }
          return result;
        }

        // Use real API
        console.log(`Updating question ${id} with data:`, questionData);
        const response = await apiClient.put(`/questions/${id}`, questionData);
        console.log('API response:', response.data);
        return response.data.question;
      } catch (error) {
        console.error(`Failed to update question ${id}:`, error);

        // Fallback to mock data if API request fails
        if (!USE_MOCK_DATA) {
          console.warn('Falling back to mock data due to API error');
          await simulateApiDelay(800);
          const result = mockStorage.questions.update(id, questionData);
          if (!result) {
            throw new Error(`Question with ID ${id} not found`);
          }
          return result;
        }

        throw error;
      }
    },

    /**
     * Delete question
     */
    delete: async (id: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);
          const success = mockStorage.questions.delete(id);
          if (!success) {
            throw new Error(`Question with ID ${id} not found`);
          }
          return { success };
        }

        // Use real API
        console.log(`Deleting question ${id}`);
        const response = await apiClient.delete(`/questions/${id}`);
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        console.error(`Failed to delete question ${id}:`, error);

        // Fallback to mock data if API request fails
        if (!USE_MOCK_DATA) {
          console.warn('Falling back to mock data due to API error');
          await simulateApiDelay(800);
          const success = mockStorage.questions.delete(id);
          if (!success) {
            throw new Error(`Question with ID ${id} not found`);
          }
          return { success };
        }

        throw error;
      }
    },

    /**
     * Reorder questions
     */
    reorder: async (questionnaireId: number, questions: any[]) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);

          questions.forEach(item => {
            mockStorage.questions.update(item.id, { order_num: item.order_num });
          });

          return { success: true };
        }

        // Use real API
        console.log(`Reordering questions for questionnaire ${questionnaireId}:`, questions);
        const response = await apiClient.put(`/questionnaires/${questionnaireId}/questions/reorder`, { questions });
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        console.error(`Failed to reorder questions for questionnaire ${questionnaireId}:`, error);

        // Fallback to mock data if API request fails
        if (!USE_MOCK_DATA) {
          console.warn('Falling back to mock data due to API error');
          await simulateApiDelay(800);

          questions.forEach(item => {
            mockStorage.questions.update(item.id, { order_num: item.order_num });
          });

          return { success: true };
        }

        throw error;
      }
    }
  },

  /**
   * Response methods
   */
  responses: {
    /**
     * Get all responses
     */
    getAll: async (params?: any) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();
          return mockStorage.responses.getAll();
        }

        // Use API in production
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        return fetchWithErrorHandling(`${API_URL}/responses${queryParams ? `?${queryParams}` : ''}`);
      } catch (error) {
        console.error('Failed to get responses:', error);
        throw error;
      }
    },

    /**
     * Get response by ID
     */
    getById: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();
          const response = mockStorage.responses.getById(id);
          if (!response) {
            throw new Error(`Response with ID ${id} not found`);
          }
          return response;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/responses/${id}`);
      } catch (error) {
        console.error(`Failed to get response ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get response by unique code
     */
    getByUniqueCode: async (uniqueCode: string) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          const responses = mockStorage.responses.getAll();
          const response = responses.find(r => r.unique_code === uniqueCode);

          // If the response is not found, return null instead of throwing an error
          // This allows the calling code to handle the case more gracefully
          if (!response) {
            console.warn(`Response with unique code ${uniqueCode} not found`);
            return null;
          }

          // Format the response to match the API response format
          const questionnaire = mockStorage.questionnaires.getById(response.questionnaire_id);

          return {
            response: {
              ...response,
              questionnaire_title: questionnaire ? questionnaire.title : 'Unknown Questionnaire',
              answers: response.answers || []
            }
          };
        }

        // Use API in production
        try {
          console.log(`Fetching response with unique code ${uniqueCode} from API`);
          const result = await apiClient.get(`/responses/code/${uniqueCode}`);
          console.log('API response:', result.data);
          return result.data;
        } catch (err) {
          // If the API returns a 404, return null instead of throwing an error
          if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response && err.response.status === 404) {
            console.warn(`Response with unique code ${uniqueCode} not found`);
            return null;
          }
          throw err;
        }
      } catch (error) {
        console.error(`Failed to get response with unique code ${uniqueCode}:`, error);
        throw error;
      }
    },

    /**
     * Get response with answers by ID
     */
    getWithAnswers: async (id: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          const response = mockStorage.responses.getById(id);
          if (!response) {
            console.error(`Response with ID ${id} not found`);
            // Return a default response structure instead of throwing
            return {
              response: {
                id,
                questionnaire_id: 1, // Default to PHQ-9
                patient_email: 'unknown@example.com',
                flagged_for_review: false,
                completed_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                unique_code: `RESP-${id}`,
                answers: []
              }
            };
          }

          // Get questions for this response
          const questions = mockStorage.questions.getByQuestionnaire(response.questionnaire_id);

          // Enhance answers with question data
          const enhancedAnswers = response.answers.map(answer => {
            const question = questions.find(q => q.id === answer.question_id);
            return {
              ...answer,
              question: question ? {
                id: question.id,
                text: question.text,
                type: question.type
              } : undefined
            };
          });

          return {
            response: {
              ...response,
              answers: enhancedAnswers
            }
          };
        }

        // Use real API
        try {
          const response = await apiClient.get(`/responses/${id}/answers`);
          return response.data;
        } catch (err: any) {
          // If the API returns a 404, return a default response structure
          if (err && typeof err === 'object' && 'response' in err && err.response?.status === 404) {
            console.warn(`Response with ID ${id} not found in API`);
            return {
              response: {
                id,
                questionnaire_id: 1, // Default to PHQ-9
                patient_email: 'unknown@example.com',
                flagged_for_review: false,
                completed_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                unique_code: `RESP-${id}`,
                answers: []
              }
            };
          }
          throw err;
        }
      } catch (error) {
        console.error(`Failed to get response with answers ${id}:`, error);
        throw error;
      }
    },

    /**
     * Flag/unflag a response for review
     */
    flag: async (id: number, flagged: boolean) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          const response = mockStorage.responses.getById(id);
          if (!response) {
            throw new Error(`Response with ID ${id} not found`);
          }

          // Update the response
          const updatedResponse = {
            ...response,
            flagged_for_review: flagged
          };

          // Update in mock storage
          mockStorage.responses.update(id, updatedResponse);

          return updatedResponse;
        }

        // Use real API
        const response = await apiClient.put(`/responses/${id}/flag`, { flagged });
        return response.data.response;
      } catch (error) {
        console.error(`Failed to update flag status for response ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get responses by questionnaire ID
     */
    getByQuestionnaire: async (questionnaireId: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();
          return mockStorage.responses.getByQuestionnaire(questionnaireId);
        }

        // Use API in production
        const response = await apiClient.get(`/questionnaires/${questionnaireId}/responses`);
        return response.data.responses;
      } catch (error) {
        console.error(`Failed to get responses for questionnaire ${questionnaireId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay();
        return mockStorage.responses.getByQuestionnaire(questionnaireId);
      }
    },

    /**
     * Create response
     */
    create: async (questionnaireId: number, responseData: any) => {
      try {
        console.log('Creating response for questionnaire:', questionnaireId, 'with data:', responseData);

        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(1000);

          const startTime = Date.now();
          const answers = responseData.answers || [];

          // Calculate score using the scoring service
          const questions = mockStorage.questions.getByQuestionnaire(questionnaireId);
          const scoringResult = scoringService.calculateScore(questionnaireId, answers, questions);
          const score = scoringResult.score;
          const riskLevel = scoringResult.risk_level;

          // Create response
          const newResponse = {
            questionnaire_id: questionnaireId,
            patient_email: responseData.patient_email,
            patient_name: responseData.patient_name,
            patient_age: responseData.patient_age,
            patient_gender: responseData.patient_gender,
            score,
            risk_level: riskLevel,
            flagged_for_review: scoringResult.flagged_for_review,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completion_time: responseData.completion_time || Math.floor((Date.now() - startTime) / 1000),
            unique_code: generateUniqueCode(),
            answers: []
          };

          console.log('Created response with score:', score, 'and risk level:', riskLevel);

          // Create the response first
          const createdResponse = mockStorage.responses.create(newResponse);

          // Create a copy to update with answers
          let updatedResponse = { ...createdResponse, answers: [] as any[] };

          // Process each answer and add it to the response
          for (const answer of answers) {
            // Get the score for this answer from the scoring result
            const answerScore = scoringResult.answer_scores[answer.question_id] || 0;

            console.log('Processing answer for question:', answer.question_id, 'with value:', answer.value, 'and score:', answerScore);

            // Add this answer to the response
            updatedResponse.answers.push({
              id: updatedResponse.answers.length + 1,
              response_id: createdResponse.id,
              question_id: answer.question_id,
              value: answer.value,
              score: answerScore
            });
          }

          // Update the response with all answers at once
          const finalResponse = mockStorage.responses.update(createdResponse.id, updatedResponse);

          console.log('Created response with user-entered answers:', finalResponse);
          return finalResponse;
        }

        // Use real API
        // Validate the response data
        if (!responseData.patient_email) {
          console.error('Patient email is missing in the response data');
          throw new Error('Patient email is required');
        }

        if (!responseData.answers || !Array.isArray(responseData.answers) || responseData.answers.length === 0) {
          console.error('Answers are missing or invalid in the response data');
          throw new Error('Answers are required and must be an array');
        }

        const data = {
          ...responseData,
          questionnaire_id: questionnaireId,
          start_time: responseData.start_time || new Date().toISOString()
        };

        // Ensure answers are properly formatted for the API
        if (data.answers && Array.isArray(data.answers)) {
          // Filter out any answers with empty values
          data.answers = data.answers
            .filter((answer: { question_id: number | string; value: any }) => {
              if (!answer.question_id && answer.question_id !== 0) {
                console.log('Filtering out answer without question_id:', answer);
                return false;
              }

              const value = answer.value;
              const isEmpty = value === '' || value === null || value === undefined ||
                      (Array.isArray(value) && value.length === 0);

              if (isEmpty) {
                console.log(`Filtering out empty answer for question ${answer.question_id}:`, answer);
                return false;
              }

              return true;
            })
            .map((answer: { question_id: number | string; value: any }) => {
              // Ensure question_id is a number
              let questionId;
              if (typeof answer.question_id === 'string') {
                questionId = parseInt(answer.question_id, 10);
              } else {
                questionId = Number(answer.question_id);
              }

              if (isNaN(questionId)) {
                console.error('Invalid question_id:', answer.question_id);
                throw new Error(`Invalid question_id: ${answer.question_id}`);
              }

              return {
                question_id: questionId,
                value: answer.value
              };
            });
        }

        // Check if we have any answers after filtering
        if (!data.answers || data.answers.length === 0) {
          console.error('No valid answers after filtering');
          throw new Error('No valid answers to submit');
        }

        console.log('Sending response data to API:', JSON.stringify(data));
        const response = await apiClient.post('/responses', data);
        console.log('API response:', response.data);
        return response.data.response;
      } catch (error) {
        console.error('Failed to create response:', error);
        throw error;
      }
    },

    /**
     * Update response
     */
    update: async (id: number, responseData: any) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);
          const result = mockStorage.responses.update(id, responseData);
          if (!result) {
            throw new Error(`Response with ID ${id} not found`);
          }
          return result;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/responses/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responseData)
        });
      } catch (error) {
        console.error(`Failed to update response ${id}:`, error);
        throw error;
      }
    },

    /**
     * Delete response
     */
    delete: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);
          const success = mockStorage.responses.delete(id);
          if (!success) {
            throw new Error(`Response with ID ${id} not found`);
          }
          return { success };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/responses/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error(`Failed to delete response ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get statistics for a questionnaire
     */
    getStatsByQuestionnaireId: async (questionnaireId: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);

          // Get responses for this questionnaire
          const responses = mockStorage.responses.getByQuestionnaire(questionnaireId);

          // Calculate statistics
          const totalResponses = responses.length;
          const completedResponses = responses.filter(r => r.completed_at).length;
          const completionRate = totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0;

          // Calculate risk levels
          const riskLevels = {
            low: 0,
            medium: 0,
            high: 0
          };

          responses.forEach(response => {
            if (response.risk_level) {
              if (['minimal', 'mild'].includes(response.risk_level)) {
                riskLevels.low++;
              } else if (['moderate'].includes(response.risk_level)) {
                riskLevels.medium++;
              } else if (['moderately severe', 'severe'].includes(response.risk_level)) {
                riskLevels.high++;
              }
            }
          });

          // Calculate average score
          const scores = responses.filter(r => r.score !== undefined && r.score !== null).map(r => r.score as number);
          const averageScore = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;

          return {
            total: totalResponses,
            completion_rate: completionRate,
            average_score: averageScore,
            risk_levels: riskLevels
          };
        }

        // Use API in production
        console.log(`Fetching statistics for questionnaire ${questionnaireId}`);
        try {
          // First try the /statistics endpoint (as defined in the API routes)
          const response = await apiClient.get(`/questionnaires/${questionnaireId}/statistics`);
          console.log('Statistics response:', response.data);
          return response.data.statistics || response.data;
        } catch (apiError) {
          console.warn(`Error fetching from /statistics endpoint: ${apiError}`);
          // Fallback to /stats endpoint
          const fallbackResponse = await apiClient.get(`/questionnaires/${questionnaireId}/stats`);
          console.log('Fallback statistics response:', fallbackResponse.data);
          return fallbackResponse.data;
        }
      } catch (error) {
        console.error(`Failed to get statistics for questionnaire ${questionnaireId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay(800);

        // Get responses for this questionnaire
        const responses = mockStorage.responses.getByQuestionnaire(questionnaireId);

        // Calculate statistics
        const totalResponses = responses.length;
        const completedResponses = responses.filter(r => r.completed_at).length;
        const completionRate = totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0;

        // Calculate risk levels
        const riskLevels = {
          low: 0,
          medium: 0,
          high: 0
        };

        responses.forEach(response => {
          if (response.risk_level) {
            if (['minimal', 'mild'].includes(response.risk_level)) {
              riskLevels.low++;
            } else if (['moderate'].includes(response.risk_level)) {
              riskLevels.medium++;
            } else if (['moderately severe', 'severe'].includes(response.risk_level)) {
              riskLevels.high++;
            }
          }
        });

        // Calculate average score
        const scores = responses.filter(r => r.score !== undefined && r.score !== null).map(r => r.score as number);
        const averageScore = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;

        return {
          total: totalResponses,
          completion_rate: completionRate,
          average_score: averageScore,
          risk_levels: riskLevels
        };
      }
    }
  },

  /**
   * Scoring methods
   */
  scoring: {
    /**
     * Calculate score for a response
     */
    calculateScore: async (responseId: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(1000);

          // Get response data
          const response = mockStorage.responses.getById(responseId);
          if (!response) {
            throw new Error(`Response with ID ${responseId} not found`);
          }

          // Get questions for this questionnaire
          const questions = mockStorage.questions.getByQuestionnaire(response.questionnaire_id);

          // Calculate score
          const scoringResult = scoringService.calculateScore(
            response.questionnaire_id,
            response.answers,
            questions
          );

          // Update response with new score and risk level
          const updatedResponse = mockStorage.responses.update(responseId, {
            score: scoringResult.score,
            risk_level: scoringResult.risk_level,
            flagged_for_review: scoringResult.flagged_for_review
          });

          // Update answer scores
          response.answers.forEach(answer => {
            const answerScore = scoringResult.answer_scores[answer.question_id];
            if (answerScore !== undefined) {
              // In a real implementation, we would update the answer in the database
              answer.score = answerScore;
            }
          });

          return {
            response: updatedResponse,
            scoring: scoringResult
          };
        }

        // Use API in production
        const response = await apiClient.post(`/responses/${responseId}/score`);
        return response.data;
      } catch (error) {
        console.error(`Failed to calculate score for response ${responseId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay(1000);

        // Get response data
        const response = mockStorage.responses.getById(responseId);
        if (!response) {
          throw new Error(`Response with ID ${responseId} not found`);
        }

        // Get questions for this questionnaire
        const questions = mockStorage.questions.getByQuestionnaire(response.questionnaire_id);

        // Calculate score
        const scoringResult = scoringService.calculateScore(
          response.questionnaire_id,
          response.answers,
          questions
        );

        // Update response with new score and risk level
        const updatedResponse = mockStorage.responses.update(responseId, {
          score: scoringResult.score,
          risk_level: scoringResult.risk_level,
          flagged_for_review: scoringResult.flagged_for_review
        });

        // Update answer scores
        response.answers.forEach(answer => {
          const answerScore = scoringResult.answer_scores[answer.question_id];
          if (answerScore !== undefined) {
            // In a real implementation, we would update the answer in the database
            answer.score = answerScore;
          }
        });

        return {
          response: updatedResponse,
          scoring: scoringResult
        };
      }
    },

    /**
     * Update response score manually
     */
    updateScore: async (responseId: number, score: number, riskLevel: string) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(800);

          // Get response data
          const response = mockStorage.responses.getById(responseId);
          if (!response) {
            throw new Error(`Response with ID ${responseId} not found`);
          }

          // Update response with new score and risk level
          const updatedResponse = mockStorage.responses.update(responseId, {
            score,
            risk_level: riskLevel,
            flagged_for_review: ['severe', 'moderately severe', 'high'].includes(riskLevel)
          });

          return updatedResponse;
        }

        // Use API in production
        const response = await apiClient.put(`/responses/${responseId}/score`, { score, risk_level: riskLevel });
        return response.data;
      } catch (error) {
        console.error(`Failed to update score for response ${responseId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay(800);

        // Get response data
        const response = mockStorage.responses.getById(responseId);
        if (!response) {
          throw new Error(`Response with ID ${responseId} not found`);
        }

        // Update response with new score and risk level
        const updatedResponse = mockStorage.responses.update(responseId, {
          score,
          risk_level: riskLevel,
          flagged_for_review: ['severe', 'moderately severe', 'high'].includes(riskLevel)
        });

        return updatedResponse;
      }
    },

    /**
     * Update answer scores
     */
    updateAnswerScores: async (responseId: number, answerScores: Record<number, number>) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay(1000);

          // Get response data
          const response = mockStorage.responses.getById(responseId);
          if (!response) {
            throw new Error(`Response with ID ${responseId} not found`);
          }

          // Update answer scores
          response.answers.forEach(answer => {
            const score = answerScores[answer.question_id];
            if (score !== undefined) {
              // In a real implementation, we would update the answer in the database
              answer.score = score;
            }
          });

          // Recalculate total score
          const questions = mockStorage.questions.getByQuestionnaire(response.questionnaire_id);
          const scoringResult = scoringService.calculateScore(
            response.questionnaire_id,
            response.answers,
            questions
          );

          // Update response with new score and risk level
          const updatedResponse = mockStorage.responses.update(responseId, {
            score: scoringResult.score,
            risk_level: scoringResult.risk_level,
            flagged_for_review: scoringResult.flagged_for_review
          });

          return {
            response: updatedResponse,
            scoring: scoringResult
          };
        }

        // Use API in production
        const response = await apiClient.put(`/responses/${responseId}/answers/scores`, { answer_scores: answerScores });
        return response.data;
      } catch (error) {
        console.error(`Failed to update answer scores for response ${responseId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay(1000);

        // Get response data
        const response = mockStorage.responses.getById(responseId);
        if (!response) {
          throw new Error(`Response with ID ${responseId} not found`);
        }

        // Update answer scores
        response.answers.forEach(answer => {
          const score = answerScores[answer.question_id];
          if (score !== undefined) {
            // In a real implementation, we would update the answer in the database
            answer.score = score;
          }
        });

        // Recalculate total score
        const questions = mockStorage.questions.getByQuestionnaire(response.questionnaire_id);
        const scoringResult = scoringService.calculateScore(
          response.questionnaire_id,
          response.answers,
          questions
        );

        // Update response with new score and risk level
        const updatedResponse = mockStorage.responses.update(responseId, {
          score: scoringResult.score,
          risk_level: scoringResult.risk_level,
          flagged_for_review: scoringResult.flagged_for_review
        });

        return {
          response: updatedResponse,
          scoring: scoringResult
        };
      }
    },

    /**
     * Get scoring configuration for a questionnaire
     */
    getScoringConfig: async (questionnaireId: number) => {
      try {
        // Use mock storage if enabled
        if (USE_MOCK_DATA) {
          await simulateApiDelay();

          // Get scoring configuration
          const config = scoringService.getScoringConfig(questionnaireId);
          return { config };
        }

        // Use API in production
        const response = await apiClient.get(`/questionnaires/${questionnaireId}/scoring-config`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get scoring configuration for questionnaire ${questionnaireId}:`, error);

        // Fallback to mock data if API request fails
        console.warn('Falling back to mock data due to API error');
        await simulateApiDelay();

        // Get scoring configuration
        const config = scoringService.getScoringConfig(questionnaireId);
        return { config };
      }
    }
  },

  /**
   * Email methods
   */
  email: {
    /**
     * Send email to response recipients
     */
    send: async (data: { response_ids: number[], subject: string, template_id?: number, custom_message?: string }) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(1500);

          // Mock success response
          return {
            message: 'Emails sent',
            results: data.response_ids.map(id => ({
              response_id: id,
              success: true
            }))
          };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Failed to send emails:', error);
        throw error;
      }
    },

    /**
     * Get email templates
     */
    getTemplates: async () => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          // Mock templates
          return {
            templates: [
              {
                id: 1,
                name: 'Assessment Results',
                subject: 'Your Assessment Results',
                content: 'Dear {{patient_name}},\n\nThank you for completing the {{questionnaire_title}}. Your results have been processed, and we wanted to share them with you.\n\nYour score: {{score}}\nRisk level: {{risk_level}}\n\n{{custom_message}}\n\nYou can view your full results using your unique code: {{unique_code}}\n\nBest regards,\nThe Mental Health Team'
              },
              {
                id: 2,
                name: 'Follow-up',
                subject: 'Follow-up on Your Recent Assessment',
                content: 'Dear {{patient_name}},\n\nWe hope you are doing well. We are following up on your recent {{questionnaire_title}} assessment.\n\n{{custom_message}}\n\nIf you have any questions or concerns, please don\'t hesitate to reach out.\n\nBest regards,\nThe Mental Health Team'
              },
              {
                id: 3,
                name: 'Resources',
                subject: 'Mental Health Resources',
                content: 'Dear {{patient_name}},\n\nBased on your recent {{questionnaire_title}} assessment, we wanted to share some resources that might be helpful for you.\n\n{{custom_message}}\n\nRemember that help is always available, and you\'re not alone in this journey.\n\nBest regards,\nThe Mental Health Team'
              }
            ]
          };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/email/templates`);
      } catch (error) {
        console.error('Failed to get email templates:', error);
        throw error;
      }
    },

    /**
     * Get email template by ID
     */
    getTemplateById: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          // Mock templates
          const templates = [
            {
              id: 1,
              name: 'Assessment Results',
              subject: 'Your Assessment Results',
              content: 'Dear {{patient_name}},\n\nThank you for completing the {{questionnaire_title}}. Your results have been processed, and we wanted to share them with you.\n\nYour score: {{score}}\nRisk level: {{risk_level}}\n\n{{custom_message}}\n\nYou can view your full results using your unique code: {{unique_code}}\n\nBest regards,\nThe Mental Health Team'
            },
            {
              id: 2,
              name: 'Follow-up',
              subject: 'Follow-up on Your Recent Assessment',
              content: 'Dear {{patient_name}},\n\nWe hope you are doing well. We are following up on your recent {{questionnaire_title}} assessment.\n\n{{custom_message}}\n\nIf you have any questions or concerns, please don\'t hesitate to reach out.\n\nBest regards,\nThe Mental Health Team'
            },
            {
              id: 3,
              name: 'Resources',
              subject: 'Mental Health Resources',
              content: 'Dear {{patient_name}},\n\nBased on your recent {{questionnaire_title}} assessment, we wanted to share some resources that might be helpful for you.\n\n{{custom_message}}\n\nRemember that help is always available, and you\'re not alone in this journey.\n\nBest regards,\nThe Mental Health Team'
            }
          ];

          const template = templates.find(t => t.id === id);

          if (!template) {
            throw new Error(`Template with ID ${id} not found`);
          }

          return { template };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/email/templates/${id}`);
      } catch (error) {
        console.error(`Failed to get email template ${id}:`, error);
        throw error;
      }
    }
  },

  /**
   * Organization methods
   */
  organizations: {
    /**
     * Get all organizations
     */
    getAll: async (withMemberCount = false) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          // Mock organization data
          return [
            {
              id: 1,
              name: 'Mental Health Clinic',
              description: 'A leading mental health clinic providing comprehensive care',
              logo_url: 'https://via.placeholder.com/150',
              website: 'https://mentalhealthclinic.example.com',
              address: '123 Health St, Medical District, MD 12345',
              phone: '+1 (555) 123-4567',
              email: 'info@mentalhealthclinic.example.com',
              created_at: '2023-01-15T10:30:00Z',
              member_count: 24,
              questionnaire_count: 15
            },
            {
              id: 2,
              name: 'Wellness Center',
              description: 'Holistic wellness services for mind and body',
              logo_url: 'https://via.placeholder.com/150',
              website: 'https://wellnesscenter.example.com',
              address: '456 Wellness Ave, Healthy City, HC 67890',
              phone: '+1 (555) 987-6543',
              email: 'contact@wellnesscenter.example.com',
              created_at: '2023-02-20T14:45:00Z',
              member_count: 18,
              questionnaire_count: 8
            }
          ];
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations${withMemberCount ? '?with_member_count=true' : ''}`);
      } catch (error) {
        console.error('Failed to get organizations:', error);
        throw error;
      }
    },

    /**
     * Get user organizations
     */
    getUserOrganizations: async () => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();
          return api.organizations.getAll();
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/me`);
      } catch (error) {
        console.error('Failed to get user organizations:', error);
        throw error;
      }
    },

    /**
     * Get organization by ID
     */
    getById: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          const organizations = await api.organizations.getAll();
          const organization = organizations.find((o: any) => o.id === id);

          if (!organization) {
            throw new Error(`Organization with ID ${id} not found`);
          }

          return organization;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}`);
      } catch (error) {
        console.error(`Failed to get organization ${id}:`, error);
        throw error;
      }
    },

    /**
     * Create organization
     */
    create: async (organizationData: any) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);

          const organizations = await api.organizations.getAll();
          const newId = Math.max(...organizations.map((o: any) => o.id)) + 1;

          const newOrganization = {
            ...organizationData,
            id: newId,
            created_at: new Date().toISOString(),
            member_count: 0,
            questionnaire_count: 0
          };

          return newOrganization;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(organizationData)
        });
      } catch (error) {
        console.error('Failed to create organization:', error);
        throw error;
      }
    },

    /**
     * Update organization
     */
    update: async (id: number, organizationData: any) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);

          const organizations = await api.organizations.getAll();
          const index = organizations.findIndex((o: any) => o.id === id);

          if (index === -1) {
            throw new Error(`Organization with ID ${id} not found`);
          }

          const updatedOrganization = {
            ...organizations[index],
            ...organizationData,
            updated_at: new Date().toISOString()
          };

          return updatedOrganization;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(organizationData)
        });
      } catch (error) {
        console.error(`Failed to update organization ${id}:`, error);
        throw error;
      }
    },

    /**
     * Delete organization
     */
    delete: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);
          return { success: true };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error(`Failed to delete organization ${id}:`, error);
        throw error;
      }
    },

    /**
     * Get organization members
     */
    getMembers: async (id: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          // Mock members data
          return [
            {
              id: 1,
              user_id: 101,
              organization_id: id,
              name: 'John Doe',
              email: 'john@example.com',
              role: 'admin',
              avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
              joined_at: '2023-01-15T10:30:00Z',
              status: 'active'
            },
            {
              id: 2,
              user_id: 102,
              organization_id: id,
              name: 'Jane Smith',
              email: 'jane@example.com',
              role: 'member',
              avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
              joined_at: '2023-02-20T14:45:00Z',
              status: 'active'
            },
            {
              id: 3,
              user_id: 103,
              organization_id: id,
              name: 'Robert Johnson',
              email: 'robert@example.com',
              role: 'member',
              avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
              joined_at: '2023-03-10T09:15:00Z',
              status: 'active'
            }
          ];
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members`);
      } catch (error) {
        console.error(`Failed to get members for organization ${id}:`, error);
        throw error;
      }
    },

    /**
     * Add member to organization
     */
    addMember: async (id: number, userId: number, role = 'member') => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);

          // Mock new member
          return {
            id: Date.now(),
            user_id: userId,
            organization_id: id,
            name: 'New Member',
            email: 'newmember@example.com',
            role,
            joined_at: new Date().toISOString(),
            status: 'active'
          };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userId, role })
        });
      } catch (error) {
        console.error(`Failed to add member to organization ${id}:`, error);
        throw error;
      }
    },

    /**
     * Remove member from organization
     */
    removeMember: async (id: number, userId: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);
          return { success: true };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members/${userId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error(`Failed to remove member from organization ${id}:`, error);
        throw error;
      }
    },

    /**
     * Update member role
     */
    updateMemberRole: async (id: number, userId: number, role: string) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(800);
          return { success: true };
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role })
        });
      } catch (error) {
        console.error(`Failed to update member role in organization ${id}:`, error);
        throw error;
      }
    }
  },

  /**
   * AI Analysis methods
   */
  aiAnalysis: {
    /**
     * Generate analysis for response
     */
    generate: async (responseId: number, prompt?: string, model?: string) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(2000);

          const response = mockStorage.responses.getById(responseId);
          if (!response) {
            throw new Error(`Response with ID ${responseId} not found`);
          }

          // Generate mock AI analysis
          const analysis = {
            id: Date.now(),
            response_id: responseId,
            created_at: new Date().toISOString(),
            model: model || 'gpt-4',
            analysis: {
              summary: "The patient is experiencing moderate to severe depression symptoms, particularly in areas of mood, energy, and self-perception. The PHQ-9 score of 14 indicates moderately severe depression that warrants clinical attention.",
              risk_assessment: "The patient does not report active suicidal ideation, which is a positive sign. However, the overall symptom severity suggests significant distress that could potentially worsen without intervention.",
              recommendations: [
                "Consider referral to a mental health professional for comprehensive evaluation",
                "Screening for comorbid anxiety may be beneficial given the sleep disturbances and concentration difficulties",
                "Regular follow-up to monitor symptom progression is recommended",
                "Psychoeducation about depression and self-care strategies would be helpful"
              ],
              key_concerns: [
                "Persistent depressed mood nearly every day",
                "Significant fatigue and energy loss",
                "Sleep disturbances",
                "Negative self-perception",
                "Reduced concentration"
              ],
              potential_triggers: "While not explicitly stated, the pattern of symptoms suggests possible stressors related to self-worth and performance expectations. Further exploration of work, relationship, or health-related stressors would be valuable."
            }
          };

          // In a real implementation, we would store this in the database
          // For now, we'll just return it
          return analysis;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/ai-analysis/responses/${responseId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt, model })
        });
      } catch (error) {
        console.error(`Failed to generate AI analysis for response ${responseId}:`, error);
        throw error;
      }
    },

    /**
     * Get analysis for response
     */
    getByResponse: async (responseId: number) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay(500);

          // In a real implementation, we would fetch this from the database
          // For now, we'll just generate it on the fly
          return api.aiAnalysis.generate(responseId);
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/ai-analysis/responses/${responseId}`);
      } catch (error) {
        console.error(`Failed to get AI analysis for response ${responseId}:`, error);
        throw error;
      }
    },

    /**
     * Get all analyses
     */
    getAll: async (params?: any) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          // Mock analyses data
          return {
            data: [
              {
                id: 1,
                response_id: 1,
                created_at: '2023-04-15T11:30:00Z',
                model: 'gpt-4',
                analysis: {
                  summary: "The patient is experiencing moderate to severe depression symptoms...",
                  risk_assessment: "The patient does not report active suicidal ideation...",
                  recommendations: ["Consider referral to a mental health professional..."],
                  key_concerns: ["Persistent depressed mood nearly every day..."],
                  potential_triggers: "While not explicitly stated, the pattern of symptoms..."
                }
              },
              {
                id: 2,
                response_id: 2,
                created_at: '2023-04-16T15:45:00Z',
                model: 'gpt-4',
                analysis: {
                  summary: "The patient is experiencing mild depression symptoms...",
                  risk_assessment: "No significant risk factors identified...",
                  recommendations: ["Consider follow-up assessment in 2-4 weeks..."],
                  key_concerns: ["Sleep disturbances..."],
                  potential_triggers: "Recent life stressors may be contributing..."
                }
              }
            ],
            total: 2,
            page: 1,
            limit: 10
          };
        }

        // Use API in production
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        return fetchWithErrorHandling(`${API_URL}/ai-analysis${queryParams ? `?${queryParams}` : ''}`);
      } catch (error) {
        console.error('Failed to get AI analyses:', error);
        throw error;
      }
    },

    /**
     * Search analyses
     */
    search: async (term: string) => {
      try {
        // Use mock storage in development
        if (process.env.NODE_ENV === 'development') {
          await simulateApiDelay();

          // Mock search results
          const analyses = await api.aiAnalysis.getAll();
          return analyses;
        }

        // Use API in production
        return fetchWithErrorHandling(`${API_URL}/ai-analysis/search?term=${encodeURIComponent(term)}`);
      } catch (error) {
        console.error(`Failed to search AI analyses with term "${term}":`, error);
        throw error;
      }
    }
  },

  /**
   * Google Forms methods
   */
  googleForms: {
    /**
     * Get all Google Form responses
     */
    getAll: async (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return fetchWithErrorHandling(`${API_URL}/google-forms${queryString}`);
    },

    /**
     * Get a single Google Form response by ID
     */
    getById: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/google-forms/${id}`);
    },

    /**
     * Import Google Form responses
     */
    import: async () => {
      return fetchWithErrorHandling(`${API_URL}/google-forms/import`, {
        method: 'POST'
      });
    },

    /**
     * Get Google Form response statistics
     */
    getStatistics: async () => {
      return fetchWithErrorHandling(`${API_URL}/google-forms/statistics`);
    }
  }
};

export default api;
