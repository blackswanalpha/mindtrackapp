'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Loading, Alert } from '@/components/common';
import { CheckCircle, Clock, Mail, Download, Share2, AlertTriangle, ChevronDown, ChevronUp, BarChart3, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

const QuestionnaireCompletePage = () => {
  const { uniqueCode } = useParams();
  const searchParams = useSearchParams();
  const completionTime = searchParams.get('time');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResponses, setShowResponses] = useState(false);

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };

  // Fetch response data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch response by unique code
        console.log('Fetching response with unique code:', uniqueCode);
        const result = await api.responses.getByUniqueCode(uniqueCode as string);
        console.log('Fetched response data:', result);

        if (!result || !result.response) {
          setError(`Response with code ${uniqueCode} not found. Please check the URL and try again.`);
          setIsLoading(false);
          return;
        }

        // Extract the response from the API result
        const responseData = result.response;
        console.log('Extracted response data:', responseData);

        // If response doesn't have a score, calculate it
        if (responseData.score === undefined || responseData.score === null) {
          console.log('Response has no score, calculating...');
          try {
            const scoringResult = await api.scoring.calculateScore(responseData.id);
            console.log('Calculated score:', scoringResult);
            responseData.score = scoringResult.response.score;
            responseData.risk_level = scoringResult.response.risk_level;
          } catch (err) {
            console.error('Error calculating score:', err);
          }
        }

        // Fetch questionnaire data
        const questionnaireData = await api.questionnaires.getById(responseData.questionnaire_id);

        if (!questionnaireData) {
          setError('Questionnaire not found');
          setIsLoading(false);
          return;
        }

        // Fetch questions for this questionnaire
        const questions = await api.questions.getByQuestionnaire(responseData.questionnaire_id);

        // Process answers with question text
        const processedAnswers = responseData.answers.map((answer: any) => {
          const question = questions.find((q: any) => q.id === answer.question_id);
          let displayValue = answer.value;

          // Format display value based on question type
          if (question) {
            if (question.type === 'single_choice' && question.options) {
              const option = question.options.find((opt: any) => opt.value.toString() === answer.value.toString());
              if (option) displayValue = option.label;
            } else if (question.type === 'multiple_choice' && question.options && Array.isArray(answer.value)) {
              const selectedOptions = question.options.filter((opt: any) =>
                answer.value.includes(opt.value.toString())
              );
              displayValue = selectedOptions.map((opt: any) => opt.label).join(', ');
            } else if (question.type === 'rating') {
              displayValue = `${answer.value} out of 5`;
            }

            return {
              question_id: answer.question_id,
              question_text: question.text,
              value: answer.value,
              display_value: displayValue,
              score: answer.score
            };
          }

          return {
            question_id: answer.question_id,
            question_text: 'Unknown Question',
            value: answer.value,
            display_value: displayValue,
            score: answer.score
          };
        });

        setResponse(responseData);
        setQuestionnaire(questionnaireData);
        setAnswers(processedAnswers);
      } catch (error) {
        console.error('Error fetching response data:', error);
        setError('Failed to load response data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (uniqueCode) {
      fetchData();
    } else {
      setError('Invalid response code');
      setIsLoading(false);
    }
  }, [uniqueCode]);

  // Handle download results
  const handleDownload = () => {
    // Create a text representation of the results
    const resultsText = `
${questionnaire.title} - Results
Unique Code: ${uniqueCode}
Completion Time: ${completionTime ? formatTime(parseInt(completionTime)) : 'Not recorded'}
Date: ${new Date().toLocaleDateString()}

Answers:
${answers.map(a => `${a.question_text}: ${a.display_value}`).join('\n')}

${response.score !== undefined && response.score !== null ? `Score: ${response.score}` : 'Score: Not calculated'}
${response.risk_level ? `Risk Level: ${response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}` : 'Risk Level: Not available'}
    `.trim();

    // Create a blob and download link
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questionnaire-results-${uniqueCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle share results
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${questionnaire.title} Results`,
        text: `My results for ${questionnaire.title}. Unique code: ${uniqueCode}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Copy this link to share your results: ' + window.location.href);
    }
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Results</h2>
              <p className="text-gray-600 text-center">Please wait while we retrieve your questionnaire results...</p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render error state
  if (error || !response) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <div className="mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <AlertTriangle className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Results</h2>
              <p className="text-gray-600">{error || 'Failed to load questionnaire results. Please check the URL and try again.'}</p>
            </div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/">
                <Button variant="primary" className="px-6 py-3">
                  Return to Home
                </Button>
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-lg border border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 -mx-6 -mt-6 px-6 py-8 mb-6 border-b border-green-100 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-md rounded-full mb-4"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">Questionnaire Completed</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Thank you for completing the {questionnaire.title}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="bg-gray-50 rounded-lg p-5 mb-6 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Completion Time</div>
                <div className="font-medium text-gray-800">
                  {completionTime ? formatTime(parseInt(completionTime)) : 'Not recorded'}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Results Sent To</div>
                <div className="font-medium text-gray-800 truncate max-w-[200px]">
                  {response.patient_email || response.user_email || 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Your Responses</h2>
            <button
              onClick={() => setShowResponses(!showResponses)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              {showResponses ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Responses
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show Responses
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showResponses && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer.question_id}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <h3 className="font-medium text-gray-800">{answer.question_text}</h3>
                    <p className="text-gray-600 mt-2 bg-gray-50 p-3 rounded">{answer.display_value}</p>
                    {answer.score !== undefined && answer.score !== null && (
                      <div className="mt-2 text-sm text-right">
                        <span className="text-gray-500">Score: </span>
                        <span className="font-medium text-blue-600">{answer.score}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 shadow-sm border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-800">Results Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <h3 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-700 text-xs font-bold">S</span>
                </span>
                Your Score
              </h3>
              {response.score !== undefined && response.score !== null ? (
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-blue-800">{response.score}</span>
                  <span className="ml-2 text-sm text-blue-600">/ {answers.reduce((total, answer) => total + (answer.score || 0), 0)}</span>
                </div>
              ) : (
                <div className="text-gray-500 italic">Not calculated</div>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <h3 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-700 text-xs font-bold">R</span>
                </span>
                Risk Level
              </h3>
              {response.risk_level ? (
                <div className="flex items-center">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium capitalize
                    ${response.risk_level === 'minimal' || response.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                      response.risk_level === 'mild' || response.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      response.risk_level === 'moderately severe' || response.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Not Available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-blue-700 text-xs font-bold">i</span>
              </span>
              What This Means
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {!response.risk_level ?
                'Thank you for completing this questionnaire. Your responses have been recorded.' :
                response.risk_level === 'minimal' || response.risk_level === 'low' ?
                'Your responses indicate minimal to low levels of concern. Continue with self-care practices and monitor your well-being.' :
                response.risk_level === 'mild' || response.risk_level === 'moderate' ?
                'Your responses indicate mild to moderate levels of concern. Consider discussing these results with a healthcare provider.' :
                'Your responses indicate significant levels of concern. We recommend consulting with a healthcare professional for further evaluation and support.'}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            variant="secondary"
            onClick={handleDownload}
            className="flex items-center justify-center py-3 transition-all hover:shadow-md"
            fullWidth
          >
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
          <Button
            variant="secondary"
            onClick={handleShare}
            className="flex items-center justify-center py-3 transition-all hover:shadow-md"
            fullWidth
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuestionnaireCompletePage;
