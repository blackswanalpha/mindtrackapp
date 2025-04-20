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
  Save,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  User,
  Mail,
  Calendar,
  Clock
} from 'lucide-react';
import api from '@/services/api';

type Answer = {
  id: number;
  response_id: number;
  question_id: number;
  value: string | number | boolean | string[];
  score?: number;
};

type Question = {
  id: number;
  questionnaire_id: number;
  text: string;
  description?: string;
  type: string;
  required: boolean;
  order_num: number;
  options?: Array<{ value: number; label: string }>;
  scoring_weight: number;
};

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

type Questionnaire = {
  id: number;
  title: string;
  description: string;
  instructions: string;
  type: string;
  category: string;
  estimated_time: number;
  is_active: boolean;
  is_qr_enabled: boolean;
  is_public: boolean;
  allow_anonymous: boolean;
  requires_auth: boolean;
  created_at: string;
  organization_id: number;
};

type ScoringRange = {
  min: number;
  max: number;
  label: string;
  risk_level: string;
  color: string;
  description: string;
};

type ScoringSystem = {
  id: number;
  name: string;
  description: string;
  questionnaire_type: string;
  ranges: ScoringRange[];
  formula: string;
  created_at: string;
  updated_at?: string;
  created_by: {
    id: number;
    name: string;
  };
  questionnaire_count: number;
  is_default: boolean;
};

const ResponseScoringDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const responseId = Number(params.id);

  const [response, setResponse] = useState<Response | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [manualScore, setManualScore] = useState<number | null>(null);
  const [manualRiskLevel, setManualRiskLevel] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('scoring');
  const [answerScores, setAnswerScores] = useState<Record<number, number>>({});

  // Fetch response data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch response data
        const responseData = await api.responses.getById(responseId);
        setResponse(responseData);

        // Fetch questionnaire data
        const questionnaireData = await api.questionnaires.getById(responseData.questionnaire_id);
        setQuestionnaire(questionnaireData);

        // Fetch questions
        const questionsData = await api.questions.getByQuestionnaire(responseData.questionnaire_id);
        setQuestions(questionsData);

        // Set manual score to current score
        if (responseData.score !== undefined) {
          setManualScore(responseData.score);
        }

        if (responseData.risk_level) {
          setManualRiskLevel(responseData.risk_level);
        }

        // Initialize answer scores
        const initialAnswerScores: Record<number, number> = {};
        responseData.answers.forEach((answer: Answer) => {
          if (answer.score !== undefined) {
            initialAnswerScores[answer.question_id] = answer.score;
          }
        });
        setAnswerScores(initialAnswerScores);

        // Mock scoring system for now
        // In a real implementation, this would be fetched from the API
        setScoringSystem({
          id: 1,
          name: 'PHQ-9 Depression Scoring',
          description: 'Standard scoring system for the PHQ-9 depression assessment',
          questionnaire_type: 'depression',
          ranges: [
            { min: 0, max: 4, label: 'Minimal', risk_level: 'minimal', color: '#4ade80', description: 'Minimal depression' },
            { min: 5, max: 9, label: 'Mild', risk_level: 'mild', color: '#a3e635', description: 'Mild depression' },
            { min: 10, max: 14, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate depression' },
            { min: 15, max: 19, label: 'Moderately Severe', risk_level: 'moderately severe', color: '#f97316', description: 'Moderately severe depression' },
            { min: 20, max: 27, label: 'Severe', risk_level: 'severe', color: '#ef4444', description: 'Severe depression' }
          ],
          formula: 'SUM(q1:q9)',
          created_at: '2023-01-15T10:30:00Z',
          created_by: {
            id: 101,
            name: 'John Doe'
          },
          questionnaire_count: 5,
          is_default: true
        });

      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load response data');
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId) {
      fetchData();
    }
  }, [responseId]);

  // Handle recalculate score
  const handleRecalculateScore = async () => {
    setIsRecalculating(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the API to recalculate the score
      const result = await api.scoring.calculateScore(responseId);

      // Update response with new score
      if (result && result.response) {
        setResponse(result.response);
        setManualScore(result.response.score || 0);
        setManualRiskLevel(result.response.risk_level || 'minimal');

        // Update answer scores
        if (result.scoring && result.scoring.answer_scores) {
          const initialAnswerScores: Record<number, number> = {};
          result.response.answers.forEach((answer: Answer) => {
            if (answer.score !== undefined) {
              initialAnswerScores[answer.question_id] = answer.score;
            }
          });
          setAnswerScores(initialAnswerScores);
        }
      }

      setSuccess('Score recalculated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to recalculate score');
    } finally {
      setIsRecalculating(false);
    }
  };

  // Handle save manual score
  const handleSaveManualScore = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (manualScore === null || !manualRiskLevel) {
        throw new Error('Score and risk level are required');
      }

      // Call the API to update the score
      const updatedResponse = await api.scoring.updateScore(responseId, manualScore, manualRiskLevel);

      // Update response with new score
      if (updatedResponse) {
        setResponse(updatedResponse);
      }

      setSuccess('Score updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update score');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update answer score
  const handleUpdateAnswerScore = (questionId: number, score: number) => {
    setAnswerScores(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  // Handle save answer scores
  const handleSaveAnswerScores = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the API to update answer scores
      const result = await api.scoring.updateAnswerScores(responseId, answerScores);

      // Update response with new answer scores and recalculated total score
      if (result && result.response) {
        setResponse(result.response);
        setManualScore(result.response.score || 0);
        setManualRiskLevel(result.response.risk_level || 'minimal');
      }

      setSuccess('Answer scores updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update answer scores');
    } finally {
      setIsLoading(false);
    }
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel: string) => {
    const range = scoringSystem?.ranges.find(r => r.risk_level === riskLevel);
    return range?.color || '#9ca3af'; // Default gray
  };

  // Get risk level description
  const getRiskLevelDescription = (riskLevel: string) => {
    const range = scoringSystem?.ranges.find(r => r.risk_level === riskLevel);
    return range?.description || 'No description available';
  };

  // Get recommendations based on risk level
  const getRecommendations = (riskLevel: string) => {
    switch (riskLevel) {
      case 'minimal':
        return 'Continue with self-care practices and monitor for any changes in symptoms.';
      case 'mild':
        return 'Consider discussing symptoms with a healthcare provider. Self-help strategies may be beneficial.';
      case 'moderate':
        return 'Consultation with a healthcare provider is recommended. Treatment options may include therapy or medication.';
      case 'moderately severe':
        return 'Prompt consultation with a healthcare provider is strongly recommended. Treatment is likely necessary.';
      case 'severe':
        return 'Immediate consultation with a healthcare provider is necessary. Active treatment with a combination of medication and therapy is typically indicated.';
      default:
        return 'Please consult with a healthcare provider for personalized recommendations.';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate completion time
  const formatCompletionTime = (seconds?: number) => {
    if (!seconds) return 'N/A';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  // Render question value
  const renderQuestionValue = (question: Question, answer: Answer) => {
    const value = answer.value;

    switch (question.type) {
      case 'single_choice':
        if (question.options) {
          const option = question.options.find(opt => opt.value === value);
          return option ? option.label : value;
        }
        return value;

      case 'multiple_choice':
        if (question.options && Array.isArray(value)) {
          return (value as unknown as number[])
            .map(v => question.options?.find(opt => opt.value === v)?.label || v)
            .join(', ');
        }
        return value;

      case 'text':
      case 'textarea':
        return value;

      default:
        return JSON.stringify(value);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading response data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!response || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="Response or questionnaire not found" />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/scoring/responses" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Response Scoring</h1>
          <p className="text-gray-600">
            {questionnaire.title} - Response #{response.id}
          </p>
        </div>
      </div>

      {success && (
        <Alert type="success" message={success} className="mb-6" />
      )}

      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="scoring">Scoring</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="scoring">
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Scoring Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Current Score</h3>
                      <div className="flex items-center">
                        <div className="text-4xl font-bold mr-4">{response.score || 0}</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize`}
                          style={{ backgroundColor: `${getRiskLevelColor(response.risk_level || 'minimal')}20`,
                                  color: getRiskLevelColor(response.risk_level || 'minimal') }}>
                          {response.risk_level || 'Not scored'}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">
                        {getRiskLevelDescription(response.risk_level || 'minimal')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Manual Scoring</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <label htmlFor="manual-score" className="block text-sm font-medium text-gray-700 mb-1">
                            Score
                          </label>
                          <input
                            id="manual-score"
                            type="number"
                            min="0"
                            max={scoringSystem?.ranges.reduce((max, range) => Math.max(max, range.max), 0) || 27}
                            value={manualScore || 0}
                            onChange={(e) => setManualScore(Number(e.target.value))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="manual-risk-level" className="block text-sm font-medium text-gray-700 mb-1">
                            Risk Level
                          </label>
                          <select
                            id="manual-risk-level"
                            value={manualRiskLevel || ''}
                            onChange={(e) => setManualRiskLevel(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {scoringSystem?.ranges.map((range) => (
                              <option key={range.risk_level} value={range.risk_level}>
                                {range.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          onClick={handleSaveManualScore}
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Score
                        </Button>

                        <Button
                          variant="light"
                          onClick={handleRecalculateScore}
                          disabled={isRecalculating}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isRecalculating ? 'animate-spin' : ''}`} />
                          Recalculate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Scoring Ranges</h3>
                  <div className="space-y-2">
                    {scoringSystem?.ranges.map((range) => (
                      <div key={range.label} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: range.color }}
                        ></div>
                        <div className="text-sm">
                          <span className="font-medium">{range.label}</span>
                          <span className="text-gray-500 ml-2">({range.min}-{range.max})</span>
                          <span className="text-gray-600 ml-2">- {range.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Recommendations</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-blue-700">
                      {getRecommendations(response.risk_level || 'minimal')}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="responses">
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Response Answers</h2>
                  <Button
                    variant="primary"
                    onClick={handleSaveAnswerScores}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Answer Scores
                  </Button>
                </div>

                <div className="space-y-6">
                  {questions.map((question) => {
                    const answer = response.answers.find(a => a.question_id === question.id);
                    if (!answer) return null;

                    return (
                      <div key={question.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{question.text}</h3>
                            {question.description && (
                              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Weight: {question.scoring_weight || 1}</span>
                            <div>
                              <label htmlFor={`score-${question.id}`} className="sr-only">Score</label>
                              <input
                                id={`score-${question.id}`}
                                type="number"
                                min="0"
                                value={answerScores[question.id] !== undefined ? answerScores[question.id] : (answer.score || 0)}
                                onChange={(e) => handleUpdateAnswerScore(question.id, Number(e.target.value))}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-700">Answer:</div>
                          <div className="mt-1">{renderQuestionValue(question, answer)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Response Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Respondent Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Name</div>
                          <div>{response.patient_name || 'Anonymous'}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Email</div>
                          <div>{response.patient_email}</div>
                        </div>
                      </div>

                      {response.patient_age && (
                        <div className="flex items-center">
                          <div className="h-5 w-5 text-gray-400 mr-2 flex items-center justify-center">
                            <span className="text-sm font-bold">A</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Age</div>
                            <div>{response.patient_age}</div>
                          </div>
                        </div>
                      )}

                      {response.patient_gender && (
                        <div className="flex items-center">
                          <div className="h-5 w-5 text-gray-400 mr-2 flex items-center justify-center">
                            <span className="text-sm font-bold">G</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Gender</div>
                            <div>{response.patient_gender}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Response Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Created</div>
                          <div>{formatDate(response.created_at)}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Completed</div>
                          <div>{response.completed_at ? formatDate(response.completed_at) : 'Not completed'}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Completion Time</div>
                          <div>{formatCompletionTime(response.completion_time)}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Unique Code</div>
                          <div>{response.unique_code}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Questionnaire Information</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Title</h3>
                <p>{questionnaire.title}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Description</h3>
                <p className="text-gray-600">{questionnaire.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Instructions</h3>
                <p className="text-gray-600">{questionnaire.instructions}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Type</h3>
                  <p className="text-gray-600 capitalize">{questionnaire.type}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Category</h3>
                  <p className="text-gray-600">{questionnaire.category}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Scoring System</h3>
                <p className="text-gray-600">{scoringSystem?.name || 'No scoring system'}</p>
                <p className="text-sm text-gray-500 mt-1">{scoringSystem?.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="light"
                  onClick={() => router.push(`/admin/responses/${responseId}`)}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Response
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResponseScoringDetailPage;
