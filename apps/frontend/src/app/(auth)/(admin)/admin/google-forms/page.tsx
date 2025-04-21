'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Loading, Alert, Table } from '@/components/common';
// Authentication is disabled - no need for ProtectedRoute
import { apiClient } from '@/lib/apiClient';
import { handleApiError } from '@/utils/errorHandler';
import { formatDate } from '@/utils/dateUtils';

const GoogleFormsPage = () => {
  const router = useRouter();
  const [responses, setResponses] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch responses on mount
  useEffect(() => {
    fetchResponses();
    fetchStatistics();
  }, []);

  // Fetch form responses
  const fetchResponses = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/google-forms');
      setResponses(response.data.data.responses || []);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch form responses');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get('/google-forms/statistics');
      setStatistics(response.data.data || {
        total_responses: 0,
        unique_respondents: 0,
        first_response: null,
        last_response: null
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      // Set default statistics instead of failing
      setStatistics({
        total_responses: 0,
        unique_respondents: 0,
        first_response: null,
        last_response: null
      });
    }
  };

  // Import form responses
  const handleImport = async () => {
    try {
      setIsImporting(true);
      setError('');
      setSuccess('');

      const response = await apiClient.post('/google-forms/import');

      setSuccess(response.data.message);
      fetchResponses();
      fetchStatistics();
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to import form responses');
      setError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'Respondent',
      accessor: (row: any) => row.respondent_email || 'Anonymous'
    },
    {
      header: 'Submitted At',
      accessor: (row: any) => formatDate(row.created_at)
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <Button
          variant="secondary"
          size="small"
          onClick={() => router.push(`/google-forms/${row.id}`)}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Google Form Responses</h1>
          <Button
            variant="primary"
            onClick={handleImport}
            loading={isImporting}
          >
            Import Responses
          </Button>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}

        {statistics && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-500">Total Responses</p>
                <p className="text-2xl font-bold">{statistics.total_responses}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Unique Respondents</p>
                <p className="text-2xl font-bold">{statistics.unique_respondents}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">First Response</p>
                <p className="text-lg">{formatDate(statistics.first_response)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Latest Response</p>
                <p className="text-lg">{formatDate(statistics.last_response)}</p>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <Loading size="large" message="Loading responses..." />
        ) : responses.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No responses found. Click "Import Responses" to fetch the latest data.
            </p>
          </Card>
        ) : (
          <Table
            data={responses}
            columns={columns}
            keyField="id"
          />
        )}
      </div>
  );
};

export default GoogleFormsPage;
