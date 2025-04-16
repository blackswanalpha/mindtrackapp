'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TestLayout from '@/components/test/TestLayout';
import { Card, Button, Loading, Alert } from '@/components/common';
import { ArrowLeft, Download, Mail } from 'lucide-react';

// Mock data for responses
const RESPONSES = {
  '1': {
    id: '1',
    questionnaire_id: '1',
    questionnaire_title: 'Mental Health Assessment',
    respondent_email: 'user1@example.com',
    unique_code: 'abc123',
    created_at: '2023-04-16T10:30:00Z',
    completed: true,
    answers: [
      {
        question_id: '1-1',
        question_text: 'What is your email address?',
        answer: 'user1@example.com'
      },
      {
        question_id: '1-2',
        question_text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
        answer: 'Several days'
      },
      {
        question_id: '1-3',
        question_text: 'Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?',
        answer: 'More than half the days'
      },
      {
        question_id: '1-4',
        question_text: 'How would you rate your sleep quality over the past week?',
        answer: 'Poor'
      },
      {
        question_id: '1-5',
        question_text: 'How often do you feel anxious or worried?',
        answer: 'Often'
      },
      {
        question_id: '1-6',
        question_text: 'Please describe any specific concerns you have about your mental health:',
        answer: 'I have been feeling overwhelmed with work and personal responsibilities. My sleep has been affected and I find it hard to concentrate during the day.'
      }
    ]
  },
  '2': {
    id: '2',
    questionnaire_id: '2',
    questionnaire_title: 'Anxiety and Depression Screening',
    respondent_email: 'user2@example.com',
    unique_code: 'def456',
    created_at: '2023-04-16T11:45:00Z',
    completed: true,
    answers: [
      {
        question_id: '2-1',
        question_text: 'What is your email address?',
        answer: 'user2@example.com'
      },
      {
        question_id: '2-2',
        question_text: 'Feeling nervous, anxious, or on edge',
        answer: 'Several days'
      },
      {
        question_id: '2-3',
        question_text: 'Not being able to stop or control worrying',
        answer: 'Not at all'
      },
      {
        question_id: '2-4',
        question_text: 'Little interest or pleasure in doing things',
        answer: 'Several days'
      },
      {
        question_id: '2-5',
        question_text: 'Feeling down, depressed, or hopeless',
        answer: 'Not at all'
      },
      {
        question_id: '2-6',
        question_text: 'Trouble falling or staying asleep, or sleeping too much',
        answer: 'More than half the days'
      },
      {
        question_id: '2-7',
        question_text: 'Feeling tired or having little energy',
        answer: 'Several days'
      },
      {
        question_id: '2-8',
        question_text: 'Is there anything else you would like to share about your symptoms?',
        answer: 'I have been experiencing some anxiety related to an upcoming presentation at work, but it has not significantly impacted my daily life.'
      }
    ]
  },
  '3': {
    id: '3',
    questionnaire_id: '1',
    questionnaire_title: 'Mental Health Assessment',
    respondent_email: 'user3@example.com',
    unique_code: 'ghi789',
    created_at: '2023-04-16T14:20:00Z',
    completed: true,
    answers: [
      {
        question_id: '1-1',
        question_text: 'What is your email address?',
        answer: 'user3@example.com'
      },
      {
        question_id: '1-2',
        question_text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
        answer: 'Not at all'
      },
      {
        question_id: '1-3',
        question_text: 'Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?',
        answer: 'Not at all'
      },
      {
        question_id: '1-4',
        question_text: 'How would you rate your sleep quality over the past week?',
        answer: 'Good'
      },
      {
        question_id: '1-5',
        question_text: 'How often do you feel anxious or worried?',
        answer: 'Rarely'
      },
      {
        question_id: '1-6',
        question_text: 'Please describe any specific concerns you have about your mental health:',
        answer: 'No specific concerns at this time. I have been practicing mindfulness and regular exercise which has helped maintain my mental wellbeing.'
      }
    ]
  },
  '4': {
    id: '4',
    questionnaire_id: '2',
    questionnaire_title: 'Anxiety and Depression Screening',
    respondent_email: 'user4@example.com',
    unique_code: 'jkl012',
    created_at: '2023-04-16T15:10:00Z',
    completed: true,
    answers: [
      {
        question_id: '2-1',
        question_text: 'What is your email address?',
        answer: 'user4@example.com'
      },
      {
        question_id: '2-2',
        question_text: 'Feeling nervous, anxious, or on edge',
        answer: 'Nearly every day'
      },
      {
        question_id: '2-3',
        question_text: 'Not being able to stop or control worrying',
        answer: 'More than half the days'
      },
      {
        question_id: '2-4',
        question_text: 'Little interest or pleasure in doing things',
        answer: 'Several days'
      },
      {
        question_id: '2-5',
        question_text: 'Feeling down, depressed, or hopeless',
        answer: 'Several days'
      },
      {
        question_id: '2-6',
        question_text: 'Trouble falling or staying asleep, or sleeping too much',
        answer: 'Nearly every day'
      },
      {
        question_id: '2-7',
        question_text: 'Feeling tired or having little energy',
        answer: 'More than half the days'
      },
      {
        question_id: '2-8',
        question_text: 'Is there anything else you would like to share about your symptoms?',
        answer: 'I have been experiencing significant anxiety that interferes with my daily activities. I find it difficult to concentrate at work and often feel overwhelmed by small tasks.'
      }
    ]
  }
};

const TestResponseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch response data
  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from the API
        // For now, we'll use our mock data
        const responseData = RESPONSES[id as string];
        
        if (!responseData) {
          setError('Response not found');
          setIsLoading(false);
          return;
        }
        
        setResponse(responseData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load response');
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchResponse();
    }
  }, [id]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Export response as PDF (mock function)
  const exportPDF = () => {
    alert('In a real implementation, this would generate a PDF of the response.');
  };
  
  // Send email (mock function)
  const sendEmail = () => {
    alert(`In a real implementation, this would send an email to ${response?.respondent_email}.`);
  };
  
  return (
    <TestLayout>
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <Loading size="large" message="Loading response..." />
        ) : error ? (
          <div className="text-center py-8">
            <Alert type="error" message={error} className="mb-6" />
            <Button
              variant="primary"
              onClick={() => router.push('/test/responses')}
            >
              Back to Responses
            </Button>
          </div>
        ) : response ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/test/responses')}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Responses
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">{response.questionnaire_title}</h1>
                <p className="text-gray-600 mt-1">Response ID: {response.id}</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={exportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={sendEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Results
                </Button>
              </div>
            </div>
            
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Respondent Email</p>
                  <p className="font-medium">{response.respondent_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unique Code</p>
                  <p className="font-medium">{response.unique_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium">{formatDate(response.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {response.completed ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <span className="text-yellow-600">Partial</span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Responses</h2>
              <div className="space-y-6">
                {response.answers.map((answer: any, index: number) => (
                  <div key={answer.question_id} className={index < response.answers.length - 1 ? "pb-6 border-b border-gray-200" : ""}>
                    <p className="font-medium text-gray-900 mb-2">{answer.question_text}</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{answer.answer || 'No answer provided'}</p>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="text-sm text-gray-500">
              <p>
                This response is stored in the testresponse table for demonstration purposes.
                In a real implementation, you would be able to analyze the data and generate reports.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </TestLayout>
  );
};

export default TestResponseDetailPage;
