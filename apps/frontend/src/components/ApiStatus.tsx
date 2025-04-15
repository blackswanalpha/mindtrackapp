'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const health = await api.checkHealth();
        const info = await api.getApiInfo();
        
        setApiInfo(info);
        setStatus('connected');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to connect to API');
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h2 className="text-xl font-semibold mb-2">API Status</h2>
      
      {status === 'loading' && (
        <p className="text-gray-500">Checking API connection...</p>
      )}
      
      {status === 'connected' && (
        <div>
          <p className="text-green-600 font-medium">✅ Connected to API</p>
          {apiInfo && (
            <div className="mt-2 text-sm text-gray-700">
              <p>Name: {apiInfo.name}</p>
              <p>Version: {apiInfo.version}</p>
              <p>Description: {apiInfo.description}</p>
            </div>
          )}
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <p className="text-red-600 font-medium">❌ Failed to connect to API</p>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
