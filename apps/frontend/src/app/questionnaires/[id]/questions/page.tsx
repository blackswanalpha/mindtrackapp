'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';
import api from '@/services/api';

type Question = {
  id: number;
  text: string;
  type: string;
  required: boolean;
  order_num: number;
};

const QuestionsPage = () => {
  const params = useParams();
  const router = useRouter();
  const questionnaireId = Number(params.id);
  
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedQuestions, setReorderedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestionnaireWithQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.questionnaires.getWithQuestions(questionnaireId);
        setQuestionnaire(response.questionnaire);
        setQuestions(response.questions);
        setReorderedQuestions(response.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questionnaire and questions');
      } finally {
        setIsLoading(false);
      }
    };

    if (questionnaireId) {
      fetchQuestionnaireWithQuestions();
    }
  }, [questionnaireId]);

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.questions.delete(questionId);
      // Remove deleted question from state
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setReorderedQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === reorderedQuestions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...reorderedQuestions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap questions
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];
    
    // Update order numbers
    newQuestions.forEach((q, i) => {
      q.order_num = i + 1;
    });
    
    setReorderedQuestions(newQuestions);
  };

  const saveReordering = async () => {
    try {
      // Format questions for API
      const questionsToUpdate = reorderedQuestions.map((q) => ({
        id: q.id,
        order_num: q.order_num,
      }));
      
      await api.questions.reorder(questionnaireId, questionsToUpdate);
      
      // Exit reorder mode and update questions
      setReorderMode(false);
      setQuestions(reorderedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question order');
    }
  };

  const cancelReordering = () => {
    setReorderedQuestions(questions);
    setReorderMode(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{questionnaire?.title} - Questions</h2>
            <p className="text-gray-600">Manage questions for this questionnaire</p>
          </div>
          <div className="flex space-x-2">
            {reorderMode ? (
              <>
                <button
                  onClick={saveReordering}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Save Order
                </button>
                <button
                  onClick={cancelReordering}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setReorderMode(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reorder
                </button>
                <Link
                  href={`/questionnaires/${questionnaireId}/questions/add`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Question
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {(reorderMode ? reorderedQuestions : questions).length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No questions found for this questionnaire.</p>
          <Link
            href={`/questionnaires/${questionnaireId}/questions/add`}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add First Question
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {(reorderMode ? reorderedQuestions : questions).map((question, index) => (
              <li key={question.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      {question.order_num}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{question.text}</h3>
                      <div className="flex space-x-2 mt-1">
                        <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800">
                          {question.type.replace('_', ' ').toUpperCase()}
                        </span>
                        {question.required && (
                          <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {reorderMode ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === reorderedQuestions.length - 1}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Link
                        href={`/questionnaires/${questionnaireId}/questions/${question.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default QuestionsPage;
