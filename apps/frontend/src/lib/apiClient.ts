import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if not already there
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');

        // Only redirect if not on public pages
        const isPublicPath = (
          window.location.pathname.includes('/login') ||
          window.location.pathname.includes('/register') ||
          window.location.pathname.includes('/questionnaires/respond/') ||
          window.location.pathname.includes('/responses/complete/') ||
          window.location.pathname.includes('/responses/view/') ||
          window.location.pathname.includes('/scan') ||
          window.location.pathname === '/'
        );

        if (!isPublicPath) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
