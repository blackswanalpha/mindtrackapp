/**
 * API service for making requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch wrapper with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
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
  }
};

export default api;
