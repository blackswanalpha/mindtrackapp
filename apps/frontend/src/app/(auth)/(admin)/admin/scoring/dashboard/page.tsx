'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select
} from '@/components/common';
import {
  BarChart3,
  PieChart,
  Users,
  Brain,
  Calendar,
  Filter,
  TrendingUp,
  RefreshCw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import ScoreVisualizer from '@/components/scoring/ScoreVisualizer';
import ScoringMetricsSection from '@/components/scoring/ScoringMetricsSection';
import ScoringDistributionSection from '@/components/scoring/ScoringDistributionSection';

// Define types
type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';
type QuestionnaireFilter = number | 'all';

const ScoringDashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [questionnaireFilter, setQuestionnaireFilter] = useState<QuestionnaireFilter>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [scoringData, setScoringData] = useState<any>(null);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch questionnaires for filter
        const questionnaireResponse = await api.questionnaires.getAll();
        const questionnaireData = Array.isArray(questionnaireResponse)
          ? questionnaireResponse
          : (questionnaireResponse?.questionnaires || []);
        setQuestionnaires(questionnaireData);

        // In a real implementation, these would be API calls
        // const scoringData = await api.scoring.getDashboardData({
        //   timeRange,
        //   questionnaireId: questionnaireFilter !== 'all' ? questionnaireFilter : undefined
        // });

        // Mock data for demonstration
        const mockScoringData = getMockScoringData(timeRange, questionnaireFilter);
        setScoringData(mockScoringData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load scoring dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, questionnaireFilter]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // In a real implementation, this would refresh the data
      // await fetchData();

      // Mock refresh for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update mock data
      const mockScoringData = getMockScoringData(timeRange, questionnaireFilter);
      setScoringData(mockScoringData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  // Handle questionnaire filter change
  const handleQuestionnaireFilterChange = (value: string) => {
    setQuestionnaireFilter(value === 'all' ? 'all' : Number(value));
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" message="Loading scoring dashboard..." />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <div className="mt-4">
          <Button variant="primary" onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Link href="/admin/scoring" className="text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-indigo-600" />
                Scoring Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive metrics and visualizations for questionnaire scoring
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
              options={[
                { value: 'week', label: 'Last Week' },
                { value: 'month', label: 'Last Month' },
                { value: 'quarter', label: 'Last Quarter' },
                { value: 'year', label: 'Last Year' },
                { value: 'all', label: 'All Time' }
              ]}
              className="w-[180px]"
            />

            <Select
              value={questionnaireFilter === 'all' ? 'all' : questionnaireFilter.toString()}
              onChange={(e) => handleQuestionnaireFilterChange(e.target.value)}
              options={[
                { value: 'all', label: 'All Questionnaires' },
                ...questionnaires.map(q => ({ value: q.id.toString(), label: q.title }))
              ]}
              className="w-[220px]"
            />

            <Button
              variant="light"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Scoring Metrics
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Score Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ScoringOverview data={scoringData} />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <ScoringMetricsSection data={scoringData} timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <ScoringDistributionSection data={scoringData} timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

// Scoring Overview Component
const ScoringOverview = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Responses</p>
                <h3 className="text-2xl font-bold text-gray-800">{data.totalResponses}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{data.responseGrowth}% from last period
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <h3 className="text-2xl font-bold text-gray-800">{data.averageScore}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${data.scoreChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${data.scoreChange < 0 ? 'transform rotate-180' : ''}`} />
                {data.scoreChange >= 0 ? '+' : ''}{data.scoreChange}% from last period
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Scored Responses</p>
                <h3 className="text-2xl font-bold text-gray-800">{data.scoredResponses}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                {data.scoringRate}% of all responses
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Risk Responses</p>
                <h3 className="text-2xl font-bold text-gray-800">{data.highRiskResponses}</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                {data.highRiskRate}% of scored responses
              </span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Score Trends
            </h3>
            <div className="h-80">
              {data.scoreTrend && (
                <div className="w-full h-full">
                  {/* Score trend chart will be rendered here */}
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Score trend chart will be displayed here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Risk Level Distribution
            </h3>
            <div className="h-80">
              {data.riskDistribution && (
                <div className="w-full h-full">
                  {/* Risk distribution chart will be rendered here */}
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Risk distribution chart will be displayed here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent High Risk Responses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
              Recent High Risk Responses
            </h3>
            <Button
              variant="light"
              onClick={() => {}}
              className="text-sm"
            >
              View All
            </Button>
          </div>

          {data.recentHighRiskResponses && data.recentHighRiskResponses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questionnaire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.recentHighRiskResponses.map((response: any) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{response.questionnaire}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{response.score}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          response.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          response.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {response.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="light"
                          onClick={() => {}}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No high risk responses found</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

// Mock data function
const getMockScoringData = (timeRange: TimeRange, questionnaireFilter: QuestionnaireFilter) => {
  // This would be replaced with actual API data
  return {
    totalResponses: 1842,
    responseGrowth: 8.3,
    averageScore: 14.7,
    scoreChange: -2.1,
    scoredResponses: 1756,
    scoringRate: 95.3,
    highRiskResponses: 128,
    highRiskRate: 7.3,
    scoreTrend: [
      { date: 'Jan', avgScore: 12.5 },
      { date: 'Feb', avgScore: 13.2 },
      { date: 'Mar', avgScore: 14.8 },
      { date: 'Apr', avgScore: 15.3 },
      { date: 'May', avgScore: 14.9 },
      { date: 'Jun', avgScore: 14.2 },
      { date: 'Jul', avgScore: 14.7 },
    ],
    riskDistribution: [
      { name: 'Low', value: 1120, color: '#10b981' },
      { name: 'Moderate', value: 508, color: '#f59e0b' },
      { name: 'High', value: 128, color: '#ef4444' },
    ],
    recentHighRiskResponses: [
      { id: 1, questionnaire: 'PHQ-9 Depression Assessment', score: 22, riskLevel: 'High', date: '2023-07-15' },
      { id: 2, questionnaire: 'GAD-7 Anxiety Assessment', score: 18, riskLevel: 'High', date: '2023-07-14' },
      { id: 3, questionnaire: 'PHQ-9 Depression Assessment', score: 21, riskLevel: 'High', date: '2023-07-13' },
      { id: 4, questionnaire: 'Well-being Assessment', score: 32, riskLevel: 'High', date: '2023-07-12' },
      { id: 5, questionnaire: 'GAD-7 Anxiety Assessment', score: 17, riskLevel: 'High', date: '2023-07-11' },
    ],
    questionnaireScoringData: [
      { name: 'PHQ-9', avgScore: 15.2, responses: 623, highRiskRate: 9.8 },
      { name: 'GAD-7', avgScore: 13.8, responses: 542, highRiskRate: 7.2 },
      { name: 'Well-being', avgScore: 68.4, responses: 321, highRiskRate: 4.3 },
      { name: 'Stress Assessment', avgScore: 22.1, responses: 270, highRiskRate: 6.7 },
    ],
    scoreDistribution: [
      { score: '0-5', count: 245 },
      { score: '6-10', count: 412 },
      { score: '11-15', count: 587 },
      { score: '16-20', count: 384 },
      { score: '21-25', count: 128 },
      { score: '26-30', count: 0 },
    ],
  };
};

export default ScoringDashboardPage;
