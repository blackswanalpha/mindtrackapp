'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, Button, Loading, Alert, Badge } from '@/components/common';
import { QRCodeViewer } from '@/components/qrcode';
import { handleApiError } from '@/utils/errorHandler';
import { formatDate } from '@/utils/dateUtils';
import { apiClient } from '@/lib/apiClient';

const ResponseViewPage = () => {
  const { uniqueCode } = useParams();
  const [response, setResponse] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Fetch response data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch response with answers
        const responseRes = await apiClient.get(`/responses/code/${uniqueCode}/answers`);
        setResponse(responseRes.data.response);
        setAnswers(responseRes.data.answers || []);
        
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
  
  // Get risk level badge variant
  const getRiskLevelVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'gray';
    }
  };
  
  // Render answer value based on question type
  const renderAnswerValue = (answer: any, question: any) => {
    if (!question) return 'N/A';
    
    switch (question.type) {
      case 'single_choice':
        if (question.options) {
          const option = question.options.find((opt: any) => opt.value.toString() === answer.value.toString());
          return option ? option.label : answer.value;
        }
        return answer.value;
      
      case 'multiple_choice':
        if (question.options) {
          try {
            const selectedValues = JSON.parse(answer.value);
            return selectedValues
              .map((val: any) => {
                const option = question.options.find((opt: any) => opt.value.toString() === val.toString());
                return option ? option.label : val;
              })
              .join(', ');
          } catch (e) {
            return answer.value;
          }
        }
        return answer.value;
      
      case 'yes_no':
        return answer.value === 'true' || answer.value === '1' ? 'Yes' : 'No';
      
      default:
        return answer.value;
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Response Details
          </h1>
          
          <div className="mt-2 md:mt-0">
            <Button
              variant="light"
              href="/"
              size="small"
            >
              Return to Home
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card title="Questionnaire Info" className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{questionnaire.title}</p>
              </div>
              
              {questionnaire.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-700">{questionnaire.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completed On</h3>
                  <p className="mt-1 text-gray-700">
                    {formatDate(response.completed_at || response.created_at)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Unique Code</h3>
                  <p className="mt-1 font-mono text-gray-700">{uniqueCode as string}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="Results Summary">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-500">Score</h3>
                <p className="mt-1 text-3xl font-bold text-gray-900">{response.score}</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
                <div className="mt-2">
                  <Badge
                    variant={getRiskLevelVariant(response.risk_level)}
                    size="large"
                    rounded
                  >
                    {response.risk_level?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <Card title="Response Answers" className="mb-8">
          {answers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No answers available</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {answers.map((answer, index) => (
                <div key={answer.id} className="py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center text-gray-500 font-medium">
                      {index + 1}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {answer.question?.text || 'Question'}
                      </h3>
                      <div className="mt-2 text-gray-700">
                        <strong>Answer:</strong> {renderAnswerValue(answer, answer.question)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Response QR Code</h2>
            <QRCodeViewer uniqueCode={uniqueCode as string} />
          </div>
          
          <Card title="What's Next?">
            <div className="space-y-4">
              <p className="text-gray-700">
                Thank you for completing this questionnaire. Your responses have been recorded and analyzed.
              </p>
              
              {response.risk_level === 'high' && (
                <Alert
                  type="warning"
                  message="Your responses indicate a high risk level. We recommend consulting with a healthcare professional."
                  showIcon
                />
              )}
              
              <p className="text-gray-700">
                If you have any questions about your results, please contact your healthcare provider.
              </p>
              
              <div className="pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  href={`/questionnaires/${questionnaire.id}`}
                >
                  Learn More About This Assessment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResponseViewPage;
