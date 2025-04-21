'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Download,
  Eye,
  Flag,
  Brain,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  Card,
  Button,
  Loading,
  Alert,
  Badge,
  Select,
  ProgressBar
} from '@/components/common';
import AIAnalysisModal from '@/components/ai/AIAnalysisModal';
import api from '@/services/api';

type Response = {
  id: number;
  questionnaire_id: number;
  patient_name: string;
  patient_email: string;
  score: number;
  risk_level: string;
  flagged_for_review: boolean;
  completed_at: string;
};

type ResponseListProps = {
  questionnaireId?: number;
};

const ResponseList: React.FC<ResponseListProps> = ({ questionnaireId }) => {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, flagged, high_risk, medium_risk, low_risk
  const [selectedResponses, setSelectedResponses] = useState<number[]>([])
  const [analysisModal, setAnalysisModal] = useState<{ isOpen: boolean; responseId: number | null }>({ isOpen: false, responseId: null });

  useEffect(() => {
    const fetchResponses = async () => {
      if (!questionnaireId) {
        setError('No questionnaire ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch responses for the specific questionnaire
        const data = await api.responses.getByQuestionnaire(questionnaireId);

        // Apply risk/flag filters
        let filteredResponses = [...data];
        if (filter === 'flagged') {
          filteredResponses = filteredResponses.filter(r => r.flagged_for_review);
        } else if (filter === 'high_risk') {
          filteredResponses = filteredResponses.filter(r => r.risk_level === 'high' || r.risk_level === 'severe' || r.risk_level === 'moderately severe');
        } else if (filter === 'medium_risk') {
          filteredResponses = filteredResponses.filter(r => r.risk_level === 'medium' || r.risk_level === 'moderate');
        } else if (filter === 'low_risk') {
          filteredResponses = filteredResponses.filter(r => r.risk_level === 'low' || r.risk_level === 'minimal' || r.risk_level === 'mild');
        }

        // Sort responses by completion date (newest first)
        filteredResponses.sort((a, b) => {
          const dateA = new Date(a.completed_at).getTime();
          const dateB = new Date(b.completed_at).getTime();
          return dateB - dateA;
        });

        setResponses(filteredResponses);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load responses');
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [questionnaireId, filter]);

  const handleFlag = async (id: number, flagged: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update response in state
      setResponses((prev) =>
        prev.map((r) => (r.id === id ? { ...r, flagged_for_review: flagged } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update flag status');
    }
  };

  // Handle response selection
  const handleSelectResponse = (id: number) => {
    setSelectedResponses(prev => {
      if (prev.includes(id)) {
        return prev.filter(responseId => responseId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedResponses.length === responses.length) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(responses.map(response => response.id));
    }
  };

  // Send email to selected responses
  const handleSendEmail = async () => {
    if (selectedResponses.length === 0) {
      return;
    }

    router.push(`/email/send?responses=${selectedResponses.join(',')}`);
  };

  // Open AI Analysis modal
  const handleOpenAnalysis = (responseId: number) => {
    setAnalysisModal({ isOpen: true, responseId });
  };

  // Close AI Analysis modal
  const handleCloseAnalysis = () => {
    setAnalysisModal({ isOpen: false, responseId: null });
  };

  // Export selected responses
  const handleExport = async () => {
    if (selectedResponses.length === 0) {
      return;
    }

    try {
      // Mock export functionality
      // In a real implementation, this would call the API
      const csvContent = 'id,respondent,score,risk_level,completed_at\n' +
        selectedResponses.map(id => {
          const response = responses.find(r => r.id === id);
          if (!response) return '';
          return `${response.id},${response.patient_email || 'Anonymous'},${response.score || 'N/A'},${response.risk_level || 'N/A'},${response.completed_at || 'Incomplete'}`;
        }).join('\n');

      // Create download link
      const url = window.URL.createObjectURL(new Blob([csvContent]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `responses-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export responses');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading size="large" message="Loading responses..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert type="error" message={error} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <FileText className="h-7 w-7 mr-3 text-indigo-600" />
            Responses
          </h2>
          <p className="text-gray-600">
            {questionnaireId
              ? 'Responses for this questionnaire'
              : 'All questionnaire responses'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={handleSendEmail}
            disabled={selectedResponses.length === 0}
            className="flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button
            variant="light"
            onClick={handleExport}
            disabled={selectedResponses.length === 0}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="light"
            onClick={() => setResponses([...responses])}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by email, name, or code..."
                className="pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'light'}
              onClick={() => setFilter('all')}
              className="flex items-center"
            >
              All
            </Button>

            <Button
              variant={filter === 'flagged' ? 'primary' : 'light'}
              onClick={() => setFilter('flagged')}
              className="flex items-center"
            >
              <Flag className="h-4 w-4 mr-1" />
              Flagged
            </Button>

            <Button
              variant={filter === 'high_risk' ? 'primary' : 'light'}
              onClick={() => setFilter('high_risk')}
              className="flex items-center"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              High Risk
            </Button>

            <Button
              variant={filter === 'medium_risk' ? 'primary' : 'light'}
              onClick={() => setFilter('medium_risk')}
              className="flex items-center"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Medium Risk
            </Button>

            <Button
              variant={filter === 'low_risk' ? 'primary' : 'light'}
              onClick={() => setFilter('low_risk')}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Low Risk
            </Button>
          </div>
        </div>
      </Card>

      {responses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Responses Found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            This questionnaire has not received any responses yet.
          </p>
        </div>
      ) : (
        <Card className="overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedResponses.length === responses.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Respondent
                      <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Score
                      <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Risk Level
                      <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Completed
                      <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response, index) => (
                  <motion.tr
                    key={response.id}
                    className={`hover:bg-gray-50 ${response.flagged_for_review ? 'bg-yellow-50' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedResponses.includes(response.id)}
                        onChange={() => handleSelectResponse(response.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {response.patient_email ? (
                            <Mail className="h-4 w-4 text-gray-500" />
                          ) : (
                            <User className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {response.patient_name || 'Anonymous'}
                          </div>
                          {response.patient_email && (
                            <div className="text-xs text-gray-500">{response.patient_email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.score !== null ? response.score : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          response.risk_level === 'high' ? 'danger' :
                          response.risk_level === 'medium' || response.risk_level === 'moderate' ? 'warning' :
                          response.risk_level === 'mild' ? 'info' : 'success'
                        }
                        className="capitalize"
                      >
                        {response.risk_level || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {response.flagged_for_review && (
                        <Badge variant="danger" className="flex items-center">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {response.completed_at
                          ? new Date(response.completed_at).toLocaleDateString()
                          : 'Incomplete'}
                      </div>
                      {response.completed_at && (
                        <div className="text-xs text-gray-500">
                          {new Date(response.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="light"
                          size="small"
                          onClick={() => router.push(`/admin/responses/${response.id}`)}
                          className="flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="light"
                          size="small"
                          onClick={() => handleOpenAnalysis(response.id)}
                          className="flex items-center text-purple-600 hover:text-purple-900"
                        >
                          <Brain className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="light"
                          size="small"
                          onClick={() => router.push(`/admin/email/send?responses=${response.id}`)}
                          className="flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="light"
                          size="small"
                          onClick={() => handleFlag(response.id, !response.flagged_for_review)}
                          className={`flex items-center ${response.flagged_for_review ? 'text-gray-600 hover:text-gray-900' : 'text-red-600 hover:text-red-900'}`}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {analysisModal.isOpen && analysisModal.responseId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AIAnalysisModal
              responseId={analysisModal.responseId}
              isOpen={analysisModal.isOpen}
              onClose={handleCloseAnalysis}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResponseList;
