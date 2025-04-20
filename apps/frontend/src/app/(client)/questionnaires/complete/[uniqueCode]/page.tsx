'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Loading, Alert } from '@/components/common';
import { CheckCircle, Clock, Mail, Download, Share2, AlertTriangle } from 'lucide-react';
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
        const responseData = await api.responses.getByUniqueCode(uniqueCode as string);

        if (!responseData) {
          setError(`Response with code ${uniqueCode} not found. Please check the URL and try again.`);
          setIsLoading(false);
          return;
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

Score: ${response.score}
Risk Level: ${response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
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
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading results..." />
      </div>
    );
  }

  // Render error state
  if (error || !response) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Results</h2>
            <p className="text-gray-600">{error || 'Failed to load questionnaire results. Please check the URL and try again.'}</p>
          </div>

          <div className="flex justify-center">
            <Link href="/">
              <Button variant="primary">
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Questionnaire Completed</h1>
          <p className="text-gray-600 mt-2">
            Thank you for completing the {questionnaire.title}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">
              Completion Time: {completionTime ? formatTime(parseInt(completionTime)) : 'Not recorded'}
            </span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">
              Results sent to: {response.user_email}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Your Responses</h2>
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.question_id} className="border-b border-gray-200 pb-3">
                <h3 className="font-medium text-gray-800">{answer.question_text}</h3>
                <p className="text-gray-600 mt-1">{answer.display_value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Results Summary</h2>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-700 mb-1">Your Score</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-800">{response.score}</span>
                <span className="ml-2 text-sm text-blue-600">/ {answers.reduce((total, answer) => total + (answer.score || 0), 0)}</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-700 mb-1">Risk Level</h3>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                ${response.risk_level === 'minimal' || response.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                  response.risk_level === 'mild' || response.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  response.risk_level === 'moderately severe' || response.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'}
              `}>
                {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <h3 className="text-sm font-medium text-blue-700 mb-2">What This Means</h3>
            <p className="text-sm text-blue-600">
              {response.risk_level === 'minimal' || response.risk_level === 'low' ?
                'Your responses indicate minimal to low levels of concern. Continue with self-care practices and monitor your well-being.' :
                response.risk_level === 'mild' || response.risk_level === 'moderate' ?
                'Your responses indicate mild to moderate levels of concern. Consider discussing these results with a healthcare provider.' :
                'Your responses indicate significant levels of concern. We recommend consulting with a healthcare professional for further evaluation and support.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleDownload}
            className="flex items-center justify-center"
            fullWidth
          >
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
          <Button
            variant="secondary"
            onClick={handleShare}
            className="flex items-center justify-center"
            fullWidth
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default QuestionnaireCompletePage;
