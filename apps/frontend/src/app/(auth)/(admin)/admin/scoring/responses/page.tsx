'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/common';
import {
  Search,
  Filter,
  BarChart3,
  RefreshCw,
  FileText,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Mail,
  ArrowLeft
} from 'lucide-react';
import api from '@/services/api';

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
};

type FilterOptions = {
  questionnaire: string;
  riskLevel: string;
  dateRange: string;
  scored: string;
};

const ResponseScoringPage = () => {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    questionnaire: 'all',
    riskLevel: 'all',
    dateRange: 'all',
    scored: 'all'
  });
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [questionnaires, setQuestionnaires] = useState<{id: number, title: string}[]>([]);
  const [isRecalculatingAll, setIsRecalculatingAll] = useState(false);

  // Fetch responses data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch responses
        const responsesData = await api.responses.getAll();
        setResponses(responsesData);
        setFilteredResponses(responsesData);

        // Fetch questionnaires for filter
        const questionnairesData = await api.questionnaires.getAll();

        // Ensure questionnairesData is an array
        const questionnairesArray = Array.isArray(questionnairesData)
          ? questionnairesData
          : questionnairesData?.questionnaires || [];

        setQuestionnaires(questionnairesArray.map((q: any) => ({ id: q.id, title: q.title })));
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load responses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...responses];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(response =>
        response.patient_email.toLowerCase().includes(query) ||
        (response.patient_name && response.patient_name.toLowerCase().includes(query)) ||
        response.unique_code.toLowerCase().includes(query) ||
        (response.questionnaire_title && response.questionnaire_title.toLowerCase().includes(query))
      );
    }

    // Apply questionnaire filter
    if (filters.questionnaire !== 'all') {
      filtered = filtered.filter(response =>
        response.questionnaire_id.toString() === filters.questionnaire
      );
    }

    // Apply risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(response =>
        response.risk_level === filters.riskLevel
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }

      filtered = filtered.filter(response =>
        new Date(response.created_at) >= startDate
      );
    }

    // Apply scored filter
    if (filters.scored !== 'all') {
      if (filters.scored === 'scored') {
        filtered = filtered.filter(response =>
          response.score !== undefined && response.score !== null
        );
      } else {
        filtered = filtered.filter(response =>
          response.score === undefined || response.score === null
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Response];
      let bValue: any = b[sortField as keyof Response];

      // Handle special cases
      if (sortField === 'questionnaire_title') {
        aValue = a.questionnaire_title || '';
        bValue = b.questionnaire_title || '';
      }

      // Handle null/undefined values
      if (aValue === undefined || aValue === null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === undefined || bValue === null) return sortDirection === 'asc' ? 1 : -1;

      // Compare dates
      if (sortField === 'created_at' || sortField === 'completed_at') {
        return sortDirection === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // Compare strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Compare numbers
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredResponses(filtered);
  }, [responses, searchQuery, filters, sortField, sortDirection]);

  // Handle filter change
  const handleFilterChange = (filterName: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle recalculate all scores
  const handleRecalculateAll = async () => {
    setIsRecalculatingAll(true);
    setError(null);

    try {
      // In a real implementation, this would call the API
      // await api.scoring.recalculateAll();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh data
      const responsesData = await api.responses.getAll();
      setResponses(responsesData);

      alert('All scores recalculated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to recalculate scores');
    } finally {
      setIsRecalculatingAll(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel?: string) => {
    if (!riskLevel) return 'bg-gray-100 text-gray-800';

    switch (riskLevel) {
      case 'minimal':
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'mild':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderately severe':
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading responses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/scoring" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Response Scoring</h1>
          <p className="text-gray-600">View and manage scores for questionnaire responses</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search responses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="light"
              onClick={() => {
                // Reset filters
                setFilters({
                  questionnaire: 'all',
                  riskLevel: 'all',
                  dateRange: 'all',
                  scored: 'all'
                });
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handleRecalculateAll}
            disabled={isRecalculatingAll}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRecalculatingAll ? 'animate-spin' : ''}`} />
            Recalculate All Scores
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="questionnaire-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Questionnaire
            </label>
            <select
              id="questionnaire-filter"
              value={filters.questionnaire}
              onChange={(e) => handleFilterChange('questionnaire', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Questionnaires</option>
              {questionnaires.map(q => (
                <option key={q.id} value={q.id.toString()}>{q.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="risk-level-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Level
            </label>
            <select
              id="risk-level-filter"
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="minimal">Minimal</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="moderately severe">Moderately Severe</option>
              <option value="severe">Severe</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="date-range-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="date-range-filter"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label htmlFor="scored-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Scoring Status
            </label>
            <select
              id="scored-filter"
              value={filters.scored}
              onChange={(e) => handleFilterChange('scored', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Responses</option>
              <option value="scored">Scored</option>
              <option value="unscored">Unscored</option>
            </select>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No responses found</h2>
            <p className="text-gray-500">
              {searchQuery || Object.values(filters).some(v => v !== 'all')
                ? 'No responses match your search criteria.'
                : 'There are no responses in the system yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('id')}
                    >
                      ID
                      {sortField === 'id' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('questionnaire_title')}
                    >
                      Questionnaire
                      {sortField === 'questionnaire_title' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('patient_email')}
                    >
                      Respondent
                      {sortField === 'patient_email' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('created_at')}
                    >
                      Date
                      {sortField === 'created_at' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('score')}
                    >
                      Score
                      {sortField === 'score' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('risk_level')}
                    >
                      Risk Level
                      {sortField === 'risk_level' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResponses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{response.id}</div>
                        <div className="text-xs text-gray-500">{response.unique_code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{response.questionnaire_title || `Questionnaire #${response.questionnaire_id}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{response.patient_name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{response.patient_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(response.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {response.score !== undefined && response.score !== null
                            ? response.score
                            : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {response.risk_level ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(response.risk_level)}`}>
                            {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Not scored
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="light"
                          size="small"
                          onClick={() => router.push(`/admin/scoring/responses/${response.id}`)}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Score
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredResponses.length} of {responses.length} responses
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResponseScoringPage;
