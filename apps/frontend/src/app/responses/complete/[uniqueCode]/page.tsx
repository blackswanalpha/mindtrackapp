'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, Button, Loading, Alert } from '@/components/common';
import { QRCodeViewer } from '@/components/qrcode';
import { handleApiError } from '@/utils/errorHandler';
import { formatDate } from '@/utils/dateUtils';
import { apiClient } from '@/lib/apiClient';

const ResponseCompletePage = () => {
  const { uniqueCode } = useParams();
  const [response, setResponse] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Fetch response data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch response
        const responseRes = await apiClient.get(`/responses/code/${uniqueCode}`);
        setResponse(responseRes.data.response);
        
        // Fetch questionnaire
        const questionnaireRes = await apiClient.get(`/questionnaires/${responseRes.data.response.questionnaire_id}`);
        setQuestionnaire(questionnaireRes.data.questionnaire);
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to load response data');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (uniqueCode) {
      fetchData();
    }
  }, [uniqueCode]);
  
  // Get risk level class
  const getRiskLevelClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Loading response data..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }
  
  if (!response || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="Response not found" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Response Complete
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg
              className="h-8 w-8 text-green-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">
              Thank you for completing the questionnaire!
            </h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Your response has been recorded. You can use the unique code below to access your results in the future.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Response Summary">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Questionnaire</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{questionnaire.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Completed On</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatDate(response.completed_at || response.created_at)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Score</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{response.score}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ${getRiskLevelClass(
                    response.risk_level
                  )}`}
                >
                  {response.risk_level?.toUpperCase() || 'N/A'}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Unique Code</h3>
                <div className="mt-1 bg-gray-100 p-2 rounded-md font-mono text-center">
                  {uniqueCode as string}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Save this code to access your results later
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                href={`/responses/view/${uniqueCode}`}
              >
                View Detailed Results
              </Button>
            </div>
          </Card>
          
          <QRCodeViewer uniqueCode={uniqueCode as string} />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            An email with your results has been sent to your email address.
          </p>
          
          <Button
            variant="light"
            href="/"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResponseCompletePage;
