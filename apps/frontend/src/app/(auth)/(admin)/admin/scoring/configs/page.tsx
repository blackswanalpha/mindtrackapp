'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Input,
  Loading,
  Alert,
  Badge
} from '@/components/common';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

type ScoringConfig = {
  id: number;
  name: string;
  description: string;
  questionnaire_id: number;
  questionnaire_title?: string;
  scoring_method: string;
  max_score?: number;
  passing_score?: number;
  rules: any;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  created_by_name?: string;
};

const ScoringConfigsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configs, setConfigs] = useState<ScoringConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConfigs, setFilteredConfigs] = useState<ScoringConfig[]>([]);

  // Fetch scoring configs
  useEffect(() => {
    const fetchConfigs = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch from the API
        // For now, we'll use mock data
        const mockConfigs = [
          {
            id: 1,
            name: 'PHQ-9 Depression Scoring',
            description: 'Standard scoring system for the PHQ-9 depression assessment',
            questionnaire_id: 1,
            questionnaire_title: 'PHQ-9',
            scoring_method: 'sum',
            max_score: 27,
            passing_score: 5,
            rules: {
              risk_levels: {
                minimal: 0,
                mild: 5,
                moderate: 10,
                'moderately severe': 15,
                severe: 20
              }
            },
            created_at: '2023-01-15T10:30:00Z',
            updated_at: '2023-01-15T10:30:00Z',
            created_by_id: 1,
            created_by_name: 'Admin User'
          },
          {
            id: 2,
            name: 'GAD-7 Anxiety Scoring',
            description: 'Standard scoring system for the GAD-7 anxiety assessment',
            questionnaire_id: 2,
            questionnaire_title: 'GAD-7',
            scoring_method: 'sum',
            max_score: 21,
            passing_score: 5,
            rules: {
              risk_levels: {
                minimal: 0,
                mild: 5,
                moderate: 10,
                severe: 15
              }
            },
            created_at: '2023-02-20T14:15:00Z',
            updated_at: '2023-02-20T14:15:00Z',
            created_by_id: 1,
            created_by_name: 'Admin User'
          },
          {
            id: 3,
            name: 'Well-being Index Scoring',
            description: 'Scoring system for general well-being assessment',
            questionnaire_id: 3,
            questionnaire_title: 'Well-being Index',
            scoring_method: 'average',
            max_score: 100,
            passing_score: 70,
            rules: {
              risk_levels: {
                low: 0,
                moderate: 36,
                high: 71
              }
            },
            created_at: '2023-03-05T14:20:00Z',
            updated_at: '2023-05-18T11:30:00Z',
            created_by_id: 1,
            created_by_name: 'Admin User'
          }
        ];

        setConfigs(mockConfigs);
        setFilteredConfigs(mockConfigs);
      } catch (err) {
        console.error('Error fetching scoring configs:', err);
        setError('Failed to load scoring configurations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  // Filter configs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConfigs(configs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = configs.filter(config =>
      config.name.toLowerCase().includes(query) ||
      config.description.toLowerCase().includes(query) ||
      config.questionnaire_title?.toLowerCase().includes(query)
    );

    setFilteredConfigs(filtered);
  }, [searchQuery, configs]);

  // Delete scoring config
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scoring configuration?')) {
      return;
    }

    try {
      // In a real implementation, we would call the API
      // For now, we'll just update the state
      setConfigs(configs.filter(config => config.id !== id));
      setFilteredConfigs(filteredConfigs.filter(config => config.id !== id));
    } catch (err) {
      console.error('Error deleting scoring config:', err);
      setError('Failed to delete scoring configuration. Please try again.');
    }
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'minimal':
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'mild':
        return 'bg-lime-100 text-lime-800';
      case 'moderate':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderately severe':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format scoring method
  const formatScoringMethod = (method: string) => {
    switch (method) {
      case 'sum':
        return 'Sum';
      case 'average':
        return 'Average';
      case 'weighted_average':
        return 'Weighted Average';
      case 'custom':
        return 'Custom';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading scoring configurations..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center mb-4">
          <Link href="/admin/scoring" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Scoring Configurations</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search configurations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            onClick={() => router.push('/admin/scoring/configs/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Configuration
          </Button>
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {filteredConfigs.length === 0 ? (
          <Card className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scoring configurations found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search to find what you\'re looking for.'
                : 'Create your first scoring configuration to get started.'}
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/scoring/configs/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Configuration
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredConfigs.map((config) => (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Card className="p-6 h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {config.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {config.questionnaire_title || 'Unknown Questionnaire'}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {formatScoringMethod(config.scoring_method)}
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {config.description || 'No description provided.'}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Levels</h4>
                      <div className="flex flex-wrap gap-2">
                        {config.rules.risk_levels && Object.entries(config.rules.risk_levels).map(([level, threshold]) => (
                          <Badge
                            key={level}
                            className={getRiskLevelColor(level)}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}: {String(threshold)}+
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <div>
                        {config.max_score !== undefined && (
                          <span className="mr-4">Max: {config.max_score}</span>
                        )}
                        {config.passing_score !== undefined && (
                          <span>Pass: {config.passing_score}</span>
                        )}
                      </div>
                      <div>
                        Created: {new Date(config.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
                      <Button
                        variant="light"
                        onClick={() => router.push(`/admin/scoring/configs/${config.id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="light"
                          onClick={() => router.push(`/admin/scoring/configs/${config.id}/edit`)}
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => handleDelete(config.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScoringConfigsPage;
