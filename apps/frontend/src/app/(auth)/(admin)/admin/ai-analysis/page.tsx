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
  Search,
  Brain,
  Settings,
  FileText,
  BarChart3,
  AlertTriangle,
  Clock,
  Calendar,
  ArrowRight,
  ChevronRight,
  Download,
  Filter,
  Sliders
} from 'lucide-react';
import api from '@/services/api';

type Analysis = {
  id: number;
  response_id: number;
  created_at: string;
  model: string;
  analysis: {
    summary: string;
    risk_assessment: string;
    recommendations: string[];
    key_concerns: string[];
    potential_triggers: string;
  };
  response?: {
    questionnaire_title: string;
    patient_email: string;
    score: number;
    risk_level: string;
  };
};

const AIAnalysisPage = () => {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('analyses');

  useEffect(() => {
    const fetchAnalyses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.aiAnalysis.getAll();

        // Mock data for demonstration
        const mockAnalyses: Analysis[] = [
          {
            id: 1,
            response_id: 1,
            created_at: '2023-04-15T11:30:00Z',
            model: 'gpt-4',
            analysis: {
              summary: "The patient is experiencing moderate to severe depression symptoms, particularly in areas of mood, energy, and self-perception. The PHQ-9 score of 14 indicates moderately severe depression that warrants clinical attention.",
              risk_assessment: "The patient does not report active suicidal ideation, which is a positive sign. However, the overall symptom severity suggests significant distress that could potentially worsen without intervention.",
              recommendations: [
                "Consider referral to a mental health professional for comprehensive evaluation",
                "Screening for comorbid anxiety may be beneficial given the sleep disturbances and concentration difficulties",
                "Regular follow-up to monitor symptom progression is recommended",
                "Psychoeducation about depression and self-care strategies would be helpful"
              ],
              key_concerns: [
                "Persistent depressed mood nearly every day",
                "Significant fatigue and energy loss",
                "Sleep disturbances",
                "Negative self-perception",
                "Reduced concentration"
              ],
              potential_triggers: "While not explicitly stated, the pattern of symptoms suggests possible stressors related to self-worth and performance expectations. Further exploration of work, relationship, or health-related stressors would be valuable."
            },
            response: {
              questionnaire_title: "Depression Assessment (PHQ-9)",
              patient_email: "patient1@example.com",
              score: 14,
              risk_level: "moderate"
            }
          },
          {
            id: 2,
            response_id: 2,
            created_at: '2023-04-16T15:45:00Z',
            model: 'gpt-4',
            analysis: {
              summary: "The patient is experiencing mild depression symptoms with primary concerns around sleep quality and energy levels. The PHQ-9 score of 8 indicates mild depression that may benefit from monitoring and supportive interventions.",
              risk_assessment: "No significant risk factors identified. The patient denies suicidal ideation and shows no indicators of self-harm risk. The symptom profile suggests distress but not acute crisis.",
              recommendations: [
                "Consider follow-up assessment in 2-4 weeks to monitor symptom progression",
                "Provide resources for sleep hygiene and energy management",
                "Suggest mild physical activity and behavioral activation strategies",
                "Consider brief supportive counseling if symptoms persist"
              ],
              key_concerns: [
                "Sleep disturbances (both insomnia and hypersomnia)",
                "Reduced energy levels",
                "Mild anhedonia (reduced interest/pleasure)",
                "Occasional feelings of worthlessness"
              ],
              potential_triggers: "Recent life stressors may be contributing to the current symptom presentation. The pattern suggests possible adjustment difficulties rather than major depressive disorder, though continued monitoring is warranted."
            },
            response: {
              questionnaire_title: "Depression Assessment (PHQ-9)",
              patient_email: "patient2@example.com",
              score: 8,
              risk_level: "mild"
            }
          },
          {
            id: 3,
            response_id: 3,
            created_at: '2023-04-18T09:20:00Z',
            model: 'gpt-4',
            analysis: {
              summary: "The patient is experiencing severe anxiety symptoms with significant impact on daily functioning. The GAD-7 score of 18 indicates severe anxiety that requires prompt clinical attention.",
              risk_assessment: "While no direct self-harm risk is indicated, the severity of anxiety symptoms suggests potential for functional deterioration. The patient reports significant distress and impairment in daily activities.",
              recommendations: [
                "Immediate referral to a mental health professional for comprehensive evaluation",
                "Consider both psychotherapeutic and pharmacological interventions",
                "Provide crisis resources and develop a safety plan if symptoms worsen",
                "Short-term anxiety management strategies including breathing exercises and grounding techniques"
              ],
              key_concerns: [
                "Persistent and uncontrollable worry",
                "Physical symptoms of anxiety (tension, restlessness)",
                "Avoidance behaviors",
                "Sleep disruption",
                "Difficulty concentrating"
              ],
              potential_triggers: "The pattern suggests generalized anxiety disorder with possible panic features. Recent stressors appear to have exacerbated underlying anxiety tendencies. Environmental factors and cognitive patterns should be explored in treatment."
            },
            response: {
              questionnaire_title: "Anxiety Screening (GAD-7)",
              patient_email: "patient3@example.com",
              score: 18,
              risk_level: "severe"
            }
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setAnalyses(mockAnalyses);
        setFilteredAnalyses(mockAnalyses);
      } catch (err) {
        setError('Failed to load AI analyses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...analyses];

    // Apply risk filter
    if (riskFilter !== 'all' && filtered[0]?.response) {
      filtered = filtered.filter(analysis => analysis.response?.risk_level === riskFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        analysis =>
          analysis.analysis.summary.toLowerCase().includes(query) ||
          analysis.analysis.key_concerns.some(concern => concern.toLowerCase().includes(query)) ||
          (analysis.response?.patient_email && analysis.response.patient_email.toLowerCase().includes(query)) ||
          (analysis.response?.questionnaire_title && analysis.response.questionnaire_title.toLowerCase().includes(query))
      );
    }

    setFilteredAnalyses(filtered);
  }, [analyses, riskFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading AI analyses..." />
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
          <h1 className="text-2xl font-bold text-gray-800">AI Analysis</h1>
          <p className="text-gray-600">AI-powered insights from questionnaire responses</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analyses">Analyses</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="analyses">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search analyses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="minimal">Minimal</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <Button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => {/* Export functionality */}}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {filteredAnalyses.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">No analyses found</h2>
                <p className="text-gray-500 mb-6">
                  {searchQuery || riskFilter !== 'all'
                    ? 'No analyses match your search criteria.'
                    : 'There are no AI analyses available yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {analysis.response?.questionnaire_title || 'Questionnaire Response Analysis'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Patient: {analysis.response?.patient_email || 'Anonymous'}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-700">Score: {analysis.response?.score || 'N/A'}</span>
                          </div>

                          {analysis.response?.risk_level && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              analysis.response.risk_level === 'minimal' ? 'bg-green-100 text-green-800' :
                              analysis.response.risk_level === 'mild' ? 'bg-blue-100 text-blue-800' :
                              analysis.response.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {analysis.response.risk_level.charAt(0).toUpperCase() + analysis.response.risk_level.slice(1)} Risk
                            </span>
                          )}

                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {new Date(analysis.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{analysis.analysis.summary}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Concerns</h4>
                        <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                          {analysis.analysis.key_concerns.slice(0, 3).map((concern, index) => (
                            <li key={index} className="line-clamp-1">{concern}</li>
                          ))}
                          {analysis.analysis.key_concerns.length > 3 && (
                            <li className="text-gray-500">+{analysis.analysis.key_concerns.length - 3} more</li>
                          )}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">Model: {analysis.model}</span>
                        </div>

                        <Button
                          className="text-blue-600 hover:text-blue-800 hover:underline p-0 text-sm"
                          onClick={() => router.push(`/responses/${analysis.response_id}`)}
                        >
                          View Full Analysis
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAnalyses.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredAnalyses.length} of {analyses.length} analyses
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Previous
                  </Button>
                  <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <h2 className="text-xl font-semibold mb-6">AI Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Common Concerns</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Most frequently identified concerns across all analyses.
                </p>

                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Sleep disturbances</span>
                    <span className="text-sm font-medium">78%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Persistent low mood</span>
                    <span className="text-sm font-medium">65%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Fatigue and energy loss</span>
                    <span className="text-sm font-medium">62%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Concentration difficulties</span>
                    <span className="text-sm font-medium">54%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Negative self-perception</span>
                    <span className="text-sm font-medium">47%</span>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Common Recommendations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Most frequently suggested interventions across all analyses.
                </p>

                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Mental health professional referral</span>
                    <span className="text-sm font-medium">82%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Regular follow-up monitoring</span>
                    <span className="text-sm font-medium">76%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Sleep hygiene education</span>
                    <span className="text-sm font-medium">58%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Anxiety screening</span>
                    <span className="text-sm font-medium">52%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Self-care strategies</span>
                    <span className="text-sm font-medium">49%</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-8">
              <h3 className="font-medium text-gray-900 mb-2">Risk Level Distribution</h3>
              <p className="text-sm text-gray-600 mb-4">
                Distribution of risk levels across all analyses.
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Minimal</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Mild</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Moderate</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Severe</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Potential Triggers</h3>
              <p className="text-sm text-gray-600 mb-4">
                Common triggers identified across analyses.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Work stress (42%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Relationship difficulties (38%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Financial concerns (35%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Health issues (31%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Social isolation (28%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Academic pressure (25%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Family conflict (22%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Major life changes (20%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Grief/loss (18%)</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Trauma (15%)</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <h2 className="text-xl font-semibold mb-6">AI Analysis Settings</h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Model Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure the AI model used for analysis.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                      Default AI Model
                    </label>
                    <select
                      id="model"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="gpt-4"
                    >
                      <option value="gpt-4">GPT-4 (Recommended)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                      <option value="claude-2">Claude 2 (Alternative)</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-generate"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auto-generate" className="ml-2 block text-sm text-gray-700">
                      Automatically generate analysis for new responses
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-previous"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include-previous" className="ml-2 block text-sm text-gray-700">
                      Include previous responses in analysis context
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Content</h3>
                <p className="text-gray-600 mb-4">
                  Configure what information is included in the analysis.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-summary"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include-summary" className="ml-2 block text-sm text-gray-700">
                      Include summary
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-risk"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include-risk" className="ml-2 block text-sm text-gray-700">
                      Include risk assessment
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-recommendations"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include-recommendations" className="ml-2 block text-sm text-gray-700">
                      Include recommendations
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-concerns"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include-concerns" className="ml-2 block text-sm text-gray-700">
                      Include key concerns
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-triggers"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include-triggers" className="ml-2 block text-sm text-gray-700">
                      Include potential triggers
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure notifications for AI analyses.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-high-risk"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-high-risk" className="ml-2 block text-sm text-gray-700">
                      Notify when analysis identifies high risk
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-completed"
                      checked={false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-completed" className="ml-2 block text-sm text-gray-700">
                      Notify when analysis is completed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="primary">
                Save Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalysisPage;
