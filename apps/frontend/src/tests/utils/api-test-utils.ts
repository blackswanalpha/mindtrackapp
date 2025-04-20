/**
 * API Test Utilities
 * 
 * This file contains utility functions for testing API endpoints.
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create an axios instance for testing
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for logging in tests
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API TEST] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`[API TEST ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'NETWORK ERROR'}`);
    console.error(error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Set the authentication token for API requests
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Generic function to make API requests
 */
export const apiRequest = async <T = any>(
  method: string,
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  switch (method.toLowerCase()) {
    case 'get':
      return apiClient.get<T>(url, config);
    case 'post':
      return apiClient.post<T>(url, data, config);
    case 'put':
      return apiClient.put<T>(url, data, config);
    case 'patch':
      return apiClient.patch<T>(url, data, config);
    case 'delete':
      return apiClient.delete<T>(url, config);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

/**
 * Helper functions for common API operations
 */
export const apiTest = {
  get: <T = any>(endpoint: string, config?: AxiosRequestConfig) => 
    apiRequest<T>('get', endpoint, undefined, config),
  
  post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('post', endpoint, data, config),
  
  put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('put', endpoint, data, config),
  
  patch: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('patch', endpoint, data, config),
  
  delete: <T = any>(endpoint: string, config?: AxiosRequestConfig) => 
    apiRequest<T>('delete', endpoint, undefined, config),
};

/**
 * Login helper for tests that require authentication
 */
export const loginForTest = async (email: string, password: string): Promise<string> => {
  try {
    const response = await apiTest.post('/auth/login', { email, password });
    const token = response.data.token;
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error('Login for test failed:', error);
    throw error;
  }
};

/**
 * Cleanup function to reset test data
 */
export const cleanupTestData = async (): Promise<void> => {
  // This would be implemented based on your specific needs
  // For example, you might want to delete all test users, questionnaires, etc.
  console.log('[API TEST] Cleaning up test data...');
};

export default apiTest;
