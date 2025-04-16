'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';

type Questionnaire = {
  id: number;
  title: string;
  description: string;
  type: string;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
};

const QuestionnaireList: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, active, public, templates

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let params = {};
        
        // Apply filters
        if (filter === 'active') {
          params = { is_active: true };
        } else if (filter === 'public') {
          params = { is_public: true };
        } else if (filter === 'templates') {
          params = { is_template: true };
        }
        
        const response = await api.questionnaires.getAll(params);
        setQuestionnaires(response.questionnaires);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questionnaires');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this questionnaire?')) {
      return;
    }

    try {
      await api.questionnaires.delete(id);
      // Remove deleted questionnaire from state
      setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete questionnaire');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Questionnaires</h2>
          <p className="text-gray-600">Manage your questionnaires</p>
        </div>
        <Link
          href="/questionnaires/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`px-4 py-2 rounded-md ${
              filter === 'public'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setFilter('templates')}
            className={`px-4 py-2 rounded-md ${
              filter === 'templates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      {questionnaires.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No questionnaires found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questionnaires.map((questionnaire) => (
                <tr key={questionnaire.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {questionnaire.title}
                    </div>
                    {questionnaire.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {questionnaire.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        questionnaire.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {questionnaire.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {questionnaire.is_public && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Public
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(questionnaire.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/questionnaires/${questionnaire.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        href={`/questionnaires/${questionnaire.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/questionnaires/${questionnaire.id}/questions`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Questions
                      </Link>
                      <button
                        onClick={() => handleDelete(questionnaire.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireList;
