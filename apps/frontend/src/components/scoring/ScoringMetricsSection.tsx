'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Button,
  Badge
} from '@/components/common';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Activity,
  Search
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
  Cell
} from 'recharts';

type ScoringMetricsSectionProps = {
  data: any;
  timeRange: string;
};

const ScoringMetricsSection: React.FC<ScoringMetricsSectionProps> = ({ data, timeRange }) => {
  const [expandedQuestionnaire, setExpandedQuestionnaire] = useState<number | null>(null);
  
  // Toggle questionnaire expansion
  const toggleQuestionnaire = (id: number) => {
    setExpandedQuestionnaire(expandedQuestionnaire === id ? null : id);
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Questionnaire Scoring Metrics
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questionnaire
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    High Risk Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.questionnaireScoringData.map((questionnaire: any, index: number) => (
                  <React.Fragment key={index}>
                    <tr className={`hover:bg-gray-50 ${expandedQuestionnaire === index ? 'bg-indigo-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{questionnaire.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{questionnaire.avgScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{questionnaire.responses}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          questionnaire.highRiskRate > 8 ? 'text-red-600' : 
                          questionnaire.highRiskRate > 5 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {questionnaire.highRiskRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="light"
                          onClick={() => toggleQuestionnaire(index)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {expandedQuestionnaire === index ? (
                            <ChevronUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-1" />
                          )}
                          {expandedQuestionnaire === index ? 'Hide' : 'Show'}
                        </Button>
                      </td>
                    </tr>
                    
                    {/* Expanded details */}
                    {expandedQuestionnaire === index && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-indigo-50">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                              <div>
                                <h4 className="text-md font-medium text-gray-700 mb-4">Score Distribution</h4>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={data.scoreDistribution}
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                      <XAxis dataKey="score" stroke="#9ca3af" />
                                      <YAxis stroke="#9ca3af" />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: '#ffffff',
                                          borderRadius: '8px',
                                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                          border: 'none'
                                        }}
                                      />
                                      <Bar dataKey="count" fill="#6366f1">
                                        {data.scoreDistribution.map((entry: any, index: number) => (
                                          <Cell 
                                            key={`cell-${index}`} 
                                            fill={index > 3 ? '#ef4444' : index > 2 ? '#f59e0b' : '#10b981'} 
                                          />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-md font-medium text-gray-700 mb-4">Risk Level Metrics</h4>
                                <div className="space-y-4">
                                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center">
                                        <div className="p-2 rounded-full bg-green-100 mr-3">
                                          <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="font-medium text-gray-700">Low Risk</span>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800">
                                        {Math.round(100 - questionnaire.highRiskRate - 20)}%
                                      </Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${100 - questionnaire.highRiskRate - 20}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center">
                                        <div className="p-2 rounded-full bg-yellow-100 mr-3">
                                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <span className="font-medium text-gray-700">Moderate Risk</span>
                                      </div>
                                      <Badge className="bg-yellow-100 text-yellow-800">
                                        20%
                                      </Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-yellow-500 h-2 rounded-full" 
                                        style={{ width: '20%' }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center">
                                        <div className="p-2 rounded-full bg-red-100 mr-3">
                                          <AlertTriangle className="h-5 w-5 text-red-600" />
                                        </div>
                                        <span className="font-medium text-gray-700">High Risk</span>
                                      </div>
                                      <Badge className="bg-red-100 text-red-800">
                                        {questionnaire.highRiskRate}%
                                      </Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-red-500 h-2 rounded-full" 
                                        style={{ width: `${questionnaire.highRiskRate}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-4">
                              <Button
                                variant="light"
                                onClick={() => {}}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                              >
                                <Search className="h-4 w-4 mr-1" />
                                View All Responses
                              </Button>
                              <Button
                                variant="light"
                                onClick={() => {}}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Export Data
                              </Button>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            Score Trends Over Time
          </h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.scoreTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
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
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  name="Average Score"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Average score trend for the selected time period ({timeRange}). The chart shows the average score of all responses over time.</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScoringMetricsSection;
