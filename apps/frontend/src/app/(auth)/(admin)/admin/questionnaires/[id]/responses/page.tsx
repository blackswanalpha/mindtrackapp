'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Filter, Download, AlertCircle } from 'lucide-react';
import ResponseList from '@/components/response/ResponseList';
import api from '@/services/api';

const ResponsesPage = () => {
  const params = useParams();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract questionnaire ID from URL params
  const questionnaireId = params.id ? parseInt(params.id as string, 10) : null;

  // Fetch questionnaire details
  useEffect(() => {
    const fetchQuestionnaireDetails = async () => {
      if (!questionnaireId) {
        setError('Invalid questionnaire ID');
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.questionnaires.getById(questionnaireId);
        setQuestionnaire(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching questionnaire:', err);
        setError('Failed to load questionnaire details');
        setIsLoading(false);
      }
    };

    fetchQuestionnaireDetails();
  }, [questionnaireId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !questionnaireId) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline ml-1">{error || 'Invalid questionnaire ID'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Responses</h1>
          <p className="text-gray-600 mt-1">
            {questionnaire ? (
              <>Viewing responses for <span className="font-medium">{questionnaire.title}</span></>
            ) : (
              'View and manage questionnaire responses'
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Response List */}
      <ResponseList questionnaireId={questionnaireId} />
    </div>
  );
};

export default ResponsesPage;
