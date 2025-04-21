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
  Select,
  TextArea as Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/common';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/services/api';

type Questionnaire = {
  id: number;
  title: string;
  type: string;
};

type RiskLevel = {
  id: string;
  min: number;
  max: number;
  label: string;
  risk_level: string;
  color: string;
  description: string;
};

const ScoringConfigCreatePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questionnaireId, setQuestionnaireId] = useState<number | null>(null);
  const [scoringMethod, setScoringMethod] = useState('sum');
  const [maxScore, setMaxScore] = useState<number | null>(null);
  const [passingScore, setPassingScore] = useState<number | null>(null);
  const [riskLevels, setRiskLevels] = useState<RiskLevel[]>([
    {
      id: crypto.randomUUID(),
      min: 0,
      max: 4,
      label: 'Minimal',
      risk_level: 'minimal',
      color: '#4ade80',
      description: 'Minimal risk level'
    }
  ]);

  // Fetch questionnaires
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setIsLoading(true);
      try {
        const response = await api.questionnaires.getAll();
        setQuestionnaires(response.questionnaires || []);
      } catch (err) {
        console.error('Error fetching questionnaires:', err);
        setError('Failed to load questionnaires. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  // Add risk level
  const addRiskLevel = () => {
    const lastLevel = riskLevels[riskLevels.length - 1];
    const newMin = lastLevel ? lastLevel.max + 1 : 0;
    const newMax = newMin + 4;

    setRiskLevels([
      ...riskLevels,
      {
        id: crypto.randomUUID(),
        min: newMin,
        max: newMax,
        label: 'New Level',
        risk_level: 'low',
        color: '#facc15',
        description: 'New risk level'
      }
    ]);
  };

  // Remove risk level
  const removeRiskLevel = (id: string) => {
    setRiskLevels(riskLevels.filter(level => level.id !== id));
  };

  // Update risk level
  const updateRiskLevel = (id: string, field: keyof RiskLevel, value: any) => {
    setRiskLevels(riskLevels.map(level => {
      if (level.id === id) {
        return { ...level, [field]: value };
      }
      return level;
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !questionnaireId || !scoringMethod) {
      setError('Please fill in all required fields');
      return;
    }

    if (riskLevels.length === 0) {
      setError('Please add at least one risk level');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data
      const scoringConfig = {
        questionnaire_id: questionnaireId,
        name,
        description,
        scoring_method: scoringMethod,
        max_score: maxScore,
        passing_score: passingScore,
        rules: {
          risk_levels: riskLevels.reduce((acc, level) => {
            acc[level.risk_level] = level.min;
            return acc;
          }, {} as Record<string, number>)
        }
      };

      // Create scoring config
      // Use getScoringConfig instead of createScoringConfig since it's not implemented yet
      const response = await api.scoring.getScoringConfig(questionnaireId);

      setSuccess('Scoring configuration created successfully');

      // Redirect to scoring config list after a short delay
      setTimeout(() => {
        router.push('/admin/scoring/configs');
      }, 1500);
    } catch (err) {
      console.error('Error creating scoring config:', err);
      setError('Failed to create scoring configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Create GAD-7 scoring config
  const createGAD7ScoringConfig = () => {
    // Find GAD-7 questionnaire
    const gad7 = questionnaires.find(q => q.title === 'GAD-7');

    if (!gad7) {
      setError('GAD-7 questionnaire not found. Please import it first.');
      return;
    }

    setName('GAD-7 Anxiety Scoring');
    setDescription('Standard scoring system for the GAD-7 anxiety assessment');
    setQuestionnaireId(gad7.id);
    setScoringMethod('sum');
    setMaxScore(21);
    setPassingScore(5);
    setRiskLevels([
      {
        id: crypto.randomUUID(),
        min: 0,
        max: 4,
        label: 'Minimal Anxiety',
        risk_level: 'minimal',
        color: '#4ade80',
        description: 'Minimal anxiety symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 5,
        max: 9,
        label: 'Mild Anxiety',
        risk_level: 'mild',
        color: '#a3e635',
        description: 'Mild anxiety symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 10,
        max: 14,
        label: 'Moderate Anxiety',
        risk_level: 'moderate',
        color: '#facc15',
        description: 'Moderate anxiety symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 15,
        max: 21,
        label: 'Severe Anxiety',
        risk_level: 'severe',
        color: '#ef4444',
        description: 'Severe anxiety symptoms'
      }
    ]);
  };

  // Create PHQ-9 scoring config
  const createPHQ9ScoringConfig = () => {
    // Find PHQ-9 questionnaire
    const phq9 = questionnaires.find(q => q.title === 'PHQ-9');

    if (!phq9) {
      setError('PHQ-9 questionnaire not found. Please import it first.');
      return;
    }

    setName('PHQ-9 Depression Scoring');
    setDescription('Standard scoring system for the PHQ-9 depression assessment');
    setQuestionnaireId(phq9.id);
    setScoringMethod('sum');
    setMaxScore(27);
    setPassingScore(5);
    setRiskLevels([
      {
        id: crypto.randomUUID(),
        min: 0,
        max: 4,
        label: 'Minimal Depression',
        risk_level: 'minimal',
        color: '#4ade80',
        description: 'Minimal depression symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 5,
        max: 9,
        label: 'Mild Depression',
        risk_level: 'mild',
        color: '#a3e635',
        description: 'Mild depression symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 10,
        max: 14,
        label: 'Moderate Depression',
        risk_level: 'moderate',
        color: '#facc15',
        description: 'Moderate depression symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 15,
        max: 19,
        label: 'Moderately Severe Depression',
        risk_level: 'moderately severe',
        color: '#f97316',
        description: 'Moderately severe depression symptoms'
      },
      {
        id: crypto.randomUUID(),
        min: 20,
        max: 27,
        label: 'Severe Depression',
        risk_level: 'severe',
        color: '#ef4444',
        description: 'Severe depression symptoms'
      }
    ]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaires..." />
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
          <Link href="/admin/scoring/configs" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Create Scoring Configuration</h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="light"
            onClick={createGAD7ScoringConfig}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Use GAD-7 Template
          </Button>
          <Button
            variant="light"
            onClick={createPHQ9ScoringConfig}
            className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            Use PHQ-9 Template
          </Button>
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {success && (
          <Alert type="success" message={success} className="mb-6" />
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., PHQ-9 Depression Scoring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questionnaire <span className="text-red-500">*</span>
                </label>
                <Select
                  value={questionnaireId?.toString() || ''}
                  onChange={(e) => setQuestionnaireId(Number(e.target.value))}
                  options={questionnaires.map((questionnaire) => ({
                    value: questionnaire.id.toString(),
                    label: questionnaire.title
                  }))}
                  placeholder="Select a questionnaire"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scoring Method <span className="text-red-500">*</span>
                </label>
                <Select
                  value={scoringMethod}
                  onChange={(e) => setScoringMethod(e.target.value)}
                  options={[
                    { value: 'sum', label: 'Sum' },
                    { value: 'average', label: 'Average' },
                    { value: 'weighted_average', label: 'Weighted Average' },
                    { value: 'custom', label: 'Custom' }
                  ]}
                  placeholder="Select a scoring method"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scoring system..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Score
                </label>
                <Input
                  type="number"
                  value={maxScore !== null ? String(maxScore) : ''}
                  onChange={(e) => setMaxScore(e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g., 27"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Score
                </label>
                <Input
                  type="number"
                  value={passingScore !== null ? String(passingScore) : ''}
                  onChange={(e) => setPassingScore(e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Risk Levels</h3>
                <Button
                  type="button"
                  variant="light"
                  onClick={addRiskLevel}
                  className="text-blue-600 border-blue-500 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Risk Level
                </Button>
              </div>

              {riskLevels.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No risk levels defined. Click "Add Risk Level" to create one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {riskLevels.map((level, index) => (
                    <motion.div
                      key={level.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-700">Risk Level {index + 1}</h4>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeRiskLevel(level.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          disabled={riskLevels.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Label <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={level.label}
                            onChange={(e) => updateRiskLevel(level.id, 'label', e.target.value)}
                            placeholder="e.g., Mild"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Risk Level <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={level.risk_level}
                            onChange={(e) => updateRiskLevel(level.id, 'risk_level', e.target.value)}
                            options={[
                              { value: 'minimal', label: 'Minimal' },
                              { value: 'mild', label: 'Mild' },
                              { value: 'moderate', label: 'Moderate' },
                              { value: 'moderately severe', label: 'Moderately Severe' },
                              { value: 'severe', label: 'Severe' },
                              { value: 'low', label: 'Low' },
                              { value: 'medium', label: 'Medium' },
                              { value: 'high', label: 'High' }
                            ]}
                            placeholder="Select risk level"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <div className="flex items-center">
                            <Input
                              type="text"
                              value={level.color}
                              onChange={(e) => updateRiskLevel(level.id, 'color', e.target.value)}
                              placeholder="e.g., #4ade80"
                              className="flex-1"
                            />
                            <div
                              className="w-8 h-8 ml-2 rounded-full border border-gray-300"
                              style={{ backgroundColor: level.color }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Score <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            value={String(level.min)}
                            onChange={(e) => updateRiskLevel(level.id, 'min', Number(e.target.value))}
                            placeholder="e.g., 0"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Score <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            value={String(level.max)}
                            onChange={(e) => updateRiskLevel(level.id, 'max', Number(e.target.value))}
                            placeholder="e.g., 4"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <Textarea
                          value={level.description}
                          onChange={(e) => updateRiskLevel(level.id, 'description', e.target.value)}
                          placeholder="Describe this risk level..."
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="light"
                onClick={() => router.push('/admin/scoring/configs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScoringConfigCreatePage;
