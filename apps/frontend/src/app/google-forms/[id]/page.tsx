'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Loading, Alert } from '@/components/common';
// Remove ProtectedRoute as authentication is disabled
// import { ProtectedRoute } from '@/components/auth';
import { apiClient } from '@/lib/apiClient';
import { handleApiError } from '@/utils/errorHandler';
import { formatDate } from '@/utils/dateUtils';

// Form question mapping - this would ideally come from the form metadata
const QUESTION_MAPPING: Record<string, string> = {
  'question_1': 'Email Address',
  'question_2': 'Full Name',
  'question_3': 'Age',
  'question_4': 'Gender',
  'question_5': 'Feedback'
};

const ResponseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch response details
  useEffect(() => {
    const fetchResponseDetails = async () => {
      try {
        setIsLoading(true);
        const result = await apiClient.get(`/google-forms/${id}`);
        setResponse(result.data.data);
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to fetch response details');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponseDetails();
  }, [id]);

  // Helper function to get question text
  const getQuestionText = (questionId: string): string => {
    return QUESTION_MAPPING[questionId] || `Question ${questionId}`;
  };

  // Helper function to extract answer value
  const getAnswerValue = (answer: any): string => {
    if (!answer) return 'No answer';

    if (answer.textAnswers && answer.textAnswers.answers) {
      return answer.textAnswers.answers.map((a: any) => a.value).join(', ');
    }

    if (answer.choiceAnswers && answer.choiceAnswers.answers) {
      return answer.choiceAnswers.answers.map((a: any) => a.value).join(', ');
    }

    return 'No answer';
  };

  // Render loading state
  if (isLoading) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'provider']}>
        <div className="container mx-auto px-4 py-8">
          <Loading size="large" message="Loading response details..." />
        </div>
      </ProtectedRoute>
    );
  }

  // Render error state
  if (error) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'provider']}>
        <div className="container mx-auto px-4 py-8">
          <Alert type="error" message={error} />
          <Button
            variant="secondary"
            onClick={() => router.push('/google-forms')}
            className="mt-4"
          >
            Back to Responses
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  // Render response not found
  if (!response) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'provider']}>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <p className="text-center text-gray-500 py-8">
              Response not found.
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push('/google-forms')}
              className="mt-4"
            >
              Back to Responses
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Extract form data from response
  const formData = response.response_data;
  const answers = formData?.answers || {};

  return (
    <ProtectedRoute requiredRoles={['admin', 'provider']}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Response Details</h1>
          <Button
            variant="secondary"
            onClick={() => router.push('/google-forms')}
          >
            Back to Responses
          </Button>
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500">Respondent</p>
              <p className="font-medium">{response.respondent_email || 'Anonymous'}</p>
            </div>
            <div>
              <p className="text-gray-500">Submitted At</p>
              <p className="font-medium">{formatDate(response.created_at)}</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Responses</h2>

          <div className="space-y-6">
            {Object.entries(answers).map(([questionId, answer]) => (
              <div key={questionId} className="border-b pb-4">
                <p className="font-medium">{getQuestionText(questionId)}</p>
                <p className="text-gray-700 mt-1">{getAnswerValue(answer)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ResponseDetailPage;
