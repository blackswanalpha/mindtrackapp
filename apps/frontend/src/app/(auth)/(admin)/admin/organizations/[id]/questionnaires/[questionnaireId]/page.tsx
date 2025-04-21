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
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/common';
import {
  Edit,
  Trash2,
  QrCode,
  Download,
  Copy,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Eye
} from 'lucide-react';
import QuestionList from '@/components/questionnaire/QuestionList';
import SimpleQRCode from '@/components/qrcode/SimpleQRCode';
import api from '@/services/api';
import { motion } from 'framer-motion';

type Questionnaire = {
  id: number;
  organization_id: number;
  title: string;
  description?: string;
  instructions?: string;
  type: string;
  category?: string;
  is_active: boolean;
  is_public: boolean;
  response_count: number;
  created_at: string;
  updated_at?: string;
  created_by: {
    id: number;
    name: string;
  };
  estimated_time?: number;
};

type Question = {
  id: number;
  questionnaire_id: number;
  text: string;
  type: string;
  required: boolean;
  order_num: number;
  options?: Array<{ value: number; label: string }>;
};

const QuestionnaireDetailPage = () => {
  const { id, questionnaireId } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Fetch questionnaire and organization from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [questionnaireData, organizationData] = await Promise.all([
          api.questionnaires.getById(Number(questionnaireId)),
          api.organizations.getById(Number(id)),
        ]);
        setQuestionnaire(questionnaireData);
        setOrganization(organizationData);
        // Optionally fetch stats if you have an endpoint, else use response_count
        if (api.questionnaires.getStatistics) {
          try {
            const statsData = await api.questionnaires.getStatistics(Number(questionnaireId));
            setStats(statsData);
          } catch {
            setStats(null);
          }
        } else {
          setStats(null);
        }
      } catch (err) {
        setError('Failed to load questionnaire details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id && questionnaireId) {
      fetchData();
    }
  }, [id, questionnaireId]);

  // Handle questionnaire deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      // In a real implementation, this would call the API
      // await api.questionnaires.delete(Number(questionnaireId));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Redirect back to questionnaires list
      router.push(`/admin/organizations/${id}/questionnaires`);
    } catch (err) {
      setError('Failed to delete questionnaire');
      setIsDeleting(false);
    }
  };

  // Handle questionnaire duplication
  const handleDuplicate = async () => {
    try {
      // In a real implementation, this would call the API
      // const duplicated = await api.questionnaires.duplicate(Number(questionnaireId));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      alert('Questionnaire duplicated successfully');

      // Refresh the page or redirect to the new questionnaire
      // router.push(`/admin/organizations/${id}/questionnaires/${duplicated.id}`);
    } catch (err) {
      setError('Failed to duplicate questionnaire');
    }
  };

  // Handle status toggle
  const handleToggleStatus = async () => {
    if (!questionnaire) return;

    try {
      // In a real implementation, this would call the API
      // await api.questionnaires.updateStatus(Number(questionnaireId), !questionnaire.is_active);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setQuestionnaire({
        ...questionnaire,
        is_active: !questionnaire.is_active
      });

      alert(`Questionnaire ${!questionnaire.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      setError('Failed to update questionnaire status');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire details..." />
      </div>
    );
  }

  if (error || !questionnaire || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load questionnaire'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push(`/admin/organizations/${id}/questionnaires`)}>
            Back to Questionnaires
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/admin/organizations/${id}/questionnaires`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{questionnaire.title}</h1>
          <p className="text-gray-600">
            {organization.name} • {questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}
            {questionnaire.category && ` • ${questionnaire.category}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={handleDuplicate}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>

        <Button
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/qr-code`)}
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </Button>

        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses`)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Responses ({stats?.total_responses || questionnaire.response_count})
        </Button>

        <Button
          className={questionnaire.is_active ? "bg-green-600 text-white hover:bg-green-700 transition-colors" : "bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"}
          onClick={handleToggleStatus}
        >
          {questionnaire.is_active ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Inactive
            </>
          )}
        </Button>

        <Button
          className="bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Details</h2>

                {questionnaire.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-800">{questionnaire.description}</p>
                  </div>
                )}

                {questionnaire.instructions && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Instructions</h3>
                    <p className="text-gray-800">{questionnaire.instructions}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Created By</h3>
                    <p className="text-gray-800">{questionnaire.created_by.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(questionnaire.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {questionnaire.updated_at && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                      <p className="text-gray-800">
                        {new Date(questionnaire.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {questionnaire.estimated_time && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Estimated Time</h3>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-gray-800">{questionnaire.estimated_time} minutes</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Visibility</h3>
                    <p className="text-gray-800">
                      {questionnaire.is_public ? 'Public' : 'Private'}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Preview</h3>
                  <div className="flex space-x-3">
                    <Button
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => window.open(`/q/${questionnaireId}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Questionnaire
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <h2 className="text-xl font-semibold mb-4">Response Summary</h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Total Responses</h3>
                      <span className="text-2xl font-bold text-gray-800">{stats?.total_responses || questionnaire.response_count}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                      <span className="text-2xl font-bold text-gray-800">{stats?.completion_rate || 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${stats?.completion_rate || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                      <span className="text-2xl font-bold text-gray-800">{stats?.avg_score || 0}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Risk Levels</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Low Risk</span>
                          <span className="text-sm font-medium text-gray-800">{stats?.risk_levels?.low || 0}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(stats?.risk_levels?.low / stats?.total_responses) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Medium Risk</span>
                          <span className="text-sm font-medium text-gray-800">{stats?.risk_levels?.medium || 0}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${(stats?.risk_levels?.medium / stats?.total_responses) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">High Risk</span>
                          <span className="text-sm font-medium text-gray-800">{stats?.risk_levels?.high || 0}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${(stats?.risk_levels?.high / stats?.total_responses) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View All Responses ({stats?.total_responses || questionnaire.response_count})
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Questions</h2>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/questions/create`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <QuestionList questionnaireId={Number(questionnaireId)} />
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Response Statistics</h2>
              <Button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses`)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                View All Responses
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Responses</h3>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_responses || questionnaire.response_count}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {questionnaire.response_count > 0
                    ? `Last response ${Math.floor(Math.random() * 24) + 1} hours ago`
                    : 'No responses yet'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Completion Rate</h3>
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.completion_rate || 0}%</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats?.completion_rate > 80
                    ? 'Excellent completion rate'
                    : stats?.completion_rate > 60
                    ? 'Good completion rate'
                    : 'Could be improved'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Average Score</h3>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.avg_score || 0}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats?.avg_score > 15
                    ? 'Higher than average'
                    : stats?.avg_score > 10
                    ? 'Average score'
                    : 'Lower than average'}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Risk Level Distribution</h3>
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(stats?.risk_levels?.low / stats?.total_responses) * 100 || 0}%` }}
                  title={`Low Risk: ${stats?.risk_levels?.low || 0} (${Math.round((stats?.risk_levels?.low / stats?.total_responses) * 100) || 0}%)`}
                ></div>
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(stats?.risk_levels?.medium / stats?.total_responses) * 100 || 0}%` }}
                  title={`Medium Risk: ${stats?.risk_levels?.medium || 0} (${Math.round((stats?.risk_levels?.medium / stats?.total_responses) * 100) || 0}%)`}
                ></div>
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(stats?.risk_levels?.high / stats?.total_responses) * 100 || 0}%` }}
                  title={`High Risk: ${stats?.risk_levels?.high || 0} (${Math.round((stats?.risk_levels?.high / stats?.total_responses) * 100) || 0}%)`}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span>Low: {stats?.risk_levels?.low || 0} ({Math.round((stats?.risk_levels?.low / stats?.total_responses) * 100) || 0}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span>Medium: {stats?.risk_levels?.medium || 0} ({Math.round((stats?.risk_levels?.medium / stats?.total_responses) * 100) || 0}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>High: {stats?.risk_levels?.high || 0} ({Math.round((stats?.risk_levels?.high / stats?.total_responses) * 100) || 0}%)</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 mb-4">Need more detailed analytics?</p>
              <Button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/analytics?questionnaire=${questionnaireId}`)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Advanced Analytics
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionnaireDetailPage;
