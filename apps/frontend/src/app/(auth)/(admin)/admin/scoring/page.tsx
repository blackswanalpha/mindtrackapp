'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/common';
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  Settings,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  FileText,
  Sliders
} from 'lucide-react';
import api from '@/services/api';

type ScoringSystem = {
  id: number;
  name: string;
  description?: string;
  questionnaire_type: string;
  ranges: {
    min: number;
    max: number;
    label: string;
    risk_level: 'low' | 'moderate' | 'high' | 'severe';
    color: string;
    description?: string;
  }[];
  formula: string;
  created_at: string;
  updated_at?: string;
  created_by: {
    id: number;
    name: string;
  };
  questionnaire_count: number;
  is_default: boolean;
};

const ScoringSystemsPage = () => {
  const router = useRouter();
  const [scoringSystems, setScoringSystems] = useState<ScoringSystem[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<ScoringSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('systems');
  const [notifyHighRisk, setNotifyHighRisk] = useState(true);
  const [notifySevereRisk, setNotifySevereRisk] = useState(true);
  const [notifySignificantChange, setNotifySignificantChange] = useState(true);

  useEffect(() => {
    const fetchScoringSystems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.scoringSystems.getAll();

        // Mock data for demonstration
        const mockScoringSystems: ScoringSystem[] = [
          {
            id: 1,
            name: 'PHQ-9 Depression Scoring',
            description: 'Standard scoring system for the PHQ-9 depression assessment',
            questionnaire_type: 'depression',
            ranges: [
              { min: 0, max: 4, label: 'Minimal', risk_level: 'low', color: '#4ade80', description: 'Minimal or no depression' },
              { min: 5, max: 9, label: 'Mild', risk_level: 'low', color: '#a3e635', description: 'Mild depression' },
              { min: 10, max: 14, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate depression' },
              { min: 15, max: 19, label: 'Moderately Severe', risk_level: 'high', color: '#f97316', description: 'Moderately severe depression' },
              { min: 20, max: 27, label: 'Severe', risk_level: 'severe', color: '#ef4444', description: 'Severe depression' }
            ],
            formula: 'SUM(q1:q9)',
            created_at: '2023-01-15T10:30:00Z',
            updated_at: '2023-06-20T14:45:00Z',
            created_by: {
              id: 101,
              name: 'John Doe'
            },
            questionnaire_count: 5,
            is_default: true
          },
          {
            id: 2,
            name: 'GAD-7 Anxiety Scoring',
            description: 'Standard scoring system for the GAD-7 anxiety assessment',
            questionnaire_type: 'anxiety',
            ranges: [
              { min: 0, max: 4, label: 'Minimal', risk_level: 'low', color: '#4ade80', description: 'Minimal anxiety' },
              { min: 5, max: 9, label: 'Mild', risk_level: 'low', color: '#a3e635', description: 'Mild anxiety' },
              { min: 10, max: 14, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate anxiety' },
              { min: 15, max: 21, label: 'Severe', risk_level: 'severe', color: '#ef4444', description: 'Severe anxiety' }
            ],
            formula: 'SUM(q1:q7)',
            created_at: '2023-02-10T09:15:00Z',
            created_by: {
              id: 102,
              name: 'Jane Smith'
            },
            questionnaire_count: 3,
            is_default: true
          },
          {
            id: 3,
            name: 'Well-being Index Scoring',
            description: 'Scoring system for general well-being assessment',
            questionnaire_type: 'well-being',
            ranges: [
              { min: 0, max: 35, label: 'Low Well-being', risk_level: 'high', color: '#ef4444', description: 'Low level of well-being, potential distress' },
              { min: 36, max: 70, label: 'Moderate Well-being', risk_level: 'moderate', color: '#facc15', description: 'Moderate level of well-being' },
              { min: 71, max: 100, label: 'High Well-being', risk_level: 'low', color: '#4ade80', description: 'High level of well-being' }
            ],
            formula: 'SUM(q1:q20) / 20 * 100',
            created_at: '2023-03-05T14:20:00Z',
            updated_at: '2023-05-18T11:30:00Z',
            created_by: {
              id: 101,
              name: 'John Doe'
            },
            questionnaire_count: 2,
            is_default: false
          },
          {
            id: 4,
            name: 'Sleep Quality Index',
            description: 'Scoring system for sleep quality assessment',
            questionnaire_type: 'sleep',
            ranges: [
              { min: 0, max: 5, label: 'Good', risk_level: 'low', color: '#4ade80', description: 'Good sleep quality' },
              { min: 6, max: 10, label: 'Fair', risk_level: 'moderate', color: '#facc15', description: 'Fair sleep quality' },
              { min: 11, max: 21, label: 'Poor', risk_level: 'high', color: '#ef4444', description: 'Poor sleep quality' }
            ],
            formula: 'SUM(q1:q7)',
            created_at: '2023-04-12T16:45:00Z',
            created_by: {
              id: 103,
              name: 'Robert Johnson'
            },
            questionnaire_count: 1,
            is_default: true
          },
          {
            id: 5,
            name: 'Stress Assessment Scoring',
            description: 'Scoring system for stress level assessment',
            questionnaire_type: 'stress',
            ranges: [
              { min: 0, max: 13, label: 'Low Stress', risk_level: 'low', color: '#4ade80', description: 'Low stress levels' },
              { min: 14, max: 26, label: 'Moderate Stress', risk_level: 'moderate', color: '#facc15', description: 'Moderate stress levels' },
              { min: 27, max: 40, label: 'High Stress', risk_level: 'high', color: '#ef4444', description: 'High stress levels' }
            ],
            formula: 'SUM(q1:q10)',
            created_at: '2023-05-20T11:30:00Z',
            updated_at: '2023-07-15T13:20:00Z',
            created_by: {
              id: 102,
              name: 'Jane Smith'
            },
            questionnaire_count: 2,
            is_default: false
          },
          {
            id: 6,
            name: 'Custom Depression Scoring',
            description: 'Modified scoring system for depression with additional risk factors',
            questionnaire_type: 'depression',
            ranges: [
              { min: 0, max: 5, label: 'Minimal', risk_level: 'low', color: '#4ade80', description: 'Minimal or no depression' },
              { min: 6, max: 10, label: 'Mild', risk_level: 'low', color: '#a3e635', description: 'Mild depression' },
              { min: 11, max: 15, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate depression' },
              { min: 16, max: 20, label: 'Severe', risk_level: 'high', color: '#f97316', description: 'Severe depression' },
              { min: 21, max: 30, label: 'Very Severe', risk_level: 'severe', color: '#ef4444', description: 'Very severe depression' }
            ],
            formula: 'SUM(q1:q10) + IF(q9 > 2, 2, 0)',
            created_at: '2023-06-08T09:00:00Z',
            created_by: {
              id: 101,
              name: 'John Doe'
            },
            questionnaire_count: 1,
            is_default: false
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setScoringSystems(mockScoringSystems);
        setFilteredSystems(mockScoringSystems);
      } catch (err) {
        setError('Failed to load scoring systems');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScoringSystems();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...scoringSystems];

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(system => system.questionnaire_type === typeFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        system =>
          system.name.toLowerCase().includes(query) ||
          (system.description && system.description.toLowerCase().includes(query))
      );
    }

    setFilteredSystems(filtered);
  }, [scoringSystems, typeFilter, searchQuery]);

  // Handle scoring system deletion
  const handleDelete = async (systemId: number) => {
    if (!window.confirm('Are you sure you want to delete this scoring system? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.scoringSystems.delete(systemId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setScoringSystems(scoringSystems.filter(system => system.id !== systemId));

      alert('Scoring system deleted successfully');
    } catch (err) {
      setError('Failed to delete scoring system');
    }
  };

  // Handle set as default
  const handleSetDefault = async (systemId: number, questionnaireType: string) => {
    try {
      // In a real implementation, this would call the API
      // await api.scoringSystems.setDefault(systemId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setScoringSystems(scoringSystems.map(system =>
        system.questionnaire_type === questionnaireType
          ? { ...system, is_default: system.id === systemId }
          : system
      ));

      alert('Default scoring system updated successfully');
    } catch (err) {
      setError('Failed to update default scoring system');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading scoring systems..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scoring System</h1>
          <p className="text-gray-600">Manage scoring systems for questionnaires</p>
        </div>

        <Button
          variant="primary"
          onClick={() => router.push('/scoring/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Scoring System
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h2 className="sr-only">Tabs</h2>
        </div>

        <Button
          variant="secondary"
          onClick={() => router.push('/admin/scoring/responses')}
          className="ml-4"
        >
          <FileText className="h-4 w-4 mr-2" />
          Manage Response Scoring
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="systems">Scoring Systems</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="systems">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search scoring systems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="depression">Depression</option>
                  <option value="anxiety">Anxiety</option>
                  <option value="well-being">Well-being</option>
                  <option value="sleep">Sleep</option>
                  <option value="stress">Stress</option>
                </select>
              </div>
            </div>

            {filteredSystems.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">No scoring systems found</h2>
                <p className="text-gray-500 mb-6">
                  {searchQuery || typeFilter !== 'all'
                    ? 'No scoring systems match your search criteria.'
                    : 'You haven\'t created any scoring systems yet.'}
                </p>
                {!searchQuery && typeFilter === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => router.push('/scoring/create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Scoring System
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSystems.map((system) => (
                  <div key={system.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{system.name}</h3>
                          <p className="text-sm text-gray-500">{system.questionnaire_type.charAt(0).toUpperCase() + system.questionnaire_type.slice(1)}</p>
                        </div>
                        {system.is_default && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                      </div>

                      {system.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{system.description}</p>
                      )}

                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Score Ranges</h4>
                        <div className="flex space-x-1">
                          {system.ranges.map((range, index) => (
                            <div
                              key={index}
                              className="h-2 flex-grow rounded-sm"
                              style={{ backgroundColor: range.color }}
                              title={`${range.label}: ${range.min}-${range.max}`}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">{system.ranges[0].min}</span>
                          <span className="text-xs text-gray-500">{system.ranges[system.ranges.length - 1].max}</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mb-4">
                        <span>Formula: <code className="bg-gray-100 px-1 py-0.5 rounded">{system.formula}</code></span>
                        <span>Used by: {system.questionnaire_count} questionnaire{system.questionnaire_count !== 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Created {new Date(system.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          {!system.is_default && (
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm"
                              onClick={() => handleSetDefault(system.id, system.questionnaire_type)}
                              title="Set as Default"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            onClick={() => router.push(`/scoring/${system.id}`)}
                          >
                            View
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            onClick={() => router.push(`/scoring/${system.id}/edit`)}
                          >
                            Edit
                          </button>
                          {!system.is_default && (
                            <button
                              className="text-red-600 hover:text-red-800 text-sm"
                              onClick={() => handleDelete(system.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Scoring System Settings</h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Level Configuration</h3>
                <p className="text-gray-600 mb-4">
                  Configure the global risk levels used across all scoring systems.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">Low Risk</h4>
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Minimal or no intervention needed. Regular monitoring recommended.
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Edit Configuration
                    </button>
                  </div>

                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">Moderate Risk</h4>
                      <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Intervention may be needed. Follow-up assessment recommended.
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Edit Configuration
                    </button>
                  </div>

                  <div className="border rounded-lg p-4 bg-orange-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">High Risk</h4>
                      <div className="h-4 w-4 rounded-full bg-orange-500"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Intervention needed. Prompt follow-up and assessment required.
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Edit Configuration
                    </button>
                  </div>

                  <div className="border rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">Severe Risk</h4>
                      <div className="h-4 w-4 rounded-full bg-red-500"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Immediate intervention required. Urgent follow-up needed.
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Edit Configuration
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure when notifications are sent based on scoring results.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-high-risk"
                        checked={notifyHighRisk}
                        onChange={(e) => setNotifyHighRisk(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notify-high-risk" className="ml-2 block text-sm text-gray-700">
                        Send notification for high risk scores
                      </label>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Configure
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-severe-risk"
                        checked={notifySevereRisk}
                        onChange={(e) => setNotifySevereRisk(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notify-severe-risk" className="ml-2 block text-sm text-gray-700">
                        Send notification for severe risk scores
                      </label>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Configure
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-significant-change"
                        checked={notifySignificantChange}
                        onChange={(e) => setNotifySignificantChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notify-significant-change" className="ml-2 block text-sm text-gray-700">
                        Send notification for significant score changes
                      </label>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Formula Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure the available formula functions and operators.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Available Functions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white p-2 rounded border">SUM()</div>
                    <div className="bg-white p-2 rounded border">AVG()</div>
                    <div className="bg-white p-2 rounded border">MIN()</div>
                    <div className="bg-white p-2 rounded border">MAX()</div>
                    <div className="bg-white p-2 rounded border">COUNT()</div>
                    <div className="bg-white p-2 rounded border">IF()</div>
                    <div className="bg-white p-2 rounded border">ROUND()</div>
                    <div className="bg-white p-2 rounded border">ABS()</div>
                  </div>
                </div>

                <Button variant="secondary">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Formula Settings
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScoringSystemsPage;
