'use client';

import React, { useState, useEffect } from 'react';
import TestLayout from '@/components/test/TestLayout';
import { Card, Button, Loading, Alert, Table } from '@/components/common';
import Link from 'next/link';
import { FileText, Download, Filter } from 'lucide-react';

const TestResponsesPage = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Fetch responses on mount
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from the testresponse table
        // For now, we'll use mock data
        const mockResponses = [
          {
            id: '1',
            questionnaire_id: '1',
            questionnaire_title: 'Mental Health Assessment',
            respondent_email: 'user1@example.com',
            unique_code: 'abc123',
            created_at: '2023-04-16T10:30:00Z',
            completed: true
          },
          {
            id: '2',
            questionnaire_id: '2',
            questionnaire_title: 'Anxiety and Depression Screening',
            respondent_email: 'user2@example.com',
            unique_code: 'def456',
            created_at: '2023-04-16T11:45:00Z',
            completed: true
          },
          {
            id: '3',
            questionnaire_id: '1',
            questionnaire_title: 'Mental Health Assessment',
            respondent_email: 'user3@example.com',
            unique_code: 'ghi789',
            created_at: '2023-04-16T14:20:00Z',
            completed: true
          },
          {
            id: '4',
            questionnaire_id: '2',
            questionnaire_title: 'Anxiety and Depression Screening',
            respondent_email: 'user4@example.com',
            unique_code: 'jkl012',
            created_at: '2023-04-16T15:10:00Z',
            completed: true
          }
        ];
        
        setResponses(mockResponses);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load responses');
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter responses
  const filteredResponses = filter === 'all' 
    ? responses 
    : responses.filter(response => response.questionnaire_id === filter);

  // Export responses as CSV
  const exportCSV = () => {
    // Create CSV content
    const headers = ['ID', 'Questionnaire', 'Email', 'Code', 'Date', 'Completed'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => [
        response.id,
        `"${response.questionnaire_title}"`,
        response.respondent_email,
        response.unique_code,
        formatDate(response.created_at),
        response.completed ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `test-responses-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table columns
  const columns = [
    {
      header: 'Questionnaire',
      accessor: 'questionnaire_title',
      cell: (row: any) => row.questionnaire_title
    },
    {
      header: 'Respondent',
      accessor: 'respondent_email',
      cell: (row: any) => row.respondent_email
    },
    {
      header: 'Code',
      accessor: 'unique_code',
      cell: (row: any) => row.unique_code
    },
    {
      header: 'Submitted',
      accessor: 'created_at',
      cell: (row: any) => formatDate(row.created_at)
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row: any) => (
        <Link href={`/test/responses/${row.id}`}>
          <Button variant="secondary" size="small">
            <FileText className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
      )
    }
  ];

  return (
    <TestLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Test Responses</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="all">All Questionnaires</option>
                <option value="1">Mental Health Assessment</option>
                <option value="2">Anxiety and Depression Screening</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Button 
              variant="outline" 
              onClick={exportCSV}
              disabled={filteredResponses.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        {error && <Alert type="error" message={error} className="mb-6" />}
        
        {isLoading ? (
          <Loading size="large" message="Loading responses..." />
        ) : filteredResponses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No responses available.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <Table
              data={filteredResponses}
              columns={columns}
              pagination={{
                totalItems: filteredResponses.length,
                itemsPerPage: 10
              }}
            />
          </Card>
        )}
        
        <div className="mt-12 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">About Test Responses</h3>
          <p className="text-purple-700">
            These responses are stored in the testresponse table for demonstration purposes.
            In a real implementation, you would be able to view detailed response data and analytics.
          </p>
        </div>
      </div>
    </TestLayout>
  );
};

export default TestResponsesPage;
