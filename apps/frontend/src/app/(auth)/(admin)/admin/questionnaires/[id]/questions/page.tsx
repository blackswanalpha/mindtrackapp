'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Filter, SortAsc, SortDesc, FileText } from 'lucide-react';
import { Card, Button, Loading, Alert } from '@/components/common';
import QuestionList from '@/components/questionnaire/QuestionList';
import api from '@/services/api';
import { motion } from 'framer-motion';

const QuestionsListPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching questionnaire with ID:', id);
        const response = await api.questionnaires.getById(Number(id));
        console.log('Fetched questionnaire data:', response);
        setQuestionnaire(response);
      } catch (err) {
        console.error('Error fetching questionnaire details:', err);
        setError('Failed to load questionnaire details');

        // Fallback to mock data if API fails
        const mockQuestionnaire = {
          id: Number(id),
          title: id === '1' ? 'Depression Assessment (PHQ-9)' :
                 id === '2' ? 'Anxiety Screening (GAD-7)' :
                 id === '3' ? 'Well-being Check' : 'Mental Health Questionnaire',
          description: 'A standardized questionnaire for screening and measuring the severity of depression.',
          type: 'assessment',
          category: 'Mental Health',
        };

        setQuestionnaire(mockQuestionnaire);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire details..." />
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load questionnaire'} />
        <div className="mt-4">
          <Link href="/admin/questionnaires" className="text-blue-600 hover:text-blue-800">
            Back to Questionnaires
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center">
          <Link href={`/admin/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
            <p className="text-gray-600">
              {questionnaire.title}
            </p>
          </div>
        </div>

        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={() => router.push(`/admin/questionnaires/${id}/questions/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                className={`px-3 py-2 border ${sortOrder === 'asc' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'} rounded-md hover:bg-gray-50`}
                onClick={() => setSortOrder('asc')}
              >
                <SortAsc className="h-5 w-5 mr-1" />
                Ascending
              </Button>
              <Button
                className={`px-3 py-2 border ${sortOrder === 'desc' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'} rounded-md hover:bg-gray-50`}
                onClick={() => setSortOrder('desc')}
              >
                <SortDesc className="h-5 w-5 mr-1" />
                Descending
              </Button>
            </div>
          </div>

          <QuestionList questionnaireId={Number(id)} />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <FileText className="h-4 w-4 inline mr-1" />
                Questions in this questionnaire
              </div>
              <Button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/questionnaires/${id}`)}
              >
                Back to Questionnaire
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuestionsListPage;
