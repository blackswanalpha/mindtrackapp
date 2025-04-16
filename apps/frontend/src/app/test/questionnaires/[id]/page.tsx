'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import TestLayout from '@/components/test/TestLayout';
import { Card, Button, Loading, Alert } from '@/components/common';
import { ChevronLeft, ChevronRight, Send, AlertCircle, CheckCircle } from 'lucide-react';

// Mock data for the questionnaires
const QUESTIONNAIRES: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Mental Health Assessment',
    description: 'A comprehensive mental health assessment form with questions about mood, anxiety, sleep patterns, and overall wellbeing.',
    source_url: 'https://forms.gle/E8bdVzAEbMaQsHR56',
    questions: [
      {
        id: '1-1',
        text: 'What is your email address?',
        type: 'email',
        required: true,
        options: []
      },
      {
        id: '1-2',
        text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '1-3',
        text: 'Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '1-4',
        text: 'How would you rate your sleep quality over the past week?',
        type: 'single_choice',
        required: true,
        options: [
          'Very poor',
          'Poor',
          'Fair',
          'Good',
          'Very good'
        ]
      },
      {
        id: '1-5',
        text: 'How often do you feel anxious or worried?',
        type: 'single_choice',
        required: true,
        options: [
          'Never',
          'Rarely',
          'Sometimes',
          'Often',
          'Always'
        ]
      },
      {
        id: '1-6',
        text: 'Please describe any specific concerns you have about your mental health:',
        type: 'text',
        required: false,
        options: []
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Anxiety and Depression Screening',
    description: 'Screening tool for anxiety and depression symptoms based on standardized clinical measures.',
    source_url: 'https://forms.gle/NLqA1svRhX5Pez1K6',
    questions: [
      {
        id: '2-1',
        text: 'What is your email address?',
        type: 'email',
        required: true,
        options: []
      },
      {
        id: '2-2',
        text: 'Feeling nervous, anxious, or on edge',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '2-3',
        text: 'Not being able to stop or control worrying',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '2-4',
        text: 'Little interest or pleasure in doing things',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '2-5',
        text: 'Feeling down, depressed, or hopeless',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '2-6',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '2-7',
        text: 'Feeling tired or having little energy',
        type: 'single_choice',
        required: true,
        options: [
          'Not at all',
          'Several days',
          'More than half the days',
          'Nearly every day'
        ]
      },
      {
        id: '2-8',
        text: 'Is there anything else you would like to share about your symptoms?',
        type: 'text',
        required: false,
        options: []
      }
    ]
  }
};

const TestQuestionnaireDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const uniqueCode = searchParams.get('code');

  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch questionnaire data
  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, this would fetch from the API
        // For now, we'll use our mock data
        const questionnaireData = QUESTIONNAIRES[id as string];

        if (!questionnaireData) {
          setError('Questionnaire not found');
          setIsLoading(false);
          return;
        }

        setQuestionnaire(questionnaireData);

        // Initialize answers object
        const initialAnswers: Record<string, any> = {};
        questionnaireData.questions.forEach((question: any) => {
          initialAnswers[question.id] = '';
        });
        setAnswers(initialAnswers);

        setIsLoading(false);
      } catch (err) {
        setError('Failed to load questionnaire');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Check if current question is answered and required
  const isCurrentQuestionAnswered = () => {
    if (!questionnaire) return true;

    const currentQuestion = questionnaire.questions[currentQuestionIndex];
    if (!currentQuestion.required) return true;

    const answer = answers[currentQuestion.id];
    return answer !== undefined && answer !== '';
  };

  // Check if all required questions are answered
  const areAllRequiredQuestionsAnswered = () => {
    if (!questionnaire) return false;

    return questionnaire.questions.every((question: any) => {
      if (!question.required) return true;
      const answer = answers[question.id];
      return answer !== undefined && answer !== '';
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // In a real implementation, this would send data to the API
      // For now, we'll just simulate a submission
      console.log('Submitting answers:', {
        questionnaire_id: questionnaire.id,
        unique_code: uniqueCode || undefined,
        answers: answers
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      setError('Failed to submit responses');
      setIsSubmitting(false);
    }
  };

  // Render the current question
  const renderQuestion = () => {
    if (!questionnaire) return null;

    const currentQuestion = questionnaire.questions[currentQuestionIndex];

    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {currentQuestion.required && <span className="text-red-500 mr-1">*</span>}
          {currentQuestion.text}
        </h3>

        {currentQuestion.type === 'text' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Type your answer here..."
            required={currentQuestion.required}
          />
        )}

        {currentQuestion.type === 'email' && (
          <input
            type="email"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email address"
            required={currentQuestion.required}
          />
        )}

        {currentQuestion.type === 'single_choice' && (
          <div className="space-y-3 mt-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  required={currentQuestion.required}
                />
                <label htmlFor={`option-${index}`} className="ml-3 text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the success message after submission
  const renderSuccessMessage = () => {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your responses have been successfully submitted.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => router.push('/test/questionnaires')}
          >
            View All Questionnaires
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/test')}
          >
            Back to Test Home
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TestLayout>
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <Loading size="large" message="Loading questionnaire..." />
        ) : error ? (
          <div className="text-center py-8">
            <Alert type="error" message={error} className="mb-6" />
            <Button
              variant="primary"
              onClick={() => router.push('/test/questionnaires')}
            >
              Back to Questionnaires
            </Button>
          </div>
        ) : submitted ? (
          renderSuccessMessage()
        ) : questionnaire ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{questionnaire.title}</h1>
              <p className="text-gray-600 mt-2">{questionnaire.description}</p>

              {uniqueCode && (
                <div className="mt-2 text-sm text-blue-600">
                  Unique code: {uniqueCode}
                </div>
              )}
            </div>

            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questionnaire.questions.length}
                </div>
                <div className="text-sm font-medium">
                  {Math.round(((currentQuestionIndex + 1) / questionnaire.questions.length) * 100)}% Complete
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / questionnaire.questions.length) * 100}%` }}
                ></div>
              </div>

              {renderQuestion()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentQuestionIndex < questionnaire.questions.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!isCurrentQuestionAnswered()}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!areAllRequiredQuestionsAnswered() || isSubmitting}
                    loading={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )}
              </div>
            </Card>

            <div className="text-sm text-gray-500 flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>
                Fields marked with <span className="text-red-500">*</span> are required.
                Your responses will be stored in the test database for demonstration purposes only.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </TestLayout>
  );
};

export default TestQuestionnaireDetailPage;
