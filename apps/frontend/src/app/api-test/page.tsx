'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTestPage: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testApi = async (url: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(url);
      setApiResponse(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      console.error('API test error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testAuthApi = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
        email: 'admin@example.com',
        password: 'password123'
      });
      setApiResponse(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      console.error('Auth API test error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-4">
        <button
          onClick={() => testApi('http://localhost:3001/api/v1')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test API Root
        </button>
        
        <button
          onClick={() => testApi('http://localhost:3001/api/v1/questionnaires')}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test Questionnaires API
        </button>
        
        <button
          onClick={testAuthApi}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Test Auth API
        </button>
      </div>
      
      {loading && <p className="text-gray-600">Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {apiResponse && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">API Response:</h2>
          <pre className="bg-black text-green-400 p-4 rounded overflow-auto max-h-96">
            {apiResponse}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;
