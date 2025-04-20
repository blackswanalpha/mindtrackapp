'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/common';
import {
  ArrowLeft,
  Flag,
  Download,
  Mail,
  Clock,
  Calendar,
  User,
  FileText,
  BarChart3,
  Brain,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Send
} from 'lucide-react';
import api from '@/services/api';

type Response = {
  id: number;
  questionnaire_id: number;
  patient_email: string;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  score?: number;
  risk_level?: string;
  flagged_for_review: boolean;
  completed_at: string;
  created_at: string;
  completion_time?: number;
  unique_code: string;
  answers: Answer[];
};

type Answer = {
  id: number;
  response_id: number;
  question_id: number;
  value: string | number | boolean | string[];
  score?: number;
  question?: {
    id: number;
    text: string;
    type: string;
  };
};

type Questionnaire = {
  id: number;
  title: string;
  description?: string;
  type: string;
  category?: string;
};

type AIAnalysis = {
  id: number;
  response_id: number;
  created_at: string;
  model: string;
  analysis: {
    summary: string;
    risk_assessment: string;
    recommendations: string[];
    key_concerns: string[];
    potential_triggers: string;
  };
};

const ResponseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [response, setResponse] = useState<Response | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchResponseData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        if (typeof window !== 'undefined') {
          const responseData = await api.responses.getWithAnswers(Number(id));
          setResponse(responseData.response);

          // Get questionnaire details
          if (responseData.response.questionnaire_id) {
            const questionnaireData = await api.questionnaires.getById(responseData.response.questionnaire_id);
            setQuestionnaire(questionnaireData);
          }

          // Try to get AI analysis if it exists
          try {
            const analysisData = await api.aiAnalysis.getByResponse(Number(id));
            setAnalysis(analysisData);
          } catch (err) {
            // Analysis might not exist yet, that's okay
            console.log('No analysis found for this response');
          }
        }
      } catch (err) {
        setError('Failed to load response data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchResponseData();
    }
  }, [id]);

  const handleGenerateAnalysis = async () => {
    if (!response) return;

    setIsAnalysisLoading(true);

    try {
      const analysisData = await api.aiAnalysis.generate(response.id);
      setAnalysis(analysisData);
    } catch (err) {
      setError('Failed to generate AI analysis');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleToggleFlag = async () => {
    if (!response) return;

    try {
      const updatedResponse = await api.responses.flag(response.id, !response.flagged_for_review);
      setResponse(updatedResponse);
    } catch (err) {
      setError('Failed to update flag status');
    }
  };

  const handleSendEmail = () => {
    // Navigate to the email page
    router.push(`/admin/responses/${id}/email`);
  };

  const formatAnswerValue = (answer: Answer) => {
    const { value, question } = answer;

    if (!question) return String(value);

    if (question.type === 'single_choice') {
      // In a real implementation, we would look up the option label
      return `Option ${value}`;
    }

    if (question.type === 'multiple_choice' && Array.isArray(value)) {
      // In a real implementation, we would look up the option labels
      return value.map(v => `Option ${v}`).join(', ');
    }

    return String(value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading response data..." />
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
      <div className="flex items-center mb-6">
        <Link href="/responses" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Response Details</h1>
          <p className="text-gray-600">
            {questionnaire?.title || 'Questionnaire'} - {response.unique_code}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold">Response Summary</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={response.flagged_for_review ? 'danger' : 'light'}
                      size="small"
                      onClick={handleToggleFlag}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      {response.flagged_for_review ? 'Unflag' : 'Flag for Review'}
                    </Button>
                    <Button
                      variant="light"
                      size="small"
                      onClick={() => {/* Download functionality */}}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Patient Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {response.patient_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600">{response.patient_email}</p>
                        </div>
                      </div>

                      {(response.patient_age || response.patient_gender) && (
                        <div className="flex items-center">
                          <div className="ml-7 text-sm text-gray-600">
                            {response.patient_age && `Age: ${response.patient_age}`}
                            {response.patient_age && response.patient_gender && ' • '}
                            {response.patient_gender && `Gender: ${response.patient_gender.charAt(0).toUpperCase() + response.patient_gender.slice(1)}`}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <Button
                          variant="light"
                          size="small"
                          className="p-0 h-auto text-blue-600"
                          onClick={handleSendEmail}
                        >
                          Send Email to Patient
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Response Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-600">
                          Submitted on {new Date(response.completed_at).toLocaleDateString()} at {new Date(response.completed_at).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-600">
                          Completion time: {response.completion_time ? `${Math.floor(response.completion_time / 60)}m ${response.completion_time % 60}s` : 'N/A'}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-600">
                          Questionnaire: {questionnaire?.title || 'Unknown'}
                        </div>
                      </div>

                      {response.score !== undefined && (
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-600">
                            Score: <span className="font-medium">{response.score}</span>
                            {response.risk_level && (
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                response.risk_level === 'minimal' ? 'bg-green-100 text-green-800' :
                                response.risk_level === 'mild' ? 'bg-blue-100 text-blue-800' :
                                response.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)} Risk
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {response.flagged_for_review && (
                  <div className="mb-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            This response has been flagged for review. Please check the answers and AI analysis carefully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Summary</h3>

                  {analysis ? (
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-blue-800">{analysis.analysis.summary}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-600">No AI analysis available. Generate an analysis to get insights about this response.</p>
                      <Button
                        variant="light"
                        size="small"
                        className="mt-2"
                        onClick={() => setActiveTab('analysis')}
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        View Analysis Tab
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="answers">
              <Card>
                <h2 className="text-xl font-semibold mb-6">Patient Answers</h2>

                <div className="space-y-6">
                  {response.answers.map((answer) => (
                    <div key={answer.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {answer.question?.text || `Question ${answer.question_id}`}
                      </h3>

                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">{formatAnswerValue(answer)}</p>
                      </div>

                      {answer.score !== undefined && (
                        <div className="mt-2 flex items-center">
                          <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">Score: {answer.score}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold">AI Analysis</h2>

                  {!analysis && !isAnalysisLoading && (
                    <Button
                      variant="primary"
                      onClick={handleGenerateAnalysis}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Analysis
                    </Button>
                  )}
                </div>

                {isAnalysisLoading ? (
                  <div className="py-8 text-center">
                    <Loading size="large" message="Generating AI analysis..." />
                    <p className="text-gray-500 mt-4">This may take a few moments...</p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
                      <p className="text-gray-700">{analysis.analysis.summary}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Risk Assessment</h3>
                      <div className={`p-4 rounded ${
                        response.risk_level === 'severe' || response.risk_level === 'moderately severe'
                          ? 'bg-red-50 border-l-4 border-red-500'
                          : response.risk_level === 'moderate'
                          ? 'bg-yellow-50 border-l-4 border-yellow-500'
                          : 'bg-blue-50 border-l-4 border-blue-500'
                      }`}>
                        <p className="text-gray-700">{analysis.analysis.risk_assessment}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Key Concerns</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.analysis.key_concerns.map((concern, index) => (
                          <li key={index} className="text-gray-700">{concern}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-gray-700">{recommendation}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Potential Triggers</h3>
                      <p className="text-gray-700">{analysis.analysis.potential_triggers}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Brain className="h-4 w-4 mr-1" />
                          <span>Generated by {analysis.model} on {new Date(analysis.created_at).toLocaleString()}</span>
                        </div>

                        <Button
                          variant="light"
                          size="small"
                          onClick={handleGenerateAnalysis}
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No AI Analysis Available</h3>
                    <p className="text-gray-500 mb-6">
                      Generate an AI analysis to get insights about this response.
                    </p>
                    <Button
                      variant="primary"
                      onClick={handleGenerateAnalysis}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Analysis
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-1/3">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>

            <div className="space-y-4">
              <Button
                variant="light"
                className="w-full justify-start"
                onClick={handleSendEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email to Patient
              </Button>

              <Button
                variant={response.flagged_for_review ? 'danger' : 'light'}
                className="w-full justify-start"
                onClick={handleToggleFlag}
              >
                <Flag className="h-4 w-4 mr-2" />
                {response.flagged_for_review ? 'Remove Flag' : 'Flag for Review'}
              </Button>

              <Button
                variant="light"
                className="w-full justify-start"
                onClick={() => {/* Download functionality */}}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Response
              </Button>

              {!analysis && (
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={handleGenerateAnalysis}
                  disabled={isAnalysisLoading}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalysisLoading ? 'Generating...' : 'Generate AI Analysis'}
                </Button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Add Note</h3>

              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows={3}
                placeholder="Add a note about this response..."
              ></textarea>

              <Button variant="light" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>

            {questionnaire && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Questionnaire Info</h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Title</h4>
                    <p className="text-gray-700">{questionnaire.title}</p>
                  </div>

                  {questionnaire.type && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Type</h4>
                      <p className="text-gray-700">{questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}</p>
                    </div>
                  )}

                  {questionnaire.category && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <p className="text-gray-700">{questionnaire.category}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      variant="light"
                      size="small"
                      className="w-full"
                      onClick={() => router.push(`/questionnaires/${questionnaire.id}`)}
                    >
                      View Questionnaire
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResponseDetailPage;
