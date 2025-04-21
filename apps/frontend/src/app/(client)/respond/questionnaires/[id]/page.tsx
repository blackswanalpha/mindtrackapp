'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Loading, Alert, ProgressBar } from '@/components/common';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, User, Mail, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import responseService from '@/services/responseService';

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

const ClientQuestionnaireRespondPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  // Generate a unique code for the response
  const generateUniqueCode = () => {
    const timestamp = new Date().getTime().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}`;
  };

  // Fetch questionnaire and questions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch questionnaire data
        const questionnaireData = await api.questionnaires.getById(Number(id));
        setQuestionnaire(questionnaireData);

        // Fetch questions for this questionnaire
        const questionsData = await api.questions.getByQuestionnaire(Number(id));
        setQuestions(questionsData);

        // Initialize answers array
        const initialAnswers = questionsData.map((question: Question) => ({
          question_id: question.id,
          value: question.type === 'multiple_choice' ? [] : ''
        }));

        setAnswers(initialAnswers);

        // Set start time when questionnaire loads
        setStartTime(new Date());
      } catch (error) {
        console.error('Error fetching questionnaire data:', error);
        setError('Failed to load questionnaire');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
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
    try {
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

      // Validate all required questions
      const requiredQuestions = questions.filter(q => q.required);
      const unansweredQuestions = [];

      for (const requiredQuestion of requiredQuestions) {
        const answer = answers.find(a => a.question_id === requiredQuestion.id);
        const value = answer?.value;

        if (
          value === '' ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0)
        ) {
          unansweredQuestions.push(requiredQuestion);
        }
      }

      if (unansweredQuestions.length > 0) {
        // Go to the first unanswered question
        const firstUnansweredQuestion = unansweredQuestions[0];
        const questionIndex = questions.findIndex(q => q.id === firstUnansweredQuestion.id);
        setCurrentQuestionIndex(questionIndex);
        setError(`Please answer this required question before submitting`);
        return;
      }

      // Validate email
      if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
        setError('Please enter a valid email address');
        return;
      }

      setIsSubmitting(true);
      setError('');
    } catch (error) {
      console.error('Error in validation:', error);
      setError('An error occurred during validation. Please try again.');
      return;
    }

    try {
      // Calculate completion time in seconds
      let timeInSeconds = 0;
      if (startTime) {
        const endTime = new Date();
        timeInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        setCompletionTime(timeInSeconds);
      }

      // Process answers to calculate scores
      const processedAnswers = answers.map(answer => {
        // Get the question for this answer
        const question = questions.find(q => q.id === answer.question_id);
        let score = 0;

        // Calculate score based on question type and answer value
        if (question && question.type === 'single_choice' && Array.isArray(question.options)) {
          // For single choice questions, the score is the numeric value of the selected option
          const selectedOption = question.options.find(opt =>
            opt.value.toString() === answer.value.toString()
          );
          if (selectedOption) {
            score = Number(selectedOption.value);
          }
        } else if (question && question.type === 'rating') {
          // For rating questions, use the rating value directly
          score = Number(answer.value);
        }

        return {
          question_id: answer.question_id,
          value: answer.value,
          score
        };
      });

      // Calculate total score
      const totalScore = processedAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);

      // Generate a unique code for this response
      const uniqueCode = generateUniqueCode();

      // Prepare response data for the database
      const responseData = {
        email: userEmail,
        name: userName || null,
        score: totalScore,
        answers: processedAnswers.map(answer => ({
          question_id: answer.question_id,
          value: answer.value
        })),
        startTime: startTime?.toISOString(),
        uniqueCode: uniqueCode
      };

      // Validate the response data
      if (!responseData.email) {
        console.error('Email is missing in the response data');
        setError('Email is required');
        setIsSubmitting(false);
        return;
      }

      if (!responseData.answers || !Array.isArray(responseData.answers) || responseData.answers.length === 0) {
        console.error('No valid answers in the response data');
        setError('No valid answers to submit');
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting response data:', responseData);
      console.log('Required questions:', questions.filter(q => q.required).map(q => q.id));
      console.log('Answered questions:', answers.map(a => a.question_id));

      // Save response to database using our service
      const response = await responseService.saveResponse(Number(id), responseData);

      // Get the unique code from the response (use the one from the API if available, otherwise use the generated one)
      const responseUniqueCode = response.unique_code || uniqueCode;

      console.log('Submitted response:', responseData);
      console.log('Response from API:', response);

      // Show success message
      setError('');

      // Redirect to completion page with the unique code and completion time
      router.push(`/questionnaires/complete/${responseUniqueCode}?time=${timeInSeconds}`);
    } catch (error: any) {
      console.error('Error submitting response:', error);

      // Extract more specific error message if available
      let errorMessage = 'Failed to submit response';

      // Use the detailed message if available
      if (error.detailedMessage) {
        errorMessage = error.detailedMessage;
      } else if (error.response && error.response.data) {
        console.log('Error response data:', error.response.data);

        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        // If there are missing required questions, show a more helpful message
        if (error.response.data.missing_questions) {
          const missingQuestions = error.response.data.missing_questions;
          const missingTexts = error.response.data.missing_question_texts || [];

          if (missingTexts.length > 0) {
            errorMessage = `Missing answers for required questions: ${missingTexts.join(', ')}`;
          } else {
            errorMessage = `Missing answers for ${missingQuestions.length} required question(s). Please complete all required questions.`;
          }

          // Go to the first missing question
          if (missingQuestions.length > 0) {
            const firstMissingQuestionId = parseInt(missingQuestions[0]);
            console.log('First missing question ID:', firstMissingQuestionId);
            console.log('Available questions:', questions.map(q => q.id));

            const questionIndex = questions.findIndex(q => q.id === firstMissingQuestionId);
            console.log('Question index:', questionIndex);

            if (questionIndex !== -1) {
              setCurrentQuestionIndex(questionIndex);
            }
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Log all questions and answers for debugging
      console.log('All questions:', questions);
      console.log('All answers:', answers);

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email input handler
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-100"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loading size="large" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Questionnaire</h2>
              <p className="text-gray-600 text-center">Please wait while we prepare your questionnaire...</p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render error state
  if (!questionnaire || !questions.length) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 border-red-200 bg-red-50">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Questionnaire Not Available</h2>
              <p className="text-gray-600 mb-6">{error || 'The requested questionnaire could not be loaded. Please try again later.'}</p>
              <Button
                variant="primary"
                onClick={() => router.push('/')}
                className="w-full sm:w-auto"
              >
                Return to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Render email collection if first question and email not set
  if (currentQuestionIndex === 0 && !userEmail) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 py-8 mb-6 border-b border-blue-100">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{questionnaire.title}</h1>
              {questionnaire.description && (
                <p className="text-gray-600">{questionnaire.description}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                  <p className="text-sm text-gray-500">We'll use this to send your results</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your email will be used to send you your results and for follow-up communications.
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>

            {questionnaire.estimated_time && (
              <div className="mb-6 flex items-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">Estimated time: {questionnaire.estimated_time} minutes</span>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex(0)}
                disabled={!userEmail || !/\S+@\S+\.\S+/.test(userEmail)}
                fullWidth
                className="py-3 text-lg"
              >
                Start Questionnaire
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 py-6 mb-6 border-b border-blue-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{questionnaire.title}</h1>
            <div className="space-y-2">
              <ProgressBar progress={progress} className="h-2 bg-gray-200" progressClassName="bg-blue-600" />
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert type="error" message={error} className="mb-4" />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
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
                  {Array.isArray(currentQuestion.options) ? currentQuestion.options.map((option) => (
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
                  )) : <p className="text-gray-500">No options available</p>}
                </div>
              )}

              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {Array.isArray(currentQuestion.options) ? currentQuestion.options.map((option) => (
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
                  )) : <p className="text-gray-500">No options available</p>}
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
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                className="flex items-center"
              >
                Submit
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClientQuestionnaireRespondPage;
