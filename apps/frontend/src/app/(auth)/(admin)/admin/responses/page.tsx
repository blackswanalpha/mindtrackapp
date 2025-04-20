'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Loading, Alert, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common';
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  Flag,
  BarChart3,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import api from '@/services/api';

// Define types
type Response = {
  id: number;
  questionnaire_id: number;
  questionnaire_title?: string;
  patient_email: string;
  patient_name?: string;
  score?: number;
  risk_level?: string;
  flagged_for_review: boolean;
  completed_at: string;
  created_at: string;
  unique_code: string;
  has_analysis?: boolean;
};

type Questionnaire = {
  id: number;
  title: string;
  type: string;
};

const ResponsesPage = () => {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [questionnaireFilter, setQuestionnaireFilter] = useState<number | 'all'>('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState<string | 'all'>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<boolean | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Sorting
  const [sortField, setSortField] = useState<string>('completed_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch responses and questionnaires
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch responses
        const responseData = await api.responses.getAll();

        // Fetch questionnaires for filtering
        const questionnaireData = await api.questionnaires.getAll();

        // Add questionnaire titles to responses
        const enhancedResponses = responseData.map((response: Response) => {
          const questionnaire = questionnaireData.find((q: Questionnaire) => q.id === response.questionnaire_id);
          return {
            ...response,
            questionnaire_title: questionnaire ? questionnaire.title : 'Unknown Questionnaire'
          };
        });

        setResponses(enhancedResponses);
        setQuestionnaires(questionnaireData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load responses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle row click
  const handleRowClick = (responseId: number) => {
    router.push(`/admin/responses/${responseId}`);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter responses based on current filters
  const filteredResponses = responses.filter(response => {
    // Questionnaire filter
    if (questionnaireFilter !== 'all' && response.questionnaire_id !== questionnaireFilter) {
      return false;
    }

    // Risk level filter
    if (riskLevelFilter !== 'all' && response.risk_level !== riskLevelFilter) {
      return false;
    }

    // Flagged filter
    if (flaggedFilter !== 'all' && response.flagged_for_review !== flaggedFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (response.patient_email && response.patient_email.toLowerCase().includes(query)) ||
        (response.patient_name && response.patient_name.toLowerCase().includes(query)) ||
        (response.questionnaire_title && response.questionnaire_title.toLowerCase().includes(query)) ||
        (response.unique_code && response.unique_code.toLowerCase().includes(query))
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const responseDate = new Date(response.completed_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateRange === 'today') {
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        return responseDate >= today && responseDate <= endOfDay;
      }

      if (dateRange === 'week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return responseDate >= startOfWeek;
      }

      if (dateRange === 'month') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return responseDate >= startOfMonth;
      }
    }

    return true;
  });

  // Sort filtered responses
  const sortedResponses = [...filteredResponses].sort((a, b) => {
    if (sortField === 'completed_at') {
      return sortDirection === 'asc'
        ? new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
        : new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
    }

    if (sortField === 'patient_name') {
      const nameA = a.patient_name || a.patient_email || '';
      const nameB = b.patient_name || b.patient_email || '';
      return sortDirection === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    if (sortField === 'questionnaire') {
      const titleA = a.questionnaire_title || '';
      const titleB = b.questionnaire_title || '';
      return sortDirection === 'asc'
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }

    if (sortField === 'score') {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return sortDirection === 'asc'
        ? scoreA - scoreB
        : scoreB - scoreA;
    }

    if (sortField === 'risk_level') {
      const riskLevels = ['minimal', 'mild', 'moderate', 'moderately severe', 'severe'];
      const levelA = a.risk_level ? riskLevels.indexOf(a.risk_level.toLowerCase()) : -1;
      const levelB = b.risk_level ? riskLevels.indexOf(b.risk_level.toLowerCase()) : -1;
      return sortDirection === 'asc'
        ? levelA - levelB
        : levelB - levelA;
    }

    return 0;
  });

  // Paginate responses
  const paginatedResponses = sortedResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedResponses.length / itemsPerPage);

  // Export responses as CSV
  const exportCSV = () => {
    // Create CSV content
    const headers = ['ID', 'Questionnaire', 'Patient', 'Email', 'Score', 'Risk Level', 'Flagged', 'Completed At', 'Unique Code'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => [
        response.id,
        `"${response.questionnaire_title || ''}"`,
        `"${response.patient_name || ''}"`,
        response.patient_email,
        response.score || '',
        response.risk_level || '',
        response.flagged_for_review ? 'Yes' : 'No',
        formatDate(response.completed_at),
        response.unique_code
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `responses-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all filters
  const resetFilters = () => {
    setQuestionnaireFilter('all');
    setRiskLevelFilter('all');
    setFlaggedFilter('all');
    setSearchQuery('');
    setDateRange('all');
    setCurrentPage(1);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading responses..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Responses</h1>
        <Button variant="light" onClick={exportCSV} disabled={filteredResponses.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={String(questionnaireFilter)}
                onChange={(e) => setQuestionnaireFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Questionnaires</option>
                {questionnaires.map((questionnaire) => (
                  <option key={questionnaire.id} value={questionnaire.id}>
                    {questionnaire.title}
                  </option>
                ))}
              </select>

              <select
                value={String(riskLevelFilter)}
                onChange={(e) => setRiskLevelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Risk Levels</option>
                <option value="minimal">Minimal</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="moderately severe">Moderately Severe</option>
                <option value="severe">Severe</option>
              </select>

              <select
                value={String(flaggedFilter)}
                onChange={(e) => setFlaggedFilter(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Flags</option>
                <option value="true">Flagged</option>
                <option value="false">Not Flagged</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <Button variant="light" size="small" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing {filteredResponses.length} of {responses.length} responses
            </div>

            {filteredResponses.length > 0 && (
              <div>
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Responses Table */}
      {filteredResponses.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">No responses match your filters.</p>
          <Button variant="light" size="small" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('questionnaire')}
                  >
                    <div className="flex items-center">
                      Questionnaire
                      {sortField === 'questionnaire' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('patient_name')}
                  >
                    <div className="flex items-center">
                      Patient
                      {sortField === 'patient_name' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('score')}
                  >
                    <div className="flex items-center">
                      Score
                      {sortField === 'score' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('risk_level')}
                  >
                    <div className="flex items-center">
                      Risk Level
                      {sortField === 'risk_level' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('completed_at')}
                  >
                    <div className="flex items-center">
                      Submitted
                      {sortField === 'completed_at' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedResponses.map((response) => (
                  <tr
                    key={response.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(response.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.questionnaire_title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Code: {response.unique_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.patient_name || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {response.patient_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {response.score !== undefined ? (
                        <div className="text-sm text-gray-900 font-medium">
                          {response.score}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {response.risk_level ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          response.risk_level === 'minimal' ? 'bg-green-100 text-green-800' :
                          response.risk_level === 'mild' ? 'bg-blue-100 text-blue-800' :
                          response.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          response.risk_level === 'moderately severe' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(response.completed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {response.flagged_for_review && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </span>
                        )}
                        {response.has_analysis && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Brain className="h-3 w-3 mr-1" />
                            Analyzed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="light"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(response.id);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="light"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? 'primary' : 'light'}
                    size="small"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-500">...</span>
                  <Button
                    variant="light"
                    size="small"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="light"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">Total Responses</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">{responses.length}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <Flag className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">Flagged for Review</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {responses.filter(r => r.flagged_for_review).length}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">With AI Analysis</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {responses.filter(r => r.has_analysis).length}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResponsesPage;
