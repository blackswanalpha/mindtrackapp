'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, GripVertical, Eye, Plus, Copy, AlertTriangle, CheckCircle, HelpCircle, List, Calendar, Star, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/common';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

type Question = {
  id: number;
  text: string;
  type: string;
  required: boolean;
  order_num: number;
  options?: Array<{ value: number; label: string }>;
};

type QuestionListProps = {
  questionnaireId: number;
};

const QuestionList: React.FC<QuestionListProps> = ({ questionnaireId }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedQuestionId, setDraggedQuestionId] = useState<number | null>(null);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          try {
            console.log('Fetching questions for questionnaire ID:', questionnaireId);
            const response = await api.questions.getByQuestionnaire(questionnaireId);
            console.log('Fetched questions:', response);

            // Handle different response formats
            const questionsData = Array.isArray(response) ? response :
                               (response.questions ? response.questions : []);

            setQuestions(questionsData);
          } catch (err) {
            console.error('Error fetching questions:', err);
            setError('Failed to load questions from API, using mock data');

            // Fallback to mock data if API fails
            const mockQuestions: Question[] = [
              {
                id: 1,
                text: 'Little interest or pleasure in doing things',
                type: 'single_choice',
                required: true,
                order_num: 1,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 2,
                text: 'Feeling down, depressed, or hopeless',
                type: 'single_choice',
                required: true,
                order_num: 2,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 3,
                text: 'Trouble falling or staying asleep, or sleeping too much',
                type: 'single_choice',
                required: true,
                order_num: 3,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 4,
                text: 'Feeling tired or having little energy',
                type: 'single_choice',
                required: true,
                order_num: 4,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 5,
                text: 'Poor appetite or overeating',
                type: 'single_choice',
                required: true,
                order_num: 5,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 6,
                text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
                type: 'single_choice',
                required: true,
                order_num: 6,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 7,
                text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
                type: 'single_choice',
                required: true,
                order_num: 7,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 8,
                text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
                type: 'single_choice',
                required: true,
                order_num: 8,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              },
              {
                id: 9,
                text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
                type: 'single_choice',
                required: true,
                order_num: 9,
                options: [
                  { value: 0, label: 'Not at all' },
                  { value: 1, label: 'Several days' },
                  { value: 2, label: 'More than half the days' },
                  { value: 3, label: 'Nearly every day' }
                ]
              }
            ];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setQuestions(mockQuestions);
          }
        }
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    if (questionnaireId) {
      fetchQuestions();
    }
  }, [questionnaireId]);

  // Handle question deletion
  const handleDelete = async (questionId: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        await api.questions.delete(questionId);

        // Update state
        setQuestions(questions.filter(q => q.id !== questionId));

        alert('Question deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete question');
      console.error(err);
    }
  };

  // Handle drag start
  const handleDragStart = (questionId: number) => {
    setIsDragging(true);
    setDraggedQuestionId(questionId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, questionId: number) => {
    e.preventDefault();

    if (draggedQuestionId === null || draggedQuestionId === questionId) {
      return;
    }

    // Find the dragged question and the target question
    const draggedQuestion = questions.find(q => q.id === draggedQuestionId);
    const targetQuestion = questions.find(q => q.id === questionId);

    if (!draggedQuestion || !targetQuestion) {
      return;
    }

    // Reorder questions
    const newQuestions = [...questions];
    const draggedIndex = newQuestions.findIndex(q => q.id === draggedQuestionId);
    const targetIndex = newQuestions.findIndex(q => q.id === questionId);

    // Remove dragged question
    newQuestions.splice(draggedIndex, 1);

    // Insert at target position
    newQuestions.splice(targetIndex, 0, draggedQuestion);

    // Update order_num
    newQuestions.forEach((q, index) => {
      q.order_num = index + 1;
    });

    setQuestions(newQuestions);
  };

  // Handle drag end
  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedQuestionId(null);

    try {
      if (typeof window !== 'undefined') {
        // Save the new order to the API
        await api.questions.reorder(questionnaireId, questions.map(q => ({ id: q.id, order_num: q.order_num })));
      }
    } catch (err) {
      setError('Failed to save question order');
      console.error(err);
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
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      case 'single_choice':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'multiple_choice':
        return <List className="h-4 w-4 text-purple-500" />;
      case 'rating':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'yes_no':
        return <ToggleLeft className="h-4 w-4 text-indigo-500" />;
      case 'scale':
        return <List className="h-4 w-4 text-orange-500" />;
      case 'date':
        return <Calendar className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No questions found for this questionnaire.</p>
        <Button
          variant="primary"
          onClick={() => router.push(`/admin/questionnaires/${questionnaireId}/questions/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add First Question
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            draggable
            onDragStart={() => handleDragStart(question.id)}
            onDragOver={(e) => handleDragOver(e, question.id)}
            onDragEnd={handleDragEnd}
            className={`bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 ${
              isDragging && draggedQuestionId === question.id ? 'opacity-50 border-blue-300 bg-blue-50' : ''
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-1 text-gray-400 hover:text-gray-600 transition-colors">
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {question.order_num}
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      {getQuestionTypeIcon(question.type)}
                      <span className="ml-1">{getQuestionTypeDisplay(question.type)}</span>
                    </span>
                    {question.required && (
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Required
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors p-1.5"
                      aria-label="View question"
                      onClick={() => router.push(`/admin/questionnaires/${questionnaireId}/questions/${question.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors p-1.5"
                      aria-label="Edit question"
                      onClick={() => router.push(`/admin/questionnaires/${questionnaireId}/questions/${question.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-white border border-gray-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors p-1.5"
                      aria-label="Duplicate question"
                      onClick={() => {
                        // This would duplicate the question
                        alert('Duplicate functionality would be implemented here');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors p-1.5"
                      aria-label="Delete question"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-800 font-medium">{question.text}</p>

                {question.options && question.options.length > 0 && (
                  <div className="mt-3 pl-3 border-l-2 border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Options:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Array.isArray(question.options) ?
                        question.options.map((option, optIndex) => (
                          <motion.div
                            key={optIndex}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: optIndex * 0.05 }}
                            className="flex items-center p-1.5 bg-gray-50 rounded-md text-sm text-gray-700"
                          >
                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-2 text-xs font-medium">
                              {option.value}
                            </div>
                            <span>{option.label}</span>

                          </motion.div>
                        )) :
                        <p className="text-gray-500 italic text-sm">Options data format is not valid.</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QuestionList;
