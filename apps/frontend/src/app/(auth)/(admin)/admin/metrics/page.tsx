'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Loading, Alert, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Users, Calendar, Filter } from 'lucide-react';
import api from '@/services/api';

// Define types
type UserMetric = {
  id: number;
  name: string;
  email: string;
  completedQuestionnaires: number;
  averageScore: number;
  lastActive: string;
  riskLevel: string;
};

type QuestionnaireCompletion = {
  date: string;
  count: number;
};

type RiskDistribution = {
  name: string;
  value: number;
};

const UserMetricsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userMetrics, setUserMetrics] = useState<UserMetric[]>([]);
  const [completionData, setCompletionData] = useState<QuestionnaireCompletion[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([]);
  const [timeRange, setTimeRange] = useState('week');
  const [sortBy, setSortBy] = useState('lastActive');
  const [sortOrder, setSortOrder] = useState('desc');

  // Colors for risk levels
  const RISK_COLORS = {
    minimal: '#4ade80', // green
    low: '#a3e635', // lime
    mild: '#facc15', // yellow
    moderate: '#fb923c', // orange
    high: '#f87171', // red
    'moderately severe': '#ef4444', // red
    severe: '#dc2626', // dark red
  };

  // Fetch user metrics data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // In a real app, we would fetch this data from the API
        // For now, we'll use mock data

        // Mock user metrics
        const mockUserMetrics: UserMetric[] = [
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
            completedQuestionnaires: 7,
            averageScore: 15.8,
            lastActive: '2023-06-12T11:10:00Z',
            riskLevel: 'moderate'
          }
        ];

        // Mock completion data (last 7 days)
        const mockCompletionData: QuestionnaireCompletion[] = [
          { date: '2023-06-15', count: 12 },
          { date: '2023-06-16', count: 8 },
          { date: '2023-06-17', count: 15 },
          { date: '2023-06-18', count: 10 },
          { date: '2023-06-19', count: 7 },
          { date: '2023-06-20', count: 14 },
          { date: '2023-06-21', count: 9 }
        ];

        // Mock risk distribution
        const mockRiskDistribution: RiskDistribution[] = [
          { name: 'Minimal', value: 15 },
          { name: 'Mild', value: 25 },
          { name: 'Moderate', value: 35 },
          { name: 'Moderately Severe', value: 18 },
          { name: 'Severe', value: 7 }
        ];

        setUserMetrics(mockUserMetrics);
        setCompletionData(mockCompletionData);
        setRiskDistribution(mockRiskDistribution);
      } catch (error) {
        console.error('Error fetching user metrics:', error);
        setError('Failed to load user metrics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Sort user metrics
  const sortedUserMetrics = [...userMetrics].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'completedQuestionnaires') {
      return sortOrder === 'asc' ? a.completedQuestionnaires - b.completedQuestionnaires : b.completedQuestionnaires - a.completedQuestionnaires;
    } else if (sortBy === 'averageScore') {
      return sortOrder === 'asc' ? a.averageScore - b.averageScore : b.averageScore - a.averageScore;
    } else if (sortBy === 'lastActive') {
      return sortOrder === 'asc' ? new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime() : new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    } else if (sortBy === 'riskLevel') {
      const riskLevels = ['minimal', 'low', 'mild', 'moderate', 'moderately severe', 'high', 'severe'];
      const aIndex = riskLevels.indexOf(a.riskLevel.toLowerCase());
      const bIndex = riskLevels.indexOf(b.riskLevel.toLowerCase());
      return sortOrder === 'asc' ? aIndex - bIndex : bIndex - aIndex;
    }
    return 0;
  });

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading user metrics..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">User Metrics</h1>
        <p className="text-gray-600">
          Track user engagement, questionnaire completion, and risk distribution.
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6 flex items-center">
        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-700 mr-4">Time Range:</span>
        <div className="flex space-x-2">
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <Button
              key={range}
              className={timeRange === range ? 'bg-blue-600 text-white hover:bg-blue-700 text-sm py-1 px-3' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-1 px-3'}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">Total Users</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">{userMetrics.length}</span>
              <span className="ml-2 text-sm text-green-600">+12% from last {timeRange}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">Completed Questionnaires</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">
                {completionData.reduce((sum, item) => sum + item.count, 0)}
              </span>
              <span className="ml-2 text-sm text-green-600">+8% from last {timeRange}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                <PieChartIcon className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">Average Risk Level</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">Moderate</span>
              <span className="ml-2 text-sm text-yellow-600">No change from last {timeRange}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Questionnaire Completions</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Completions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Level Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={RISK_COLORS[entry.name.toLowerCase().replace(' ', '_') as keyof typeof RISK_COLORS] || '#8884d8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* User Metrics Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Details</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('name')}
                  >
                    <div className="flex items-center">
                      User
                      {sortBy === 'name' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('completedQuestionnaires')}
                  >
                    <div className="flex items-center">
                      Completed
                      {sortBy === 'completedQuestionnaires' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('averageScore')}
                  >
                    <div className="flex items-center">
                      Avg. Score
                      {sortBy === 'averageScore' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('lastActive')}
                  >
                    <div className="flex items-center">
                      Last Active
                      {sortBy === 'lastActive' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('riskLevel')}
                  >
                    <div className="flex items-center">
                      Risk Level
                      {sortBy === 'riskLevel' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUserMetrics.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.completedQuestionnaires}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.averageScore.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.riskLevel === 'minimal' || user.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          user.riskLevel === 'mild' || user.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          user.riskLevel === 'moderately severe' || user.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}
                      >
                        {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserMetricsPage;
