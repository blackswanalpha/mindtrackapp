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
  RefreshCw,
  Eye,
  Mail,
  QrCode
} from 'lucide-react';
import api from '@/services/api';

type Response = {
  id: number;
  questionnaire_id: number;
  patient_email: string;
  patient_name?: string;
  score?: number;
  risk_level?: string;
  flagged_for_review: boolean;
  completed_at: string;
  created_at: string;
  completion_time?: number;
  unique_code: string;
  has_analysis?: boolean;
};

type Questionnaire = {
  id: number;
  organization_id: number;
  title: string;
  description?: string;
  type: string;
  category?: string;
};

const QuestionnaireResponsesPage = () => {
  const { id, questionnaireId } = useParams();
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponses, setSelectedResponses] = useState<number[]>([]);

  // Filters
  const [riskLevelFilter, setRiskLevelFilter] = useState<string | 'all'>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<boolean | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const questionnaireData = await api.questionnaires.getById(Number(questionnaireId));
        // const organizationData = await api.organizations.getById(Number(id));
        // const responsesData = await api.responses.getByQuestionnaire(Number(questionnaireId));

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

        // Generate mock responses
        const mockResponses: Response[] = [];
        const responseCount = Math.floor(Math.random() * 20) + 10; // 10-30 responses

        for (let i = 1; i <= responseCount; i++) {
          const score = Math.floor(Math.random() * 27); // 0-27 for PHQ-9
          let riskLevel = 'low';

          if (score > 20) {
            riskLevel = 'high';
          } else if (score > 10) {
            riskLevel = 'medium';
          }

          const flagged = Math.random() > 0.8; // 20% chance of being flagged
          const hasAnalysis = Math.random() > 0.7; // 30% chance of having analysis

          // Generate a date within the last month
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));

          mockResponses.push({
            id: i,
            questionnaire_id: Number(questionnaireId),
            patient_email: `patient${i}@example.com`,
            patient_name: Math.random() > 0.3 ? `Patient ${i}` : undefined, // 70% chance of having a name
            score,
            risk_level: riskLevel,
            flagged_for_review: flagged,
            completed_at: date.toISOString(),
            created_at: date.toISOString(),
            completion_time: Math.floor(Math.random() * 10) + 2, // 2-12 minutes
            unique_code: `R${questionnaireId}${i}${Math.floor(Math.random() * 1000)}`,
            has_analysis: hasAnalysis
          });
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setQuestionnaire(mockQuestionnaire);
        setOrganization(mockOrganization);
        setResponses(mockResponses);
        setFilteredResponses(mockResponses);
      } catch (err) {
        setError('Failed to load responses');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && questionnaireId) {
      fetchData();
    }
  }, [id, questionnaireId]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...responses];

    // Apply risk level filter
    if (riskLevelFilter !== 'all') {
      filtered = filtered.filter(response => response.risk_level === riskLevelFilter);
    }

    // Apply flagged filter
    if (flaggedFilter !== 'all') {
      filtered = filtered.filter(response => response.flagged_for_review === flaggedFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        response =>
          (response.patient_email && response.patient_email.toLowerCase().includes(query)) ||
          (response.patient_name && response.patient_name.toLowerCase().includes(query)) ||
          (response.unique_code && response.unique_code.toLowerCase().includes(query))
      );
    }

    // Apply date range
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      if (dateRange === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }

      filtered = filtered.filter(response => new Date(response.created_at) >= startDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Response];
      let bValue: any = b[sortField as keyof Response];

      // Handle undefined values
      if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      // Handle date strings
      if (typeof aValue === 'string' && (sortField === 'created_at' || sortField === 'completed_at')) {
        return sortDirection === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // Handle strings
      if (typeof aValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numbers
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredResponses(filtered);
  }, [responses, riskLevelFilter, flaggedFilter, searchQuery, dateRange, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle select all responses
  const handleSelectAll = () => {
    if (selectedResponses.length === filteredResponses.length) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(filteredResponses.map(r => r.id));
    }
  };

  // Handle select individual response
  const handleSelectResponse = (responseId: number) => {
    if (selectedResponses.includes(responseId)) {
      setSelectedResponses(selectedResponses.filter(id => id !== responseId));
    } else {
      setSelectedResponses([...selectedResponses, responseId]);
    }
  };

  // Handle flag toggle
  const handleFlag = async (responseId: number, flagged: boolean) => {
    try {
      // In a real implementation, this would call the API
      // await api.responses.flag(responseId, flagged);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setResponses(responses.map(r =>
        r.id === responseId ? { ...r, flagged_for_review: flagged } : r
      ));

      alert(`Response ${flagged ? 'flagged' : 'unflagged'} successfully`);
    } catch (err) {
      setError('Failed to update flag status');
    }
  };

  // Handle export
  const handleExport = () => {
    const selectedIds = selectedResponses.length > 0 ? selectedResponses : filteredResponses.map(r => r.id);

    if (selectedIds.length === 0) {
      alert('No responses to export');
      return;
    }

    alert(`Exporting ${selectedIds.length} responses...`);
    // In a real implementation, this would call the API to generate and download a CSV/Excel file
  };

  // Handle send email
  const handleSendEmail = () => {
    const selectedIds = selectedResponses.length > 0 ? selectedResponses : [];

    if (selectedIds.length === 0) {
      alert('No responses selected for email');
      return;
    }

    router.push(`/admin/email/send?responses=${selectedIds.join(',')}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading responses..." />
      </div>
    );
  }

  if (error || !questionnaire || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load responses'} />
        <div className="mt-4">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}`)}>
            Back to Questionnaire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/admin/organizations/${id}/questionnaires/${questionnaireId}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Responses</h1>
          <p className="text-gray-600">
            {questionnaire.title} • {organization.name}
          </p>
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

            <select
              value={riskLevelFilter}
              onChange={(e) => setRiskLevelFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select
              value={String(flaggedFilter)}
              onChange={(e) => setFlaggedFilter(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Responses</option>
              <option value="true">Flagged</option>
              <option value="false">Not Flagged</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExport}
              disabled={filteredResponses.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendEmail}
              disabled={selectedResponses.length === 0}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Selected
            </Button>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No responses found</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery || riskLevelFilter !== 'all' || flaggedFilter !== 'all' || dateRange !== 'all'
                ? 'No responses match your search criteria.'
                : 'This questionnaire doesn\'t have any responses yet.'}
            </p>
            {!searchQuery && riskLevelFilter === 'all' && flaggedFilter === 'all' && dateRange === 'all' && (
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/qr-code`)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedResponses.length === filteredResponses.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('patient_email')}
                  >
                    <div className="flex items-center">
                      <span>Respondent</span>
                      {sortField === 'patient_email' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center">
                      <span>Score</span>
                      {sortField === 'score' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('risk_level')}
                  >
                    <div className="flex items-center">
                      <span>Risk Level</span>
                      {sortField === 'risk_level' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      {sortField === 'created_at' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('completion_time')}
                  >
                    <div className="flex items-center">
                      <span>Time</span>
                      {sortField === 'completion_time' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((response) => (
                  <tr key={response.id} className={`hover:bg-gray-50 ${response.flagged_for_review ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedResponses.includes(response.id)}
                        onChange={() => handleSelectResponse(response.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.patient_name || 'Anonymous'}
                      </div>
                      {response.patient_email && (
                        <div className="text-sm text-gray-500">{response.patient_email}</div>
                      )}
                      <div className="text-xs text-gray-400">{response.unique_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.score !== undefined ? response.score : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {response.risk_level && (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelBadge(response.risk_level)}`}>
                          {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(response.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.completion_time ? `${response.completion_time} min` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${response.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Response"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleFlag(response.id, !response.flagged_for_review)}
                          className={response.flagged_for_review ? "text-yellow-600 hover:text-yellow-900" : "text-gray-400 hover:text-gray-600"}
                          title={response.flagged_for_review ? "Unflag" : "Flag for Review"}
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/email/send?responses=${response.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Link>
                        {response.has_analysis ? (
                          <Link
                            href={`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${response.id}?tab=analysis`}
                            className="text-purple-600 hover:text-purple-900"
                            title="View AI Analysis"
                          >
                            <Brain className="h-4 w-4" />
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${response.id}?tab=analysis`}
                            className="text-gray-400 hover:text-gray-600"
                            title="Generate AI Analysis"
                          >
                            <Brain className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredResponses.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredResponses.length} of {responses.length} responses
            </div>
            <div className="flex space-x-2">
              <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </Button>
              <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionnaireResponsesPage;
