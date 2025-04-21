'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Loading, Select } from '@/components/common';
import { Database, FileText, Users, BarChart3, RefreshCw, Plus, CheckCircle, Server, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import generateGAD7Responses from '@/scripts/generate-gad7-responses';
import generateGAD7DatabaseResponses from '@/scripts/generate-gad7-database-responses';
import createGAD7Questionnaire from '@/scripts/create-gad7-questionnaire';
import mockStorage from '@/services/mockStorage';
import api from '@/services/api';

const TestDataPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [generatedCount, setGeneratedCount] = useState<{ gad7: number; dbResponses: number; questionnaires: number }>({ gad7: 0, dbResponses: 0, questionnaires: 0 });
  const [isCreatingQuestionnaire, setIsCreatingQuestionnaire] = useState(false);
  const [isGeneratingDbResponses, setIsGeneratingDbResponses] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string>('');

  // Fetch questionnaires
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await api.questionnaires.getAll();
        const questionnaireData = Array.isArray(response)
          ? response
          : (response?.questionnaires || []);
        setQuestionnaires(questionnaireData);

        // Find GAD-7 questionnaire
        const gad7 = questionnaireData.find((q: any) => q.title.includes('GAD-7'));
        if (gad7) {
          setSelectedQuestionnaireId(gad7.id.toString());
          setGeneratedCount(prev => ({ ...prev, questionnaires: 1 }));
        }
      } catch (error) {
        console.error('Error fetching questionnaires:', error);
      }
    };

    fetchQuestionnaires();
  }, []);

  // Create GAD-7 questionnaire
  const handleCreateGAD7Questionnaire = async () => {
    try {
      setIsCreatingQuestionnaire(true);
      setMessage(null);

      // Create GAD-7 questionnaire
      const questionnaireId = await createGAD7Questionnaire();

      setGeneratedCount(prev => ({ ...prev, questionnaires: prev.questionnaires + 1 }));
      setSelectedQuestionnaireId(questionnaireId.toString());
      setMessage({
        type: 'success',
        text: `Successfully created GAD-7 questionnaire with ID: ${questionnaireId}`
      });

      // Refresh questionnaires list
      const response = await api.questionnaires.getAll();
      const questionnaireData = Array.isArray(response)
        ? response
        : (response?.questionnaires || []);
      setQuestionnaires(questionnaireData);
    } catch (error) {
      console.error('Error creating GAD-7 questionnaire:', error);
      setMessage({
        type: 'error',
        text: 'Failed to create GAD-7 questionnaire. See console for details.'
      });
    } finally {
      setIsCreatingQuestionnaire(false);
    }
  };

  // Generate GAD-7 responses in mock storage
  const handleGenerateGAD7 = async () => {
    try {
      setIsGenerating(true);
      setMessage(null);

      // Generate 20 GAD-7 responses
      const responses = generateGAD7Responses(20);

      setGeneratedCount(prev => ({ ...prev, gad7: prev.gad7 + responses.length }));
      setMessage({
        type: 'success',
        text: `Successfully generated ${responses.length} GAD-7 responses`
      });
    } catch (error) {
      console.error('Error generating GAD-7 responses:', error);
      setMessage({
        type: 'error',
        text: 'Failed to generate GAD-7 responses. See console for details.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset all mock data
  const handleResetData = async () => {
    try {
      setIsGenerating(true);
      setMessage(null);

      // Clear localStorage and reinitialize mock storage
      localStorage.clear();
      mockStorage.initialize();

      setGeneratedCount({ gad7: 0, dbResponses: 0, questionnaires: 0 });
      setMessage({
        type: 'success',
        text: 'Successfully reset all test data'
      });
    } catch (error) {
      console.error('Error resetting test data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to reset test data. See console for details.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Database className="h-8 w-8 mr-3 text-indigo-600" />
              Test Data Generator
            </h1>
            <p className="text-gray-600">
              Generate test data for development and testing purposes
            </p>
          </div>
        </div>

        {message && (
          <Alert
            type={message.type}
            message={message.text}
            className="mb-6"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* GAD-7 Questionnaire Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full mr-4">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">GAD-7 Questionnaire</h2>
                <p className="text-gray-600 text-sm">Create anxiety assessment questionnaire</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Created:</span>
                <span className="font-semibold">{generatedCount.questionnaires}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (generatedCount.questionnaires / 1) * 100)}%` }}
                ></div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleCreateGAD7Questionnaire}
              disabled={isCreatingQuestionnaire || generatedCount.questionnaires > 0}
              className="w-full"
            >
              {isCreatingQuestionnaire ? (
                <>
                  <div className="inline-block">
                    <Loading size="small" />
                  </div>
                  <span className="ml-2">Creating...</span>
                </>
              ) : generatedCount.questionnaires > 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Questionnaire Created
                </>
              ) : (
                <>
                  Create GAD-7 Questionnaire
                </>
              )}
            </Button>
          </Card>

          {/* GAD-7 Mock Storage Responses Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Mock Storage Responses</h2>
                <p className="text-gray-600 text-sm">Generate responses in browser storage</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Generated:</span>
                <span className="font-semibold">{generatedCount.gad7}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (generatedCount.gad7 / 100) * 100)}%` }}
                ></div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleGenerateGAD7}
              disabled={isGenerating || generatedCount.questionnaires === 0}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="inline-block">
                    <Loading size="small" />
                  </div>
                  <span className="ml-2">Generating...</span>
                </>
              ) : generatedCount.questionnaires === 0 ? (
                <>Create questionnaire first</>
              ) : (
                <>Generate 20 Mock Responses</>
              )}
            </Button>
          </Card>

          {/* GAD-7 Database Responses Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Server className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Database Responses</h2>
                <p className="text-gray-600 text-sm">Generate responses in the database</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Generated:</span>
                <span className="font-semibold">{generatedCount.dbResponses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (generatedCount.dbResponses / 100) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="questionnaire" className="block text-sm font-medium text-gray-700 mb-1">
                Select Questionnaire
              </label>
              <Select
                id="questionnaire"
                value={selectedQuestionnaireId}
                onChange={(e) => setSelectedQuestionnaireId(e.target.value)}
                options={[
                  { value: '', label: 'Select a questionnaire' },
                  ...questionnaires.map((q: any) => ({
                    value: q.id.toString(),
                    label: q.title
                  }))
                ]}
              />
            </div>

            <Button
              variant="primary"
              onClick={async () => {
                try {
                  setIsGeneratingDbResponses(true);
                  setMessage(null);

                  if (!selectedQuestionnaireId) {
                    setMessage({
                      type: 'error',
                      text: 'Please select a questionnaire'
                    });
                    return;
                  }

                  const responses = await generateGAD7DatabaseResponses(
                    parseInt(selectedQuestionnaireId),
                    20
                  );

                  setGeneratedCount(prev => ({
                    ...prev,
                    dbResponses: prev.dbResponses + responses.length
                  }));

                  setMessage({
                    type: 'success',
                    text: `Successfully generated ${responses.length} database responses`
                  });
                } catch (error) {
                  console.error('Error generating database responses:', error);
                  setMessage({
                    type: 'error',
                    text: 'Failed to generate database responses. See console for details.'
                  });
                } finally {
                  setIsGeneratingDbResponses(false);
                }
              }}
              disabled={isGeneratingDbResponses || !selectedQuestionnaireId}
              className="w-full"
            >
              {isGeneratingDbResponses ? (
                <>
                  <div className="inline-block">
                    <Loading size="small" />
                  </div>
                  <span className="ml-2">Generating...</span>
                </>
              ) : !selectedQuestionnaireId ? (
                <>Select a questionnaire</>
              ) : (
                <>Generate 20 DB Responses</>
              )}
            </Button>
          </Card>

          {/* Reset Data Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <RefreshCw className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Reset Data</h2>
                <p className="text-gray-600 text-sm">Clear all test data and start fresh</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                This will reset all mock data to the initial state. All generated responses will be lost.
              </p>
            </div>

            <Button
              variant="danger"
              onClick={handleResetData}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 inline-block">
                    <Loading size="small" />
                  </div>
                  Resetting...
                </>
              ) : (
                <>
                  Reset All Data
                </>
              )}
            </Button>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About Test Data</h2>
          <p className="text-gray-600 mb-4">
            This page allows you to generate realistic test data for development and testing purposes.
            The generated data is stored in your browser's localStorage and will persist until you clear it.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">GAD-7 Questionnaire</h3>
          <p className="text-gray-600 mb-4">
            The GAD-7 (Generalized Anxiety Disorder-7) is a seven-item questionnaire used to assess anxiety severity.
            The questionnaire includes the following questions, each with proper question types:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>Feeling nervous, anxious, or on edge</li>
            <li>Not being able to stop or control worrying</li>
            <li>Worrying too much about different things</li>
            <li>Trouble relaxing</li>
            <li>Being so restless that it's hard to sit still</li>
            <li>Becoming easily annoyed or irritable</li>
            <li>Feeling afraid as if something awful might happen</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">GAD-7 Responses</h3>
          <p className="text-gray-600 mb-4">
            Generated responses will have realistic distributions of anxiety levels:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>30% Minimal anxiety (scores 0-4)</li>
            <li>30% Mild anxiety (scores 5-9)</li>
            <li>25% Moderate anxiety (scores 10-14)</li>
            <li>15% Severe anxiety (scores 15-21)</li>
          </ul>
          <p className="text-gray-600">
            Responses with scores of 15 or higher will be automatically flagged for review.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default TestDataPage;
