'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  HelpCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import api from '@/services/api';
import UserMetricsSection from '@/components/analysis/UserMetricsSection';
import AIInsightsSection from '@/components/analysis/AIInsightsSection';

// Define types
type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

const AnalysisPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch metrics data from API
        const metricsData = await api.metrics.getUserMetrics({ timeRange });

        // For insights, we'll still use mock data until AI analysis API is ready
        const mockInsights = getMockInsights(timeRange);

        setMetrics(metricsData);
        setInsights(mockInsights);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load analysis data. Please try again.');

        // Fallback to mock data if API request fails
        const mockMetrics = getMockMetrics(timeRange);
        const mockInsights = getMockInsights(timeRange);

        setMetrics(mockMetrics);
        setInsights(mockInsights);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch fresh data from API
      const metricsData = await api.metrics.getUserMetrics({ timeRange });

      // For insights, we'll still use mock data until AI analysis API is ready
      const mockInsights = getMockInsights(timeRange);

      setMetrics(metricsData);
      setInsights(mockInsights);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');

      // Fallback to mock data if API request fails
      const mockMetrics = getMockMetrics(timeRange);
      const mockInsights = getMockInsights(timeRange);

      setMetrics(mockMetrics);
      setInsights(mockInsights);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" message="Loading analysis data..." />
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Activity className="h-8 w-8 mr-3 text-indigo-600" />
              Analysis Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive insights and metrics for your questionnaires and users
            </p>
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
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              User Metrics
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewDashboard metrics={metrics} insights={insights} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserMetricsSection metrics={metrics} timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIInsightsSection insights={insights} timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

// Overview Dashboard Component
const OverviewDashboard = ({ metrics, insights }: { metrics: any, insights: any }) => {
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
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{metrics.totalUsers}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{metrics.userGrowth}% from last period
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
                <p className="text-sm font-medium text-gray-500">Responses</p>
                <h3 className="text-2xl font-bold text-gray-800">{metrics.totalResponses}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{metrics.responseGrowth}% from last period
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
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <h3 className="text-2xl font-bold text-gray-800">{metrics.completionRate}%</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{metrics.completionRateGrowth}% from last period
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
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <h3 className="text-2xl font-bold text-gray-800">{metrics.averageScore}</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                {metrics.scoreChange}% from last period
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
              Response Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.responseTrend}>
                  <defs>
                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorResponses)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {metrics.riskDistribution.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} responses`, 'Count']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.keyInsights.map((insight: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${insight.iconBg} mr-3 mt-1`}>
                    <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// Mock data functions
const getMockMetrics = (timeRange: TimeRange) => {
  // This would be replaced with actual API data
  return {
    totalUsers: 256,
    userGrowth: 12.5,
    totalResponses: 1842,
    responseGrowth: 8.3,
    completionRate: 87,
    completionRateGrowth: 3.2,
    averageScore: 14.7,
    scoreChange: -2.1,
    activeUsers: 187,
    activeUserGrowth: 8.2,
    inactiveUsers: 69,
    inactiveUserGrowth: 3.5,
    avgEngagement: 6.3,
    engagementGrowth: 12.7,
    responseTrend: [
      { date: 'Jan', responses: 65 },
      { date: 'Feb', responses: 78 },
      { date: 'Mar', responses: 90 },
      { date: 'Apr', responses: 81 },
      { date: 'May', responses: 110 },
      { date: 'Jun', responses: 125 },
      { date: 'Jul', responses: 150 },
    ],
    riskDistribution: [
      { name: 'Low', value: 120, color: '#10b981' },
      { name: 'Medium', value: 80, color: '#f59e0b' },
      { name: 'High', value: 40, color: '#ef4444' },
    ],
    userActivity: [
      { date: 'Mon', active: 42 },
      { date: 'Tue', active: 38 },
      { date: 'Wed', active: 45 },
      { date: 'Thu', active: 39 },
      { date: 'Fri', active: 48 },
      { date: 'Sat', active: 30 },
      { date: 'Sun', active: 27 },
    ],
    activityByDay: [
      { day: 'Mon', logins: 42, submissions: 28 },
      { day: 'Tue', logins: 38, submissions: 25 },
      { day: 'Wed', logins: 45, submissions: 32 },
      { day: 'Thu', logins: 39, submissions: 27 },
      { day: 'Fri', logins: 48, submissions: 35 },
      { day: 'Sat', logins: 30, submissions: 18 },
      { day: 'Sun', logins: 27, submissions: 15 },
    ],
    activityByTime: [
      { hour: '00:00', activity: 5 },
      { hour: '03:00', activity: 2 },
      { hour: '06:00', activity: 8 },
      { hour: '09:00', activity: 35 },
      { hour: '12:00', activity: 42 },
      { hour: '15:00', activity: 47 },
      { hour: '18:00', activity: 38 },
      { hour: '21:00', activity: 25 },
    ],
    engagementMetrics: [
      { metric: 'Completion Rate', current: 87, previous: 82 },
      { metric: 'Avg. Time Spent', current: 65, previous: 58 },
      { metric: 'Return Rate', current: 42, previous: 38 },
      { metric: 'Questions Answered', current: 95, previous: 90 },
      { metric: 'Feedback Given', current: 28, previous: 20 },
    ],
    completionRates: [
      { questionnaire: 'Depression', rate: 92 },
      { questionnaire: 'Anxiety', rate: 88 },
      { questionnaire: 'Stress', rate: 85 },
      { questionnaire: 'Sleep', rate: 78 },
      { questionnaire: 'Nutrition', rate: 72 },
    ],
    retention: [
      { week: 'Week 1', rate: 100 },
      { week: 'Week 2', rate: 85 },
      { week: 'Week 3', rate: 72 },
      { week: 'Week 4', rate: 68 },
      { week: 'Week 5', rate: 65 },
      { week: 'Week 6', rate: 62 },
      { week: 'Week 7', rate: 60 },
      { week: 'Week 8', rate: 58 },
    ],
    userMetrics: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        completedQuestionnaires: 8,
        averageScore: 12.5,
        lastActive: '2023-06-15T10:30:00Z',
        riskLevel: 'moderate'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        completedQuestionnaires: 5,
        averageScore: 7.2,
        lastActive: '2023-06-18T14:45:00Z',
        riskLevel: 'mild'
      },
      {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert@example.com',
        completedQuestionnaires: 12,
        averageScore: 18.3,
        lastActive: '2023-06-10T09:15:00Z',
        riskLevel: 'moderately severe'
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        completedQuestionnaires: 3,
        averageScore: 4.1,
        lastActive: '2023-06-20T16:20:00Z',
        riskLevel: 'minimal'
      },
      {
        id: 5,
        name: 'Michael Wilson',
        email: 'michael@example.com',
        completedQuestionnaires: 10,
        averageScore: 15.8,
        lastActive: '2023-06-17T08:15:00Z',
        riskLevel: 'moderate'
      },
      {
        id: 6,
        name: 'Sarah Brown',
        email: 'sarah@example.com',
        completedQuestionnaires: 7,
        averageScore: 9.3,
        lastActive: '2023-06-19T11:20:00Z',
        riskLevel: 'mild'
      },
    ]
  };
};

const getMockInsights = (timeRange: TimeRange) => {
  // This would be replaced with actual API data
  return {
    keyInsights: [
      {
        title: 'Increasing High-Risk Responses',
        description: 'There has been a 15% increase in high-risk responses over the past month, primarily in the depression assessment questionnaire.',
        icon: TrendingUp,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100'
      },
      {
        title: 'Improved Completion Rates',
        description: 'Questionnaire completion rates have improved by 8% since implementing the new progress indicator.',
        icon: Activity,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100'
      },
      {
        title: 'User Engagement Pattern',
        description: 'Users are most active on Wednesdays and Fridays, suggesting optimal times for sending reminders.',
        icon: Users,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100'
      },
      {
        title: 'Question Difficulty Identified',
        description: 'Question #7 in the anxiety assessment has the lowest completion rate (68%), suggesting it may need revision.',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100'
      }
    ],
    insightDistribution: [
      { category: 'User Behavior', count: 12 },
      { category: 'Questionnaire Design', count: 8 },
      { category: 'Risk Assessment', count: 15 },
      { category: 'Performance', count: 6 },
      { category: 'Engagement', count: 10 },
    ],
    trendAnalysis: [
      {
        title: 'Seasonal Pattern Detected',
        description: 'Response scores tend to increase during winter months, with January showing the highest average scores.',
        importance: 'high'
      },
      {
        title: 'Demographic Correlation',
        description: 'Users in the 25-34 age group show significantly lower risk scores compared to other age groups.',
        importance: 'medium'
      },
      {
        title: 'Question Sequence Impact',
        description: 'Users who complete questions in order have 12% higher completion rates than those who skip around.',
        importance: 'medium'
      }
    ],
    scoreTrends: [
      { month: 'Jan', avgScore: 12.5, trendline: 12.5 },
      { month: 'Feb', avgScore: 13.2, trendline: 13.0 },
      { month: 'Mar', avgScore: 14.1, trendline: 13.5 },
      { month: 'Apr', avgScore: 13.8, trendline: 14.0 },
      { month: 'May', avgScore: 14.5, trendline: 14.5 },
      { month: 'Jun', avgScore: 15.2, trendline: 15.0 },
      { month: 'Jul', avgScore: 14.7, trendline: 15.5 },
    ],
    completionTimeTrends: [
      { month: 'Jan', avgTime: 8.2 },
      { month: 'Feb', avgTime: 7.8 },
      { month: 'Mar', avgTime: 7.5 },
      { month: 'Apr', avgTime: 7.2 },
      { month: 'May', avgTime: 6.8 },
      { month: 'Jun', avgTime: 6.5 },
      { month: 'Jul', avgTime: 6.3 },
    ],
    recommendations: [
      {
        title: 'Implement Follow-up System',
        description: 'Create an automated follow-up system for high-risk responses to improve intervention rates.',
        impact: 'high',
        effort: 'medium'
      },
      {
        title: 'Optimize Question Wording',
        description: 'Revise the wording of Question #7 in the anxiety assessment to improve clarity and completion rates.',
        impact: 'medium',
        effort: 'low'
      },
      {
        title: 'Add Mobile Notifications',
        description: 'Implement mobile notifications for questionnaire reminders to increase completion rates.',
        impact: 'high',
        effort: 'high'
      }
    ],
    recommendationMatrix: [
      { title: 'Implement Follow-up System', impactValue: 85, effortValue: 50, impact: 'High', effort: 'Medium', size: 200 },
      { title: 'Optimize Question Wording', impactValue: 60, effortValue: 20, impact: 'Medium', effort: 'Low', size: 150 },
      { title: 'Add Mobile Notifications', impactValue: 80, effortValue: 75, impact: 'High', effort: 'High', size: 180 },
      { title: 'Improve Email Templates', impactValue: 45, effortValue: 30, impact: 'Medium', effort: 'Low', size: 120 },
      { title: 'Add Progress Indicators', impactValue: 55, effortValue: 25, impact: 'Medium', effort: 'Low', size: 140 },
    ],
    recommendationCategories: [
      { name: 'UX Improvements', value: 8, color: '#3b82f6' },
      { name: 'Content Changes', value: 5, color: '#10b981' },
      { name: 'Technical Features', value: 7, color: '#8b5cf6' },
      { name: 'Process Changes', value: 4, color: '#f59e0b' },
    ],
    scoreVsTime: [
      { completionTime: 4.5, score: 8.2 },
      { completionTime: 5.2, score: 10.5 },
      { completionTime: 6.8, score: 12.3 },
      { completionTime: 7.5, score: 14.8 },
      { completionTime: 8.3, score: 15.2 },
      { completionTime: 9.1, score: 16.7 },
      { completionTime: 10.2, score: 18.5 },
      { completionTime: 5.8, score: 9.8 },
      { completionTime: 7.2, score: 13.5 },
      { completionTime: 8.7, score: 15.9 },
    ],
    questionCorrelations: [
      { question: 1, correlatedWith: 5, strength: 0.85 },
      { question: 2, correlatedWith: 7, strength: 0.72 },
      { question: 3, correlatedWith: 9, strength: 0.68 },
      { question: 4, correlatedWith: 8, strength: 0.45 },
      { question: 6, correlatedWith: 10, strength: 0.92 },
    ],
    correlationInsights: [
      { description: 'Questions about sleep quality (Q6) and energy levels (Q10) show the strongest correlation (92%), suggesting these factors are closely related.' },
      { description: 'Users who score high on anxiety questions (Q1-Q3) tend to also score high on depression questions (Q5-Q7), with 78% correlation.' },
      { description: 'Completion time has a positive correlation (65%) with overall score, suggesting users who take more time tend to report more symptoms.' },
      { description: 'Questions about concentration (Q4) and memory (Q8) show moderate correlation (45%), lower than expected for cognitive symptoms.' },
    ]
  };
};

export default AnalysisPage;
