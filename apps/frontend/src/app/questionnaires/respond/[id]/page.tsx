'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Loading, Alert, ProgressBar } from '@/components/common';
import { apiClient } from '@/lib/apiClient';
import { handleApiError } from '@/utils/errorHandler';

type Question = {
  id: number;
  text: string;
  description?: string;
  type: string;
  required: boolean;
  options?: Array<{ value: number; label: string }>;
  order_num: number;
};

type Answer = {
  question_id: number;
  value: string | number | boolean | string[];
};

const QuestionnaireRespondPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  // Fetch questionnaire and questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questionnaire
        const questionnaireResponse = await apiClient.get(`/questionnaires/${id}`);
        setQuestionnaire(questionnaireResponse.data.questionnaire);

        // Fetch questions
        const questionsResponse = await apiClient.get(`/questions?questionnaire_id=${id}`);

        // Sort questions by order_num
        const sortedQuestions = questionsResponse.data.questions.sort(
          (a: Question, b: Question) => a.order_num - b.order_num
        );

        setQuestions(sortedQuestions);

        // Initialize answers array
        const initialAnswers = sortedQuestions.map((question: Question) => ({
          question_id: question.id,
          value: question.type === 'multiple_choice' ? [] : ''
        }));

        setAnswers(initialAnswers);
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to load questionnaire');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle answer change
  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(answer =>
        answer.question_id === questionId ? { ...answer, value } : answer
      )
    );
  };

  // Handle multiple choice answer change
  const handleMultipleChoiceChange = (questionId: number, optionValue: string, checked: boolean) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(answer => {
        if (answer.question_id === questionId) {
          const currentValues = answer.value as string[];
          let newValues;

          if (checked) {
            // Add value if checked
            newValues = [...currentValues, optionValue];
          } else {
            // Remove value if unchecked
            newValues = currentValues.filter(v => v !== optionValue);
          }

          return { ...answer, value: newValues };
        }

        return answer;
      })
    );
  };

  // Navigate to next question
  const handleNext = () => {
    // Validate current question if required
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers.find(a => a.question_id === currentQuestion.id);

    if (currentQuestion.required) {
      const value = currentAnswer?.value;

      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        setError('This question is required');
        return;
      }
    }

    setError('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError('');
    }
  };

  // Submit questionnaire
  const handleSubmit = async () => {
    // Validate current question if required
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers.find(a => a.question_id === currentQuestion.id);

    if (currentQuestion.required) {
      const value = currentAnswer?.value;

      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        setError('This question is required');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Submit response
      const response = await apiClient.post('/responses', {
        questionnaire_id: Number(id),
        patient_email: patientEmail,
        answers: answers.map(answer => ({
          question_id: answer.question_id,
          value: answer.value
        }))
      });

      // Get unique code
      const uniqueCode = response.data.response.unique_code;

      // Redirect to completion page
      router.push(`/responses/complete/${uniqueCode}`);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to submit response');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email input handler
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientEmail(e.target.value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire..." />
      </div>
    );
  }

  // Render error state
  if (!questionnaire || !questions.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load questionnaire'} />
      </div>
    );
  }

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Render email collection if first question and email not set
  if (currentQuestionIndex === 0 && !patientEmail) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <h1 className="text-2xl font-bold mb-4">{questionnaire.title}</h1>
          {questionnaire.description && (
            <p className="text-gray-600 mb-6">{questionnaire.description}</p>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Please enter your email address to continue
            </label>
            <input
              type="email"
              id="email"
              value={patientEmail}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Your email will be used to send you your results and for follow-up communications.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setCurrentQuestionIndex(0)}
            disabled={!patientEmail || !/\S+@\S+\.\S+/.test(patientEmail)}
            fullWidth
          >
            Start Questionnaire
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{questionnaire.title}</h1>
          <ProgressBar progress={progress} />
          <p className="text-sm text-gray-500 mt-1">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{currentQuestion.text}</h2>
          {currentQuestion.description && (
            <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
          )}

          {/* Render different input types based on question type */}
          {currentQuestion.type === 'text' && (
            <textarea
              value={answers.find(a => a.question_id === currentQuestion.id)?.value as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter your answer here..."
            />
          )}

          {currentQuestion.type === 'single_choice' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${option.value}`}
                    name={`question-${currentQuestion.id}`}
                    value={option.value}
                    checked={answers.find(a => a.question_id === currentQuestion.id)?.value === option.value.toString()}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`option-${option.value}`} className="ml-2 block text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`option-${option.value}`}
                    name={`question-${currentQuestion.id}`}
                    value={option.value}
                    checked={(answers.find(a => a.question_id === currentQuestion.id)?.value as string[])?.includes(option.value.toString())}
                    onChange={(e) => handleMultipleChoiceChange(currentQuestion.id, e.target.value, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`option-${option.value}`} className="ml-2 block text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'yes_no' && (
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="option-yes"
                  name={`question-${currentQuestion.id}`}
                  value="true"
                  checked={answers.find(a => a.question_id === currentQuestion.id)?.value === 'true'}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="option-yes" className="ml-2 block text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="option-no"
                  name={`question-${currentQuestion.id}`}
                  value="false"
                  checked={answers.find(a => a.question_id === currentQuestion.id)?.value === 'false'}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="option-no" className="ml-2 block text-gray-700">
                  No
                </label>
              </div>
            </div>
          )}

          {currentQuestion.type === 'rating' && (
            <div className="flex space-x-4 justify-center my-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleAnswerChange(currentQuestion.id, rating)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                    answers.find(a => a.question_id === currentQuestion.id)?.value === rating
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'scale' && (
            <div className="my-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Low</span>
                <span className="text-sm text-gray-500">High</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={String(answers.find(a => a.question_id === currentQuestion.id)?.value || 5)}
                onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">1</span>
                <span className="text-sm text-gray-500">10</span>
              </div>
            </div>
          )}

          {currentQuestion.type === 'date' && (
            <input
              type="date"
              value={answers.find(a => a.question_id === currentQuestion.id)?.value as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Submit
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuestionnaireRespondPage;
