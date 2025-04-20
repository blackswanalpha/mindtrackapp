'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import {
  Card,
  Button,
  Loading,
  Alert,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/common';
import {
  ArrowLeft,
  Mail,
  Download,
  Flag,
  Brain,
  Printer,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import AIAnalysisSection from '@/components/ai/AIAnalysisSection';

const ResponseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const responseId = Number(id);

  const [response, setResponse] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  useEffect(() => {
    const fetchResponseWithAnswers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const responseData = await api.responses.getWithAnswers(responseId);

        // Mock response data
        const mockResponse = {
          id: responseId,
          questionnaire_id: 1,
          questionnaire_title: 'Depression Assessment (PHQ-9)',
          patient_email: 'patient@example.com',
          patient_name: 'John Doe',
          patient_age: 35,
          patient_gender: 'Male',
          score: 14,
          risk_level: 'moderate',
          flagged_for_review: true,
          completed_at: '2023-04-15T10:30:00Z',
          created_at: '2023-04-15T10:20:00Z',
          completion_time: 580, // seconds
          unique_code: `RESP-${id}`
        };

        // Mock answers data
        const mockAnswers = [
          {
            id: 1,
            question: { id: 1, text: 'Little interest or pleasure in doing things', type: 'single_choice' },
            value: 'More than half the days',
            score: 2
          },
          {
            id: 2,
            question: { id: 2, text: 'Feeling down, depressed, or hopeless', type: 'single_choice' },
            value: 'Nearly every day',
            score: 3
          },
          {
            id: 3,
            question: { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much', type: 'single_choice' },
            value: 'More than half the days',
            score: 2
          },
          {
            id: 4,
            question: { id: 4, text: 'Feeling tired or having little energy', type: 'single_choice' },
            value: 'Nearly every day',
            score: 3
          },
          {
            id: 5,
            question: { id: 5, text: 'Poor appetite or overeating', type: 'single_choice' },
            value: 'Several days',
            score: 1
          },
          {
            id: 6,
            question: { id: 6, text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down', type: 'single_choice' },
            value: 'More than half the days',
            score: 2
          },
          {
            id: 7,
            question: { id: 7, text: 'Trouble concentrating on things, such as reading the newspaper or watching television', type: 'single_choice' },
            value: 'Several days',
            score: 1
          },
          {
            id: 8,
            question: { id: 8, text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual', type: 'single_choice' },
            value: 'Not at all',
            score: 0
          },
          {
            id: 9,
            question: { id: 9, text: 'Thoughts that you would be better off dead, or of hurting yourself in some way', type: 'single_choice' },
            value: 'Not at all',
            score: 0
          }
        ];

        setResponse(mockResponse);
        setAnswers(mockAnswers);

        // Check if AI analysis exists in localStorage
        const existingAnalysis = localStorage.getItem(`ai-analysis-${id}`);
        if (existingAnalysis) {
          setAiAnalysis(JSON.parse(existingAnalysis));
        }
      } catch (err) {
        setError('Failed to fetch response details');
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId) {
      fetchResponseWithAnswers();
    }
  }, [responseId, id]);

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };

  // Get risk level class
  const getRiskLevelClass = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';

    switch (level.toLowerCase()) {
      case 'minimal':
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'mild':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle flag for review
  const handleFlag = async () => {
    try {
      // In a real implementation, this would call the API
      // await api.responses.flag(responseId, !response.flagged_for_review);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update response in state
      setResponse((prev: any) => prev ? { ...prev, flagged_for_review: !prev.flagged_for_review } : null);

      alert(`Response ${!response.flagged_for_review ? 'flagged' : 'unflagged'} successfully`);
    } catch (err) {
      setError('Failed to update flag status');
    }
  };

  // Generate AI analysis
  const generateAnalysis = async () => {
    setIsGeneratingAnalysis(true);

    try {
      // In a real implementation, this would call the API
      // const result = await api.aiAnalysis.generate(responseId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI analysis
      const mockAnalysis = {
        id: Date.now(),
        response_id: responseId,
        created_at: new Date().toISOString(),
        model: 'gpt-4',
        analysis: {
          summary: "The patient is experiencing moderate to severe depression symptoms, particularly in areas of mood, energy, and self-perception. The PHQ-9 score of 14 indicates moderately severe depression that warrants clinical attention.",
          risk_assessment: "The patient does not report active suicidal ideation, which is a positive sign. However, the overall symptom severity suggests significant distress that could potentially worsen without intervention.",
          recommendations: [
            "Consider referral to a mental health professional for comprehensive evaluation",
            "Screening for comorbid anxiety may be beneficial given the sleep disturbances and concentration difficulties",
            "Regular follow-up to monitor symptom progression is recommended",
            "Psychoeducation about depression and self-care strategies would be helpful"
          ],
          key_concerns: [
            "Persistent depressed mood nearly every day",
            "Significant fatigue and energy loss",
            "Sleep disturbances",
            "Negative self-perception",
            "Reduced concentration"
          ],
          potential_triggers: "While not explicitly stated, the pattern of symptoms suggests possible stressors related to self-worth and performance expectations. Further exploration of work, relationship, or health-related stressors would be valuable."
        }
      };

      setAiAnalysis(mockAnalysis);

      // Store in localStorage for persistence
      localStorage.setItem(`ai-analysis-${id}`, JSON.stringify(mockAnalysis));

      // Switch to AI analysis tab
      setActiveTab('ai-analysis');
    } catch (err) {
      setError('Failed to generate AI analysis');
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading response details..." />
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load response'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push('/responses')}>
            Back to Responses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/responses" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Response Details</h1>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelClass(response.risk_level)}`}>
              {response.risk_level ? response.risk_level.toUpperCase() : 'NO RISK LEVEL'}
            </span>
            {response.flagged_for_review && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Flagged for Review
              </span>
            )}
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Score: {response.score || 'N/A'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="light"
              size="small"
              onClick={handleFlag}
            >
              <Flag className={`h-4 w-4 mr-2 ${response.flagged_for_review ? 'text-red-500' : ''}`} />
              {response.flagged_for_review ? 'Remove Flag' : 'Flag for Review'}
            </Button>
            <Button
              variant="light"
              size="small"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="light"
              size="small"
              onClick={() => {/* Email functionality */}}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={generateAnalysis}
              disabled={isGeneratingAnalysis || !!aiAnalysis}
            >
              <Brain className="h-4 w-4 mr-2" />
              {aiAnalysis ? 'View AI Analysis' : 'Generate AI Analysis'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Response Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Questionnaire</h3>
                    <p className="mt-1 text-gray-800">
                      <Link href={`/questionnaires/${response.questionnaire_id}`} className="text-blue-600 hover:text-blue-800">
                        {response.questionnaire_title}
                      </Link>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Unique Code</h3>
                    <p className="mt-1 text-gray-800 font-mono">{response.unique_code}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Completed At</h3>
                    <p className="mt-1 text-gray-800">
                      {new Date(response.completed_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Completion Time</h3>
                    <p className="mt-1 text-gray-800">
                      {response.completion_time ? formatTime(response.completion_time) : 'Not recorded'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Score</h3>
                    <p className="mt-1 text-gray-800 font-semibold">{response.score || 'Not scored'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
                    <p className={`mt-1 font-semibold ${
                      response.risk_level === 'low' ? 'text-green-600' :
                      response.risk_level === 'moderate' ? 'text-yellow-600' :
                      response.risk_level === 'high' ? 'text-red-600' : 'text-gray-800'
                    }`}>
                      {response.risk_level ? response.risk_level.toUpperCase() : 'Not assessed'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <h2 className="text-xl font-semibold mb-4">Respondent Information</h2>

                <div className="space-y-4">
                  {response.patient_name && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="text-gray-800">{response.patient_name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-gray-800">{response.patient_email}</p>
                    </div>
                  </div>

                  {response.patient_age && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Age</h3>
                        <p className="text-gray-800">{response.patient_age} years</p>
                      </div>
                    </div>
                  )}

                  {response.patient_gender && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                        <p className="text-gray-800">{response.patient_gender}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                      <p className="text-gray-800">{new Date(response.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="light"
                      size="small"
                      fullWidth
                      onClick={() => {/* Email functionality */}}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email to Respondent
                    </Button>
                    <Button
                      variant="light"
                      size="small"
                      fullWidth
                      onClick={() => {/* Share functionality */}}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Answers Tab */}
        <TabsContent value="answers">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Answers</h2>

            <div className="space-y-6">
              {answers.map((answer) => (
                <div key={answer.id} className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-800">{answer.question.text}</h3>
                  <p className="text-gray-600 mt-2">{answer.value}</p>
                  {answer.score !== undefined && (
                    <div className="mt-1 text-sm text-gray-500">
                      Score: <span className="font-medium">{answer.score}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Total Score</h3>
                  <p className="text-gray-600 mt-1">Based on questionnaire scoring rules</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">{response.score || 'N/A'}</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis">
          {isGeneratingAnalysis ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-12">
                <Loading size="large" message="Generating AI analysis..." />
                <p className="text-gray-500 mt-4">
                  This may take a moment as our AI analyzes the response data
                </p>
              </div>
            </Card>
          ) : aiAnalysis ? (
            <AIAnalysisSection analysis={aiAnalysis} />
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No AI Analysis Available</h3>
                <p className="text-gray-500 max-w-md mx-auto text-center mb-6">
                  Generate an AI analysis to get insights, risk assessment, and recommendations based on this response.
                </p>
                <Button
                  variant="primary"
                  onClick={generateAnalysis}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Analysis
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseDetailPage;
