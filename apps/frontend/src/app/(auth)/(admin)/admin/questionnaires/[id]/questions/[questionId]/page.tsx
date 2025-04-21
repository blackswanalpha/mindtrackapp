'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert
} from '@/components/common';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  List,
  Calendar,
  Star,
  ToggleLeft,
  FileText
} from 'lucide-react';
import api from '@/services/api';
import { motion } from 'framer-motion';

const QuestionDetailPage = () => {
  const { id, questionId } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          console.log('Fetching question data for ID:', questionId);

          // Fetch questionnaire
          const questionnaireData = await api.questionnaires.getById(Number(id));
          setQuestionnaire(questionnaireData);

          // Fetch question
          const questionData = await api.questions.getById(Number(questionId));
          console.log('Fetched question data:', questionData);
          setQuestion(questionData);
        }
      } catch (err) {
        console.error('Error fetching question data:', err);
        setError('Failed to load question data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && questionId) {
      fetchData();
    }
  }, [id, questionId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        await api.questions.delete(Number(questionId));
        router.push(`/admin/questionnaires/${id}/questions`);
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question');
      setIsDeleting(false);
    }
  };

  // Get question type display name
  const getQuestionTypeDisplay = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'single_choice':
        return 'Single Choice';
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'rating':
        return 'Rating';
      case 'yes_no':
        return 'Yes/No';
      case 'scale':
        return 'Scale';
      case 'date':
        return 'Date';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get icon for question type
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <HelpCircle className="h-5 w-5" />;
      case 'single_choice':
        return <CheckCircle className="h-5 w-5" />;
      case 'multiple_choice':
        return <List className="h-5 w-5" />;
      case 'rating':
        return <Star className="h-5 w-5" />;
      case 'yes_no':
        return <ToggleLeft className="h-5 w-5" />;
      case 'scale':
        return <List className="h-5 w-5" />;
      case 'date':
        return <Calendar className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading question data..." />
      </div>
    );
  }

  if (error || !questionnaire || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load question data'} />
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={() => router.push(`/admin/questionnaires/${id}/questions`)}
          >
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/admin/questionnaires/${id}/questions`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Question Details</h1>
          <p className="text-gray-600">
            {questionnaire.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    {getQuestionTypeIcon(question.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{question.text}</h2>
                    <div className="flex items-center mt-1">
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        {getQuestionTypeDisplay(question.type)}
                      </span>
                      {question.required && (
                        <span className="ml-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                      <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        Order: {question.order_num}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {question.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-800">{question.description}</p>
                </div>
              )}

              {question.options && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Options</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {Array.isArray(question.options) ?
                        question.options.map((option: any, index: number) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center p-2 bg-white rounded-md shadow-sm"
                          >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-3">
                              {option.value}
                            </div>
                            <span className="text-gray-800">{option.label}</span>
                            {option.score !== undefined && (
                              <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                                Score: {option.score}
                              </span>
                            )}
                          </motion.li>
                        )) :
                        <p className="text-gray-500 italic">Options data format is not valid.</p>
                      }
                    </ul>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Scoring Weight</p>
                    <p className="text-gray-800 font-medium">{question.scoring_weight || 1}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-gray-800 font-medium">
                      {question.created_at ? new Date(question.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <h2 className="text-xl font-semibold mb-6">Actions</h2>
              <div className="space-y-3">
                <Button
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/admin/questionnaires/${id}/questions/${questionId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Question
                </Button>

                <Button
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // This would duplicate the question
                    alert('Duplicate functionality would be implemented here');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>

                <Button
                  className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Question'}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Card>
              <h2 className="text-xl font-semibold mb-4">Navigation</h2>
              <div className="space-y-3">
                <Button
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/admin/questionnaires/${id}`)}
                >
                  Back to Questionnaire
                </Button>

                <Button
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/admin/questionnaires/${id}/questions`)}
                >
                  All Questions
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
