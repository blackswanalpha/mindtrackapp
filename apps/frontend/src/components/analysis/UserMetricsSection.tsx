'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Button,
  Input,
  Select,
  Badge
} from '@/components/common';
import UserDemographicsSection from './UserDemographicsSection';
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Calendar,
  BarChart2,
  PieChart,
  Download,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  Activity
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
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

type UserMetricsSectionProps = {
  metrics: any;
  timeRange: string;
};

const UserMetricsSection: React.FC<UserMetricsSectionProps> = ({ metrics, timeRange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastActive');
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    activity: true,
    engagement: true,
    demographics: true,
    users: true
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter users based on search query and risk filter
  const filteredUsers = metrics.userMetrics.filter((user: any) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      riskFilter === 'all' ||
      user.riskLevel.toLowerCase().includes(riskFilter.toLowerCase());

    return matchesSearch && matchesRisk;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'completedQuestionnaires':
        return b.completedQuestionnaires - a.completedQuestionnaires;
      case 'averageScore':
        return b.averageScore - a.averageScore;
      case 'riskLevel':
        return getRiskLevelValue(b.riskLevel) - getRiskLevelValue(a.riskLevel);
      case 'lastActive':
      default:
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
  });

  // Helper function to get numeric value for risk level
  const getRiskLevelValue = (riskLevel: string): number => {
    const riskLevels: Record<string, number> = {
      'minimal': 1,
      'mild': 2,
      'moderate': 3,
      'moderately severe': 4,
      'severe': 5
    };
    return riskLevels[riskLevel.toLowerCase()] || 0;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get risk level badge color
  const getRiskLevelBadgeColor = (riskLevel: string): string => {
    const riskLevelColors: Record<string, string> = {
      'minimal': 'bg-green-100 text-green-800',
      'mild': 'bg-blue-100 text-blue-800',
      'moderate': 'bg-yellow-100 text-yellow-800',
      'moderately severe': 'bg-orange-100 text-orange-800',
      'severe': 'bg-red-100 text-red-800'
    };
    return riskLevelColors[riskLevel.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('overview')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">User Metrics Overview</h3>
            </div>
            <div>
              {expandedSections.overview ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.overview && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Active Users</h4>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">{metrics.activeUsers}</span>
                    <span className="ml-2 text-sm text-green-600">+{metrics.activeUserGrowth}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Users active in the last {timeRange}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <Activity className="h-5 w-5 text-blue-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Avg. Engagement</h4>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">{metrics.avgEngagement}</span>
                    <span className="ml-2 text-sm text-green-600">+{metrics.engagementGrowth}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Avg. questionnaires per user</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <UserX className="h-5 w-5 text-red-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Inactive Users</h4>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">{metrics.inactiveUsers}</span>
                    <span className="ml-2 text-sm text-red-600">+{metrics.inactiveUserGrowth}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">No activity in the last {timeRange}</p>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.userActivity}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
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
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="active"
                      name="Active Users"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorActive)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* User Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('activity')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">User Activity Patterns</h3>
            </div>
            <div>
              {expandedSections.activity ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.activity && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Activity by Day of Week</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.activityByDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="logins"
                          name="Logins"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="submissions"
                          name="Submissions"
                          fill="#ec4899"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Activity by Time of Day</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.activityByTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="hour" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="activity"
                          name="Activity Level"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">User Engagement Metrics</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={metrics.engagementMetrics}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Current Period"
                        dataKey="current"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Previous Period"
                        dataKey="previous"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: 'none'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* User Engagement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('engagement')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <BarChart2 className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">User Engagement Analysis</h3>
            </div>
            <div>
              {expandedSections.engagement ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.engagement && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Questionnaire Completion Rate</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.completionRates}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="questionnaire" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="rate"
                          name="Completion Rate (%)"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Risk Level Distribution</h4>
                  <div className="h-64">
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
                          formatter={(value: any) => [`${value} users`, 'Count']}
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
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">User Retention</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.retention}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: 'none'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        name="Retention Rate (%)"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* User Demographics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <UserDemographicsSection
          demographicData={metrics.demographicData}
          expanded={expandedSections.demographics}
          onToggle={() => toggleSection('demographics')}
        />
      </motion.div>

      {/* User List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('users')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-full mr-3">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">User List</h3>
            </div>
            <div>
              {expandedSections.users ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.users && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Risk Levels' },
                      { value: 'minimal', label: 'Minimal' },
                      { value: 'mild', label: 'Mild' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'moderately severe', label: 'Moderately Severe' },
                      { value: 'severe', label: 'Severe' }
                    ]}
                    className="w-[180px]"
                  />

                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    options={[
                      { value: 'lastActive', label: 'Last Active' },
                      { value: 'name', label: 'Name' },
                      { value: 'completedQuestionnaires', label: 'Completed Questionnaires' },
                      { value: 'averageScore', label: 'Average Score' },
                      { value: 'riskLevel', label: 'Risk Level' }
                    ]}
                    className="w-[180px]"
                  />

                  <Button variant="light">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                              </span>
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
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelBadgeColor(user.riskLevel)}`}>
                            {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users match your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default UserMetricsSection;
