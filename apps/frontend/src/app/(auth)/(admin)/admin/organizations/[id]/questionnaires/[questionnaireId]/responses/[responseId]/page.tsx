'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Flag,
  Mail,
  Download,
  Brain,
  Clock,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Printer,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Share2
} from 'lucide-react';
import api from '@/services/api';
import AIAnalysisSection from '@/components/ai/AIAnalysisSection';
import { motion, AnimatePresence } from 'framer-motion';

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
    options?: Array<{ value: number; label: string }>;
  };
};

type Questionnaire = {
  id: number;
  organization_id: number;
  title: string;
  description?: string;
  type: string;
  category?: string;
};

type Organization = {
  id: number;
  name: string;
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
  const { id, questionnaireId, responseId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'details';

  const [response, setResponse] = useState<Response | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fetch response data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const responseData = await api.responses.getById(Number(responseId));
        // const questionnaireData = await api.questionnaires.getById(Number(questionnaireId));
        // const organizationData = await api.organizations.getById(Number(id));
        // const analysisData = await api.aiAnalysis.getByResponse(Number(responseId));

        // Mock data for demonstration
        const mockOrganization = {
          id: Number(id),
          name: id === '1' ? 'Mental Health Clinic' :
                id === '2' ? 'Wellness Center' :
                id === '3' ? 'Community Health Services' : 'Research Institute',
        };

        const mockQuestionnaire = {
          id: Number(questionnaireId),
          organization_id: Number(id),
          title: questionnaireId === '1' ? 'Depression Assessment (PHQ-9)' :
                 questionnaireId === '2' ? 'Anxiety Screening (GAD-7)' :
                 'Mental Health Questionnaire',
          description: 'A standardized questionnaire for screening and measuring mental health conditions.',
          type: 'assessment',
          category: 'Mental Health',
        };

        // Generate mock questions
        const mockQuestions = [
          {
            id: 1,
            questionnaire_id: Number(questionnaireId),
            text: 'Little interest or pleasure in doing things',
            type: 'single_choice',
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          },
          {
            id: 2,
            questionnaire_id: Number(questionnaireId),
            text: 'Feeling down, depressed, or hopeless',
            type: 'single_choice',
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          },
          {
            id: 3,
            questionnaire_id: Number(questionnaireId),
            text: 'Trouble falling or staying asleep, or sleeping too much',
            type: 'single_choice',
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          },
          {
            id: 4,
            questionnaire_id: Number(questionnaireId),
            text: 'Feeling tired or having little energy',
            type: 'single_choice',
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          },
          {
            id: 5,
            questionnaire_id: Number(questionnaireId),
            text: 'Poor appetite or overeating',
            type: 'single_choice',
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        ];

        // Generate mock answers
        const mockAnswers: Answer[] = mockQuestions.map(question => {
          const randomValue = Math.floor(Math.random() * 4); // 0-3 for PHQ-9 options
          return {
            id: question.id,
            response_id: Number(responseId),
            question_id: question.id,
            value: randomValue,
            score: randomValue,
            question: question
          };
        });

        // Calculate total score
        const totalScore = mockAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);

        // Determine risk level based on score
        let riskLevel = 'low';
        if (totalScore > 15) {
          riskLevel = 'high';
        } else if (totalScore > 10) {
          riskLevel = 'medium';
        }

        // Generate a date within the last month
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        const mockResponse: Response = {
          id: Number(responseId),
          questionnaire_id: Number(questionnaireId),
          patient_email: `patient${responseId}@example.com`,
          patient_name: Math.random() > 0.3 ? `Patient ${responseId}` : undefined,
          patient_age: Math.floor(Math.random() * 50) + 18,
          patient_gender: ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)],
          score: totalScore,
          risk_level: riskLevel,
          flagged_for_review: Math.random() > 0.7,
          completed_at: date.toISOString(),
          created_at: date.toISOString(),
          completion_time: Math.floor(Math.random() * 10) + 2,
          unique_code: `R${questionnaireId}${responseId}${Math.floor(Math.random() * 1000)}`,
          answers: mockAnswers
        };

        // Mock AI analysis (50% chance of having one)
        const hasAnalysis = Math.random() > 0.5;
        const mockAnalysis = hasAnalysis ? {
          id: Number(responseId),
          response_id: Number(responseId),
          created_at: new Date().toISOString(),
          model: 'gpt-4',
          analysis: {
            summary: 'The patient shows signs of moderate depression with symptoms including low energy, sleep disturbances, and feelings of hopelessness.',
            risk_assessment: 'Based on the responses, the patient is at medium risk for clinical depression. The score indicates significant symptoms that may benefit from professional intervention.',
            recommendations: [
              'Consider scheduling an appointment with a mental health professional for a comprehensive evaluation',
              'Implement regular physical activity to help improve mood and energy levels',
              'Practice good sleep hygiene to address sleep disturbances',
              'Consider mindfulness or relaxation techniques to manage stress'
            ],
            key_concerns: [
              'Persistent feelings of hopelessness',
              'Sleep disturbances',
              'Low energy levels',
              'Changes in appetite'
            ],
            potential_triggers: 'The responses suggest that work-related stress and relationship difficulties may be contributing factors to the current symptoms.'
          }
        } : null;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setResponse(mockResponse);
        setQuestionnaire(mockQuestionnaire);
        setOrganization(mockOrganization);
        setAiAnalysis(mockAnalysis);
      } catch (err) {
        setError('Failed to load response details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && questionnaireId && responseId) {
      fetchData();
    }
  }, [id, questionnaireId, responseId]);

  // Handle flag toggle
  const handleFlag = async () => {
    if (!response) return;

    try {
      // In a real implementation, this would call the API
      // await api.responses.flag(Number(responseId), !response.flagged_for_review);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setResponse({
        ...response,
        flagged_for_review: !response.flagged_for_review
      });

      alert(`Response ${!response.flagged_for_review ? 'flagged' : 'unflagged'} successfully`);
    } catch (err) {
      setError('Failed to update flag status');
    }
  };

  // Generate AI analysis
  const generateAnalysis = async () => {
    if (!response || aiAnalysis) return;

    setIsGeneratingAnalysis(true);

    try {
      // In a real implementation, this would call the API
      // const analysisData = await api.aiAnalysis.generate(Number(responseId));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis data
      const mockAnalysis: AIAnalysis = {
        id: Number(responseId),
        response_id: Number(responseId),
        created_at: new Date().toISOString(),
        model: 'gpt-4',
        analysis: {
          summary: 'The patient shows signs of moderate depression with symptoms including low energy, sleep disturbances, and feelings of hopelessness.',
          risk_assessment: 'Based on the responses, the patient is at medium risk for clinical depression. The score indicates significant symptoms that may benefit from professional intervention.',
          recommendations: [
            'Consider scheduling an appointment with a mental health professional for a comprehensive evaluation',
            'Implement regular physical activity to help improve mood and energy levels',
            'Practice good sleep hygiene to address sleep disturbances',
            'Consider mindfulness or relaxation techniques to manage stress'
          ],
          key_concerns: [
            'Persistent feelings of hopelessness',
            'Sleep disturbances',
            'Low energy levels',
            'Changes in appetite'
          ],
          potential_triggers: 'The responses suggest that work-related stress and relationship difficulties may be contributing factors to the current symptoms.'
        }
      };

      setAiAnalysis(mockAnalysis);
      setActiveTab('analysis');
    } catch (err) {
      setError('Failed to generate AI analysis');
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  // Get risk level badge class
  const getRiskLevelBadge = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';

    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get answer display value
  const getAnswerDisplayValue = (answer: Answer) => {
    if (!answer.question) return String(answer.value);

    switch (answer.question.type) {
      case 'single_choice':
        const option = answer.question.options?.find(opt => String(opt.value) === String(answer.value));
        return option ? option.label : String(answer.value);
      case 'multiple_choice':
        if (Array.isArray(answer.value)) {
          return answer.value.map(v => {
            const option = answer.question?.options?.find(opt => String(opt.value) === String(v));
            return option ? option.label : String(v);
          }).join(', ');
        }
        return String(answer.value);
      default:
        return String(answer.value);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading response details..." />
      </div>
    );
  }

  if (error || !response || !questionnaire || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load response details'} />
        <div className="mt-4">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses`)}>
            Back to Responses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8">
        <Link href={`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses`}
          className="text-blue-600 hover:text-blue-800 mr-4 transition-transform hover:scale-110"
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Response Details
            </span>
          </h1>
          <p className="text-gray-600 flex items-center flex-wrap">
            <span className="font-medium">{questionnaire.title}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span>{organization.name}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">{response.unique_code}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          className={response.flagged_for_review ? "bg-yellow-600 text-white hover:bg-yellow-700 group transition-all duration-300 hover:shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 group transition-all duration-300 hover:shadow-md"}
          onClick={handleFlag}
        >
          <motion.div
            animate={response.flagged_for_review ? { rotate: [0, 15, 0] } : {}}
            transition={{ repeat: 0 }}
          >
            <Flag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          </motion.div>
          {response.flagged_for_review ? 'Flagged for Review' : 'Flag for Review'}
        </Button>

        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 group transition-all duration-300 hover:shadow-md"
          onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${responseId}/email/send`)}
        >
          <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Send Email
        </Button>

        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 group transition-all duration-300 hover:shadow-md"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Print
        </Button>

        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 group transition-all duration-300 hover:shadow-md"
          onClick={() => {
            // In a real implementation, this would download the response as PDF/CSV
            alert('Download functionality would be implemented here');
          }}
        >
          <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Export
        </Button>

        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 group transition-all duration-300 hover:shadow-md"
          onClick={() => {
            // Share functionality
            if (navigator.share) {
              navigator.share({
                title: `Response from ${response.patient_name || 'Anonymous'}`,
                text: `Response details for ${questionnaire.title}`,
                url: window.location.href
              });
            } else {
              alert('Share functionality not supported in your browser');
            }
          }}
        >
          <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Share
        </Button>

        {!aiAnalysis && (
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 group transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={generateAnalysis}
            disabled={isGeneratingAnalysis}
          >
            <Brain className={`h-4 w-4 mr-2 ${isGeneratingAnalysis ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
            {isGeneratingAnalysis ? 'Generating Analysis...' : 'Generate AI Analysis'}
          </Button>
        )}
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 p-1 bg-gray-100 rounded-lg">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-300"
          >
            <User className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger
            value="answers"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-300"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Answers
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-300"
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AnimatePresence mode="wait">
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2">
                <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      Response Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Respondent</h3>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{response.patient_name || 'Anonymous'}</p>
                          {response.patient_email && (
                            <p className="text-gray-600">{response.patient_email}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Unique Code</h3>
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-gray-800 font-mono bg-gray-100 px-3 py-1 rounded">{response.unique_code}</p>
                      </div>
                    </motion.div>

                    {response.patient_age && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                      >
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Age</h3>
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <p className="text-gray-800">{response.patient_age} years</p>
                        </div>
                      </motion.div>
                    )}

                    {response.patient_gender && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                      >
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <p className="text-gray-800">{response.patient_gender}</p>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Submitted</h3>
                      <div className="flex items-center">
                        <div className="bg-yellow-100 p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                        <p className="text-gray-800">{formatDate(response.created_at)}</p>
                      </div>
                    </motion.div>

                    {response.completion_time && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                      >
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Time</h3>
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <Clock className="h-5 w-5 text-red-600" />
                          </div>
                          <p className="text-gray-800">{response.completion_time} minutes</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                      Assessment Results
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="p-4 rounded-lg bg-blue-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 font-medium">Score</span>
                          <span className="text-2xl font-bold text-blue-600">{response.score}</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(response.score || 0) / 27 * 100}%` }}
                            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-blue-500 rounded-full"
                          ></motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={`p-4 rounded-lg ${response.risk_level === 'low' ? 'bg-green-50' : response.risk_level === 'medium' ? 'bg-yellow-50' : 'bg-red-50'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 font-medium">Risk Level</span>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskLevelBadge(response.risk_level)}`}>
                            {response.risk_level ? (response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)) : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          {response.risk_level === 'low' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : response.risk_level === 'medium' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className="text-gray-600">
                            {response.risk_level === 'low'
                              ? 'Low risk - Monitor and follow up as needed'
                              : response.risk_level === 'medium'
                              ? 'Medium risk - Consider intervention'
                              : 'High risk - Immediate attention recommended'}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                        Questionnaire
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                        <p className="text-gray-800 font-medium">{questionnaire.title}</p>
                      </div>

                      {questionnaire.description && (
                        <div className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                          <p className="text-gray-800">{questionnaire.description}</p>
                        </div>
                      )}

                      <div className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                        <p className="text-gray-800">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}
                          </span>
                        </p>
                      </div>

                      {questionnaire.category && (
                        <div className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                          <p className="text-gray-800">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {questionnaire.category}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <Button
                        className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 group transition-all duration-300"
                        onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}`)}
                      >
                        <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        <span>View Questionnaire</span>
                        <ChevronRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                {aiAnalysis ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-6"
                  >
                    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-blue-500" />
                          AI Analysis
                        </h2>
                        <Button
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors"
                          onClick={() => setActiveTab('analysis')}
                        >
                          View Full Analysis
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>

                      <p className="text-gray-600 mb-4 p-3 bg-white bg-opacity-50 rounded-lg border border-blue-100">
                        {aiAnalysis.analysis.summary}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Brain className="h-4 w-4 mr-1 text-blue-400" />
                        <span>Generated {new Date(aiAnalysis.created_at).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-6"
                  >
                    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-gray-500" />
                          AI Analysis
                        </h2>
                      </div>
                      <div className="text-center py-6">
                        <Brain className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-600 mb-4">
                          No AI analysis has been generated for this response yet.
                        </p>
                        <Button
                          className="bg-blue-600 text-white hover:bg-blue-700 group transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={generateAnalysis}
                          disabled={isGeneratingAnalysis}
                        >
                          <Brain className={`h-4 w-4 mr-2 ${isGeneratingAnalysis ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                          {isGeneratingAnalysis ? 'Generating...' : 'Generate Analysis'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="answers">
          <AnimatePresence mode="wait">
            <motion.div
              key="answers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                    Answers
                  </h2>
                </div>

                <div className="space-y-6">
                  {response.answers.map((answer, index) => (
                    <motion.div
                      key={answer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-purple-200 mb-4 last:mb-0"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                              Question {index + 1}
                            </div>
                            {answer.score !== undefined && (
                              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                Score: {answer.score}
                              </div>
                            )}
                          </div>

                          <h3 className="text-lg font-medium text-gray-800 mb-3">
                            {answer.question?.text || `Question ${answer.question_id}`}
                          </h3>

                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
                            <div className="text-sm text-gray-500 mb-1">Answer:</div>
                            <p className="text-gray-700 font-medium">
                              {getAnswerDisplayValue(answer)}
                            </p>
                          </div>
                        </div>

                        {answer.question?.type === 'single_choice' && (
                          <div className="ml-4">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`px-3 py-2 text-sm font-semibold rounded-lg shadow-sm ${
                                answer.value === 0 ? 'bg-green-100 text-green-800 border border-green-200' :
                                answer.value === 1 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                answer.value === 2 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              {answer.value === 0 ? 'Not at all' :
                               answer.value === 1 ? 'Several days' :
                               answer.value === 2 ? 'More than half the days' :
                               'Nearly every day'}
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {response.answers.length} questions answered
                  </div>
                  <Button
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 group transition-all duration-300"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Print Answers
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="analysis">
          <AnimatePresence mode="wait">
            <motion.div
              key={aiAnalysis ? 'analysis-content' : 'analysis-empty'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {aiAnalysis ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <AIAnalysisSection
                    analysis={aiAnalysis}
                    onRefresh={generateAnalysis}
                  />
                </motion.div>
              ) : (
                <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-gray-500" />
                      AI Analysis
                    </h2>
                  </div>

                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <h2 className="text-2xl font-medium text-gray-700 mb-3">No AI Analysis Available</h2>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Generate an AI analysis to get insights, risk assessment, and recommendations based on this response.
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="primary"
                          onClick={generateAnalysis}
                          disabled={isGeneratingAnalysis}
                          className="px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Brain className={`h-5 w-5 mr-2 ${isGeneratingAnalysis ? 'animate-pulse' : ''}`} />
                          {isGeneratingAnalysis ? (
                            <span className="flex items-center">
                              Generating Analysis
                              <span className="ml-2 flex space-x-1">
                                <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0 }}
                                  className="h-1.5 w-1.5 bg-white rounded-full"
                                />
                                <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
                                  className="h-1.5 w-1.5 bg-white rounded-full"
                                />
                                <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.4 }}
                                  className="h-1.5 w-1.5 bg-white rounded-full"
                                />
                              </span>
                            </span>
                          ) : 'Generate AI Analysis'}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseDetailPage;
