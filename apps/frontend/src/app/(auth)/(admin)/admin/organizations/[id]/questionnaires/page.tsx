'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input
} from '@/components/common';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Copy,
  QrCode,
  ChevronDown,
  ChevronUp,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Eye,
  MessageSquare,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

type Questionnaire = {
  id: number;
  organization_id: number;
  title: string;
  description?: string;
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

const OrganizationQuestionnairesPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<any>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [parent] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchOrganizationAndQuestionnaires = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const orgResponse = await api.organizations.getById(Number(id));
        // const questionnairesResponse = await api.organizations.getQuestionnaires(Number(id));

        // Mock data for demonstration
        const mockOrganization = {
          id: Number(id),
          name: id === '1' ? 'Mental Health Clinic' :
                id === '2' ? 'Wellness Center' :
                id === '3' ? 'Community Health Services' : 'Research Institute',
        };

        const mockQuestionnaires: Questionnaire[] = [
          {
            id: 1,
            organization_id: Number(id),
            title: 'Depression Assessment (PHQ-9)',
            description: 'A standardized questionnaire for screening and measuring the severity of depression.',
            type: 'assessment',
            category: 'Mental Health',
            is_active: true,
            is_public: true,
            response_count: 128,
            created_at: '2023-01-15T10:30:00Z',
            updated_at: '2023-06-20T14:45:00Z',
            created_by: {
              id: 101,
              name: 'John Doe'
            },
            estimated_time: 5
          },
          {
            id: 2,
            organization_id: Number(id),
            title: 'Anxiety Screening (GAD-7)',
            description: 'A tool used to screen for generalized anxiety disorder.',
            type: 'assessment',
            category: 'Mental Health',
            is_active: true,
            is_public: true,
            response_count: 96,
            created_at: '2023-02-10T09:15:00Z',
            updated_at: '2023-05-18T11:30:00Z',
            created_by: {
              id: 102,
              name: 'Jane Smith'
            },
            estimated_time: 4
          },
          {
            id: 3,
            organization_id: Number(id),
            title: 'Well-being Check',
            description: 'A general assessment of mental well-being and life satisfaction.',
            type: 'survey',
            category: 'Well-being',
            is_active: true,
            is_public: false,
            response_count: 75,
            created_at: '2023-03-05T14:20:00Z',
            created_by: {
              id: 101,
              name: 'John Doe'
            },
            estimated_time: 8
          },
          {
            id: 4,
            organization_id: Number(id),
            title: 'Sleep Quality Survey',
            description: 'Evaluates sleep patterns and identifies potential sleep disorders.',
            type: 'survey',
            category: 'Sleep',
            is_active: false,
            is_public: false,
            response_count: 42,
            created_at: '2023-04-12T16:45:00Z',
            updated_at: '2023-04-30T10:15:00Z',
            created_by: {
              id: 103,
              name: 'Robert Johnson'
            },
            estimated_time: 6
          },
          {
            id: 5,
            organization_id: Number(id),
            title: 'Stress Evaluation',
            description: 'Measures stress levels and identifies coping mechanisms.',
            type: 'assessment',
            category: 'Stress Management',
            is_active: true,
            is_public: true,
            response_count: 89,
            created_at: '2023-05-20T11:30:00Z',
            created_by: {
              id: 102,
              name: 'Jane Smith'
            },
            estimated_time: 7
          },
          {
            id: 6,
            organization_id: Number(id),
            title: 'Patient Satisfaction Survey',
            description: 'Collects feedback on patient experience and satisfaction with services.',
            type: 'feedback',
            category: 'Patient Experience',
            is_active: true,
            is_public: true,
            response_count: 156,
            created_at: '2023-06-08T09:00:00Z',
            updated_at: '2023-07-15T13:20:00Z',
            created_by: {
              id: 104,
              name: 'Emily Davis'
            },
            estimated_time: 10
          },
          {
            id: 7,
            organization_id: Number(id),
            title: 'Medication Side Effects Tracker',
            description: 'Monitors and tracks potential side effects of prescribed medications.',
            type: 'tracking',
            category: 'Medication',
            is_active: false,
            is_public: false,
            response_count: 34,
            created_at: '2023-07-25T15:10:00Z',
            created_by: {
              id: 103,
              name: 'Robert Johnson'
            },
            estimated_time: 5
          },
          {
            id: 8,
            organization_id: Number(id),
            title: 'Therapy Progress Assessment',
            description: 'Evaluates progress and outcomes of therapeutic interventions.',
            type: 'assessment',
            category: 'Therapy',
            is_active: true,
            is_public: false,
            response_count: 67,
            created_at: '2023-08-14T10:45:00Z',
            updated_at: '2023-09-02T16:30:00Z',
            created_by: {
              id: 101,
              name: 'John Doe'
            },
            estimated_time: 12
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setOrganization(mockOrganization);
        setQuestionnaires(mockQuestionnaires);
        setFilteredQuestionnaires(mockQuestionnaires);
      } catch (err) {
        setError('Failed to load organization questionnaires');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrganizationAndQuestionnaires();
    }
  }, [id]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...questionnaires];

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(questionnaire => questionnaire.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(questionnaire =>
        (statusFilter === 'active' && questionnaire.is_active) ||
        (statusFilter === 'inactive' && !questionnaire.is_active)
      );
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        questionnaire =>
          questionnaire.title.toLowerCase().includes(query) ||
          (questionnaire.description && questionnaire.description.toLowerCase().includes(query)) ||
          (questionnaire.category && questionnaire.category.toLowerCase().includes(query))
      );
    }

    setFilteredQuestionnaires(filtered);
  }, [questionnaires, typeFilter, statusFilter, searchQuery]);

  // Handle questionnaire deletion
  const handleDeleteQuestionnaire = async (questionnaireId: number) => {
    if (!window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.questionnaires.delete(questionnaireId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setQuestionnaires(questionnaires.filter(q => q.id !== questionnaireId));

      alert('Questionnaire deleted successfully');
    } catch (err) {
      setError('Failed to delete questionnaire');
    }
  };

  // Handle questionnaire status toggle
  const handleToggleStatus = async (questionnaireId: number, currentStatus: boolean) => {
    try {
      // In a real implementation, this would call the API
      // await api.questionnaires.updateStatus(questionnaireId, !currentStatus);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setQuestionnaires(questionnaires.map(q =>
        q.id === questionnaireId ? { ...q, is_active: !currentStatus } : q
      ));

      alert(`Questionnaire ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      setError('Failed to update questionnaire status');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading organization questionnaires..." />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load organization'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push('/admin/organizations')}>
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-8"
      >
        <Link href={`/admin/organizations/${id}`} className="text-blue-600 hover:text-blue-800 mr-4 transition-transform hover:scale-110">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Questionnaires
            </span>
          </h1>
          <p className="text-gray-600 flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {organization.name}
          </p>
        </div>
      </motion.div>

      <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search questionnaires..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm transition-all duration-200"
                />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all duration-200 pr-10"
                >
                  <option value="all">All Types</option>
                  <option value="assessment">Assessment</option>
                  <option value="survey">Survey</option>
                  <option value="feedback">Feedback</option>
                  <option value="tracking">Tracking</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all duration-200 pr-10"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-1 rounded-md flex">
                <button
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="primary"
                  onClick={() => router.push('/admin/organizations/${id}/questionnaires/create')}
                  className="shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Create Questionnaire</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredQuestionnaires.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-2xl font-medium text-gray-700 mb-3">No questionnaires found</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'No questionnaires match your search criteria.'
                    : 'This organization doesn\'t have any questionnaires yet.'}
                </p>

                {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block"
                  >
                    <Button
                      variant="primary"
                      onClick={() => router.push('/admin/organizations/${id}/questionnaires/create')}
                      className="px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Create Your First Questionnaire
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredQuestionnaires.map((questionnaire, index) => (
                <motion.div
                  key={questionnaire.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    <div className={`h-2 w-full ${questionnaire.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="p-5 flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          questionnaire.type === 'assessment'
                            ? 'bg-purple-100 text-purple-800'
                            : questionnaire.type === 'survey'
                            ? 'bg-blue-100 text-blue-800'
                            : questionnaire.type === 'feedback'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        <Link
                          href={`/questionnaires/${questionnaire.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {questionnaire.title}
                        </Link>
                      </h3>

                      {questionnaire.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {questionnaire.description}
                        </p>
                      )}

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{new Date(questionnaire.created_at).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{questionnaire.created_by.name}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-700">{questionnaire.response_count} responses</span>
                        </div>

                        {questionnaire.estimated_time && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-700">{questionnaire.estimated_time} min</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between items-center">
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          questionnaire.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {questionnaire.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                          onClick={() => router.push(`admin/organizations/${id}/questionnaires/${questionnaire.id}/qr-code`)}
                          title="QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                          onClick={() => {/* Duplicate functionality */}}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${
                            questionnaire.is_active
                              ? 'text-green-500 hover:text-green-700'
                              : 'text-red-500 hover:text-red-700'
                          }`}
                          onClick={() => handleToggleStatus(questionnaire.id, questionnaire.is_active)}
                          title={questionnaire.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {questionnaire.is_active ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          className="p-1.5 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                          onClick={() => router.push(`admin/organizations/${id}/questionnaires/${questionnaire.id}/edit`)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                          onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questionnaire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responses
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestionnaires.map((questionnaire, index) => (
                    <motion.tr
                      key={questionnaire.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className="bg-white hover:bg-gray-50 border-b border-gray-200 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link
                                href={`/questionnaires/${questionnaire.id}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {questionnaire.title}
                              </Link>
                            </div>
                            {questionnaire.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {questionnaire.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            questionnaire.type === 'assessment'
                              ? 'bg-purple-100 text-purple-800'
                              : questionnaire.type === 'survey'
                              ? 'bg-blue-100 text-blue-800'
                              : questionnaire.type === 'feedback'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}
                          </span>
                          {questionnaire.category && (
                            <span className="ml-2 text-xs text-gray-500">
                              {questionnaire.category}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          questionnaire.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {questionnaire.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{questionnaire.response_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(questionnaire.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          by {questionnaire.created_by.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => router.push(`/questionnaires/${questionnaire.id}/qr-code`)}
                            title="QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {/* Duplicate functionality */}}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                              questionnaire.is_active
                                ? 'text-green-500 hover:text-green-700'
                                : 'text-red-500 hover:text-red-700'
                            }`}
                            onClick={() => handleToggleStatus(questionnaire.id, questionnaire.is_active)}
                            title={questionnaire.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {questionnaire.is_active ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                            onClick={() => router.push(`admin/organizations/${id}/questionnaires/${questionnaire.id}/edit`)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                            onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredQuestionnaires.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4"
          >
            <div className="text-sm text-gray-500">
              Showing {filteredQuestionnaires.length} of {questionnaires.length} questionnaires
            </div>
            <div className="flex space-x-2">
              <Button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <ChevronUp className="h-4 w-4 rotate-90 mr-1" />
                Previous
              </Button>
              <Button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Next
                <ChevronUp className="h-4 w-4 -rotate-90 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default OrganizationQuestionnairesPage;
