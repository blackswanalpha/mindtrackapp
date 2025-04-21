'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Button,
  Badge
} from '@/components/common';
import {
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Download,
  Share2,
  Filter,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import ScoreVisualizer from './ScoreVisualizer';

type ScoringDistributionSectionProps = {
  data: any;
  timeRange: string;
};

const ScoringDistributionSection: React.FC<ScoringDistributionSectionProps> = ({ data, timeRange }) => {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  
  // Filter by risk level
  const handleRiskLevelFilter = (level: string) => {
    setSelectedRiskLevel(selectedRiskLevel === level ? null : level);
  };
  
  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return '#10b981'; // green
      case 'moderate':
        return '#f59e0b'; // amber
      case 'high':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };
  
  // Mock risk level ranges for ScoreVisualizer
  const mockRiskLevels = [
    { min: 0, max: 9, label: 'Low', risk_level: 'low', color: '#10b981', description: 'Low risk level' },
    { min: 10, max: 19, label: 'Moderate', risk_level: 'moderate', color: '#f59e0b', description: 'Moderate risk level' },
    { min: 20, max: 27, label: 'High', risk_level: 'high', color: '#ef4444', description: 'High risk level' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Risk Level Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Risk Level Distribution
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div 
                  className={`p-4 rounded-lg border ${selectedRiskLevel === 'Low' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'} cursor-pointer transition-colors`}
                  onClick={() => handleRiskLevelFilter('Low')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Low Risk</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {data.riskDistribution.find((d: any) => d.name === 'Low')?.value || 0}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Scores indicating minimal concern. Regular monitoring recommended.
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border ${selectedRiskLevel === 'Moderate' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'} cursor-pointer transition-colors`}
                  onClick={() => handleRiskLevelFilter('Moderate')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-yellow-100 mr-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <span className="font-medium text-gray-700">Moderate Risk</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {data.riskDistribution.find((d: any) => d.name === 'Moderate')?.value || 0}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Scores indicating potential concern. Follow-up assessment recommended.
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border ${selectedRiskLevel === 'High' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-red-50'} cursor-pointer transition-colors`}
                  onClick={() => handleRiskLevelFilter('High')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-red-100 mr-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="font-medium text-gray-700">High Risk</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      {data.riskDistribution.find((d: any) => d.name === 'High')?.value || 0}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Scores indicating significant concern. Immediate intervention recommended.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.riskDistribution.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke="#ffffff"
                          strokeWidth={2}
                          opacity={selectedRiskLevel ? (entry.name === selectedRiskLevel ? 1 : 0.3) : 1}
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Score Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Score Distribution
          </h3>
          
          <div className="h-80">
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
                <Bar dataKey="count" name="Number of Responses" fill="#6366f1">
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
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Distribution of scores across all responses for the selected time period ({timeRange}).</p>
          </div>
        </Card>
      </motion.div>
      
      {/* Score Visualizer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            Average Score Visualization
          </h3>
          
          <div className="flex flex-col items-center">
            <ScoreVisualizer
              score={data.averageScore}
              maxScore={27} // Assuming PHQ-9 max score
              riskLevel={data.averageScore > 19 ? 'high' : data.averageScore > 9 ? 'moderate' : 'low'}
              riskLevels={mockRiskLevels}
              size="large"
              animated={true}
              showDetails={true}
            />
            
            <div className="mt-8 text-center max-w-md">
              <h4 className="text-lg font-medium text-gray-800 mb-2">Average Score: {data.averageScore}</h4>
              <p className="text-gray-600">
                The average score across all responses falls in the 
                <span className={`font-medium ${
                  data.averageScore > 19 ? 'text-red-600' : 
                  data.averageScore > 9 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {' '}{data.averageScore > 19 ? 'high' : data.averageScore > 9 ? 'moderate' : 'low'}{' '}
                </span>
                risk category.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScoringDistributionSection;
