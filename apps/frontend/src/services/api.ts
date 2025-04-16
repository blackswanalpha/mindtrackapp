/**
 * API service for making requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Get auth token from localStorage or return a mock token
 * AUTHENTICATION DISABLED: Always return a mock token
 */
const getToken = (): string => {
  // Always return a mock token since authentication is disabled
  return 'mock-token-for-disabled-auth';
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
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      return fetchWithErrorHandling(`${API_URL}/questionnaires${queryParams ? `?${queryParams}` : ''}`);
    },

    /**
     * Get questionnaire by ID
     */
    getById: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${id}`);
    },

    /**
     * Create questionnaire
     */
    create: async (questionnaireData: any) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionnaireData)
      });
    },

    /**
     * Update questionnaire
     */
    update: async (id: number, questionnaireData: any) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionnaireData)
      });
    },

    /**
     * Delete questionnaire
     */
    delete: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${id}`, {
        method: 'DELETE'
      });
    },

    /**
     * Get questionnaire with questions
     */
    getWithQuestions: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${id}/questions`);
    },

    /**
     * Get questionnaire statistics
     */
    getStatistics: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${id}/statistics`);
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
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${questionnaireId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });
    },

    /**
     * Get question by ID
     */
    getById: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/questions/${id}`);
    },

    /**
     * Update question
     */
    update: async (id: number, questionData: any) => {
      return fetchWithErrorHandling(`${API_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });
    },

    /**
     * Delete question
     */
    delete: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/questions/${id}`, {
        method: 'DELETE'
      });
    },

    /**
     * Reorder questions
     */
    reorder: async (questionnaireId: number, questions: any[]) => {
      return fetchWithErrorHandling(`${API_URL}/questionnaires/${questionnaireId}/questions/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questions })
      });
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
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      return fetchWithErrorHandling(`${API_URL}/responses${queryParams ? `?${queryParams}` : ''}`);
    },

    /**
     * Get response by ID
     */
    getById: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/responses/${id}`);
    },

    /**
     * Create response
     */
    create: async (responseData: any) => {
      return fetchWithErrorHandling(`${API_URL}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseData)
      });
    },

    /**
     * Get response with answers
     */
    getWithAnswers: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/responses/${id}/answers`);
    },

    /**
     * Flag response for review
     */
    flag: async (id: number, flagged: boolean) => {
      return fetchWithErrorHandling(`${API_URL}/responses/${id}/flag`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flagged })
      });
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
      return fetchWithErrorHandling(`${API_URL}/organizations${withMemberCount ? '?with_member_count=true' : ''}`);
    },

    /**
     * Get user organizations
     */
    getUserOrganizations: async () => {
      return fetchWithErrorHandling(`${API_URL}/organizations/me`);
    },

    /**
     * Get organization by ID
     */
    getById: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}`);
    },

    /**
     * Create organization
     */
    create: async (organizationData: any) => {
      return fetchWithErrorHandling(`${API_URL}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(organizationData)
      });
    },

    /**
     * Update organization
     */
    update: async (id: number, organizationData: any) => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(organizationData)
      });
    },

    /**
     * Delete organization
     */
    delete: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}`, {
        method: 'DELETE'
      });
    },

    /**
     * Get organization members
     */
    getMembers: async (id: number) => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members`);
    },

    /**
     * Add member to organization
     */
    addMember: async (id: number, userId: number, role = 'member') => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, role })
      });
    },

    /**
     * Remove member from organization
     */
    removeMember: async (id: number, userId: number) => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members/${userId}`, {
        method: 'DELETE'
      });
    },

    /**
     * Update member role
     */
    updateMemberRole: async (id: number, userId: number, role: string) => {
      return fetchWithErrorHandling(`${API_URL}/organizations/${id}/members/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
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
      return fetchWithErrorHandling(`${API_URL}/ai-analysis/responses/${responseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, model })
      });
    },

    /**
     * Get analysis for response
     */
    getByResponse: async (responseId: number) => {
      return fetchWithErrorHandling(`${API_URL}/ai-analysis/responses/${responseId}`);
    },

    /**
     * Get all analyses
     */
    getAll: async (params?: any) => {
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      return fetchWithErrorHandling(`${API_URL}/ai-analysis${queryParams ? `?${queryParams}` : ''}`);
    },

    /**
     * Search analyses
     */
    search: async (term: string) => {
      return fetchWithErrorHandling(`${API_URL}/ai-analysis/search?term=${encodeURIComponent(term)}`);
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
