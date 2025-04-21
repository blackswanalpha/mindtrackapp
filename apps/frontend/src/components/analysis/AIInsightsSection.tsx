'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Button,
  Badge,
  Select
} from '@/components/common';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  RefreshCw,
  Zap,
  ArrowRight,
  BarChart2,
  Users,
  Clock,
  Calendar,
  Filter,
  Lightbulb
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
  PieChart,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

type AIInsightsSectionProps = {
  insights: any;
  timeRange: string;
};

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ insights, timeRange }) => {
  const [expandedSections, setExpandedSections] = useState({
    keyInsights: true,
    trendAnalysis: true,
    recommendations: true,
    correlations: true
  });
  const [insightFilter, setInsightFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle refresh insights
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // In a real implementation, this would refresh the insights
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get icon for insight
  const getInsightIcon = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'medium':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get color for impact
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get color for effort
  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('keyInsights')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-full mr-3">
                <Brain className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Key AI Insights</h3>
            </div>
            <div className="flex items-center">
              <Button
                variant="light"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                disabled={isRefreshing}
                className="mr-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              {expandedSections.keyInsights ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.keyInsights && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {insights.keyInsights.map((insight: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 hover:shadow-md transition-shadow duration-300"
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
                  </motion.div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">Insight Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.insightDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="category" stroke="#9ca3af" />
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
                        dataKey="count"
                        name="Number of Insights"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Trend Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('trendAnalysis')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI Trend Analysis</h3>
            </div>
            <div>
              {expandedSections.trendAnalysis ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.trendAnalysis && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">Detected Trends</h4>
                <div className="space-y-4">
                  {insights.trendAnalysis.map((trend: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-300"
                    >
                      <div className="flex items-start">
                        {getInsightIcon(trend.importance)}
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-800">{trend.title}</h4>
                            <Badge
                              className="ml-2 capitalize"
                            >
                              {trend.importance}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Score Trends</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={insights.scoreTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
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
                          dataKey="avgScore"
                          name="Average Score"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="trendline"
                          name="Trend"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Completion Time Trends</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={insights.completionTimeTrends}>
                        <defs>
                          <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
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
                          dataKey="avgTime"
                          name="Avg. Completion Time (min)"
                          stroke="#0ea5e9"
                          fillOpacity={1}
                          fill="url(#colorTime)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('recommendations')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
            </div>
            <div>
              {expandedSections.recommendations ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.recommendations && (
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {insights.recommendations.map((recommendation: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-5 rounded-lg border-l-4 border-green-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800 mb-2">{recommendation.title}</h4>
                        <p className="text-sm text-gray-600">{recommendation.description}</p>

                        <div className="flex flex-wrap items-center mt-3 text-sm">
                          <div className="flex items-center mr-4">
                            <span className="text-gray-500 mr-1">Impact:</span>
                            <span className={`font-medium ${getImpactColor(recommendation.impact)}`}>
                              {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">Effort:</span>
                            <span className={`font-medium ${getEffortColor(recommendation.effort)}`}>
                              {recommendation.effort.charAt(0).toUpperCase() + recommendation.effort.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                        <Button variant="light" size="small">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Implement
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Impact vs. Effort Matrix</h4>
                  <div className="h-64 bg-gray-50 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          type="number"
                          dataKey="effortValue"
                          name="Effort"
                          domain={[0, 100]}
                          label={{ value: 'Effort', position: 'bottom', offset: 0 }}
                          stroke="#9ca3af"
                        />
                        <YAxis
                          type="number"
                          dataKey="impactValue"
                          name="Impact"
                          domain={[0, 100]}
                          label={{ value: 'Impact', angle: -90, position: 'left' }}
                          stroke="#9ca3af"
                        />
                        <ZAxis
                          type="number"
                          dataKey="size"
                          range={[50, 400]}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                          formatter={(value, name, entry) => {
                            if (!entry || !entry.payload) return [value, name];
                            if (name === 'Effort') {
                              return [entry.payload.effort, name];
                            }
                            if (name === 'Impact') {
                              return [entry.payload.impact, name];
                            }
                            return [value, name];
                          }}
                          labelFormatter={(value) => 'Recommendation'}
                        />
                        <Scatter
                          name="Recommendations"
                          data={insights.recommendationMatrix}
                          fill="#10b981"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Recommendation Categories</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insights.recommendationCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {insights.recommendationCategories.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="#ffffff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [`${value} recommendations`, 'Count']}
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
            </div>
          )}
        </Card>
      </motion.div>

      {/* Correlations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div
            className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('correlations')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI-Detected Correlations</h3>
            </div>
            <div>
              {expandedSections.correlations ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {expandedSections.correlations && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Score vs. Completion Time</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          type="number"
                          dataKey="completionTime"
                          name="Completion Time (min)"
                          stroke="#9ca3af"
                        />
                        <YAxis
                          type="number"
                          dataKey="score"
                          name="Score"
                          stroke="#9ca3af"
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Scatter
                          name="Responses"
                          data={insights.scoreVsTime}
                          fill="#8b5cf6"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Question Correlation Matrix</h4>
                  <div className="h-64 overflow-auto">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Question
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Correlated With
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Strength
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {insights.questionCorrelations.map((correlation: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                Q{correlation.question}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                Q{correlation.correlatedWith}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div
                                      className={`h-2.5 rounded-full ${
                                        correlation.strength > 0.7 ? 'bg-green-500' :
                                        correlation.strength > 0.4 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                      }`}
                                      style={{ width: `${correlation.strength * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-700">
                                    {(correlation.strength * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">Key Correlation Insights</h4>
                <div className="space-y-3">
                  {insights.correlationInsights.map((insight: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-purple-50 border border-purple-100"
                    >
                      <div className="flex items-start">
                        <Zap className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{insight.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex flex-wrap justify-end gap-3"
      >
        <Button variant="light">
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
        <Button variant="light">
          <Share2 className="h-4 w-4 mr-2" />
          Share Insights
        </Button>
        <Button variant="primary">
          <Brain className="h-4 w-4 mr-2" />
          Generate New Analysis
        </Button>
      </motion.div>
    </div>
  );
};

export default AIInsightsSection;
