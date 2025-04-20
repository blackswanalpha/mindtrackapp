'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Card, 
  Button, 
  Loading, 
  Alert 
} from '@/components/common';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar, 
  Users, 
  Clock, 
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import api from '@/services/api';

type QuestionnaireAnalyticsProps = {
  questionnaireId: number;
  timeRange?: 'week' | 'month' | 'year' | 'all';
};

const QuestionnaireAnalytics: React.FC<QuestionnaireAnalyticsProps> = ({
  questionnaireId,
  timeRange = 'month'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeView, setActiveView] = useState<'overview' | 'questions' | 'demographics'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year' | 'all'>(timeRange);

  // Colors for charts
  const COLORS = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
  const RISK_COLORS = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const data = await api.questionnaires.getAnalytics(questionnaireId, selectedTimeRange);
        
        // Mock data for demonstration
        const mockAnalytics = generateMockAnalytics(selectedTimeRange);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [questionnaireId, selectedTimeRange]);

  // Generate mock analytics data
  const generateMockAnalytics = (timeRange: string) => {
    // Generate different data based on time range
    const responsesCount = timeRange === 'week' ? 28 : 
                          timeRange === 'month' ? 120 : 
                          timeRange === 'year' ? 850 : 1200;
    
    // Generate daily/weekly/monthly response data
    const responseOverTime = generateTimeSeriesData(timeRange, responsesCount);
    
    // Generate question performance data
    const questionPerformance = [
      { id: 1, question: 'Feeling down or depressed', avgScore: 1.8, completion: 98 },
      { id: 2, question: 'Little interest in activities', avgScore: 2.1, completion: 97 },
      { id: 3, question: 'Trouble sleeping', avgScore: 2.4, completion: 95 },
      { id: 4, question: 'Feeling tired', avgScore: 2.7, completion: 96 },
      { id: 5, question: 'Poor appetite', avgScore: 1.5, completion: 94 },
      { id: 6, question: 'Feeling bad about yourself', avgScore: 1.9, completion: 92 },
      { id: 7, question: 'Trouble concentrating', avgScore: 2.0, completion: 93 },
      { id: 8, question: 'Moving slowly or being fidgety', avgScore: 1.7, completion: 91 },
      { id: 9, question: 'Thoughts of self-harm', avgScore: 0.8, completion: 90 }
    ];
    
    // Generate risk level distribution
    const riskLevels = {
      low: Math.floor(responsesCount * 0.6),
      medium: Math.floor(responsesCount * 0.3),
      high: Math.floor(responsesCount * 0.1)
    };
    
    // Generate demographic data
    const demographics = {
      age: [
        { name: '18-24', value: Math.floor(responsesCount * 0.2) },
        { name: '25-34', value: Math.floor(responsesCount * 0.35) },
        { name: '35-44', value: Math.floor(responsesCount * 0.25) },
        { name: '45-54', value: Math.floor(responsesCount * 0.15) },
        { name: '55+', value: Math.floor(responsesCount * 0.05) }
      ],
      gender: [
        { name: 'Female', value: Math.floor(responsesCount * 0.58) },
        { name: 'Male', value: Math.floor(responsesCount * 0.4) },
        { name: 'Non-binary', value: Math.floor(responsesCount * 0.02) }
      ]
    };
    
    return {
      summary: {
        total_responses: responsesCount,
        completion_rate: 94,
        avg_completion_time: 320, // seconds
        avg_score: 16.2,
        risk_levels: riskLevels
      },
      responseOverTime,
      questionPerformance,
      demographics
    };
  };

  // Generate time series data based on the selected time range
  const generateTimeSeriesData = (timeRange: string, totalResponses: number) => {
    let data = [];
    let dateFormat = '';
    let numPoints = 0;
    
    switch(timeRange) {
      case 'week':
        numPoints = 7;
        dateFormat = 'ddd';
        break;
      case 'month':
        numPoints = 30;
        dateFormat = 'MMM D';
        break;
      case 'year':
        numPoints = 12;
        dateFormat = 'MMM';
        break;
      default:
        numPoints = 12;
        dateFormat = 'MMM yyyy';
    }
    
    // Generate dates and response counts
    const now = new Date();
    for (let i = 0; i < numPoints; i++) {
      let date = new Date();
      
      if (timeRange === 'week') {
        date.setDate(now.getDate() - (numPoints - 1) + i);
      } else if (timeRange === 'month') {
        date.setDate(now.getDate() - (numPoints - 1) + i);
      } else if (timeRange === 'year') {
        date.setMonth(now.getMonth() - (numPoints - 1) + i);
      } else {
        date.setMonth(now.getMonth() - (numPoints - 1) + i);
        date.setFullYear(now.getFullYear() - 1);
      }
      
      // Format date based on time range
      const formattedDate = formatDate(date, dateFormat);
      
      // Generate a somewhat realistic distribution of responses
      let count;
      if (i === numPoints - 1) {
        // Last day/week/month might have fewer responses
        count = Math.floor(totalResponses / numPoints * 0.7);
      } else if (i === 0) {
        // First day/week/month might have fewer responses
        count = Math.floor(totalResponses / numPoints * 0.8);
      } else if (i % 2 === 0) {
        // Some variation
        count = Math.floor(totalResponses / numPoints * (0.9 + Math.random() * 0.3));
      } else {
        count = Math.floor(totalResponses / numPoints * (0.7 + Math.random() * 0.3));
      }
      
      data.push({
        date: formattedDate,
        responses: count
      });
    }
    
    return data;
  };

  // Format date helper
  const formatDate = (date: Date, format: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (format === 'ddd') {
      return days[date.getDay()];
    } else if (format === 'MMM D') {
      return `${months[date.getMonth()]} ${date.getDate()}`;
    } else if (format === 'MMM') {
      return months[date.getMonth()];
    } else {
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  };

  // Format seconds to minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading size="large" message="Loading analytics data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" message={error} />
    );
  }

  // Prepare data for risk level pie chart
  const riskLevelData = [
    { name: 'Low Risk', value: analytics.summary.risk_levels.low, color: RISK_COLORS.low },
    { name: 'Medium Risk', value: analytics.summary.risk_levels.medium, color: RISK_COLORS.medium },
    { name: 'High Risk', value: analytics.summary.risk_levels.high, color: RISK_COLORS.high }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Questionnaire Analytics</h2>
          <p className="text-gray-600">Insights and statistics for responses</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
          
          <Button
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => alert('Export functionality would be implemented here')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Analytics Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            activeView === 'overview' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveView('overview')}
        >
          <BarChart3 className="h-4 w-4 inline-block mr-1" />
          Overview
        </button>
        
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            activeView === 'questions' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveView('questions')}
        >
          <HelpCircle className="h-4 w-4 inline-block mr-1" />
          Question Analysis
        </button>
        
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            activeView === 'demographics' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveView('demographics')}
        >
          <Users className="h-4 w-4 inline-block mr-1" />
          Demographics
        </button>
      </div>
      
      {/* Overview View */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Responses</p>
                  <h3 className="text-2xl font-bold text-gray-800">{analytics.summary.total_responses.toLocaleString()}</h3>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <h3 className="text-2xl font-bold text-gray-800">{analytics.summary.completion_rate}%</h3>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Completion Time</p>
                  <h3 className="text-2xl font-bold text-gray-800">{formatTime(analytics.summary.avg_completion_time)}</h3>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">High Risk Responses</p>
                  <h3 className="text-2xl font-bold text-gray-800">{analytics.summary.risk_levels.high.toLocaleString()}</h3>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Response Over Time Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Responses Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.responseOverTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="responses" fill="#4f46e5" name="Responses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Risk Level Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Level Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <div>
                      <p className="font-medium">Low Risk</p>
                      <p className="text-gray-600">{analytics.summary.risk_levels.low.toLocaleString()} responses ({Math.round((analytics.summary.risk_levels.low / analytics.summary.total_responses) * 100)}%)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
                    <div>
                      <p className="font-medium">Medium Risk</p>
                      <p className="text-gray-600">{analytics.summary.risk_levels.medium.toLocaleString()} responses ({Math.round((analytics.summary.risk_levels.medium / analytics.summary.total_responses) * 100)}%)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <div>
                      <p className="font-medium">High Risk</p>
                      <p className="text-gray-600">{analytics.summary.risk_levels.high.toLocaleString()} responses ({Math.round((analytics.summary.risk_levels.high / analytics.summary.total_responses) * 100)}%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Question Analysis View */}
      {activeView === 'questions' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score Distribution
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.questionPerformance.map((question: any) => (
                    <tr key={question.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {question.question}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {question.avgScore.toFixed(1)} / 3.0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {question.completion}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${(question.avgScore / 3) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Completion Rates</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.questionPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="question" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completion" fill="#4f46e5" name="Completion Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
      
      {/* Demographics View */}
      {activeView === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Age Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.demographics.age}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.demographics.age.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.demographics.gender}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.demographics.gender.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Demographic Insights</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Age Insights:</strong> The majority of respondents (35%) are in the 25-34 age group, followed by 35-44 (25%). 
                This suggests that your questionnaire is most effective with young to middle-aged adults.
              </p>
              
              <p className="text-gray-700">
                <strong>Gender Insights:</strong> There is a higher proportion of female respondents (58%) compared to male (40%). 
                Consider whether this reflects your target demographic or if you need to adjust your outreach strategies.
              </p>
              
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <p className="text-indigo-700">
                  <strong>Recommendation:</strong> Based on demographic data, consider creating targeted versions of your questionnaire 
                  for different age groups to improve engagement and completion rates.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireAnalytics;
