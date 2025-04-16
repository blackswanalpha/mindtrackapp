'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';
import api from '@/services/api';

const ResponseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const responseId = Number(params.id);
  
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const fetchResponseWithAnswers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const responseData = await api.responses.getWithAnswers(responseId);
        setResponse(responseData.response);
        
        // Check if analysis exists
        try {
          const analysisData = await api.aiAnalysis.getByResponse(responseId);
          setHasAnalysis(!!analysisData.analysis);
        } catch (err) {
          // Analysis doesn't exist, that's okay
          setHasAnalysis(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch response');
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId) {
      fetchResponseWithAnswers();
    }
  }, [responseId]);

  const handleFlag = async () => {
    try {
      await api.responses.flag(responseId, !response.flagged_for_review);
      setResponse({
        ...response,
        flagged_for_review: !response.flagged_for_review,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update flag status');
    }
  };

  const generateAnalysis = async () => {
    try {
      await api.aiAnalysis.generate(responseId);
      setHasAnalysis(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    }
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
            <h2 className="text-2xl font-bold">Response Details</h2>
            <p className="text-gray-600">
              Submitted {response.completed_at
                ? new Date(response.completed_at).toLocaleString()
                : 'Incomplete'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleFlag}
              className={`px-4 py-2 rounded-md ${
                response.flagged_for_review
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-red-600 text-white hover:bg-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {response.flagged_for_review ? 'Unflag Response' : 'Flag for Review'}
            </button>
            
            {hasAnalysis ? (
              <Link
                href={`/responses/${responseId}/analysis`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Analysis
              </Link>
            ) : (
              <button
                onClick={generateAnalysis}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Generate Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Response Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Respondent</h3>
          <p className="text-gray-700">
            <span className="font-medium">Name:</span>{' '}
            {response.patient_name || 'Anonymous'}
          </p>
          {response.patient_email && (
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {response.patient_email}
            </p>
          )}
          {response.patient_age && (
            <p className="text-gray-700">
              <span className="font-medium">Age:</span> {response.patient_age}
            </p>
          )}
          {response.patient_gender && (
            <p className="text-gray-700">
              <span className="font-medium">Gender:</span> {response.patient_gender}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Score</h3>
          {response.score !== null ? (
            <>
              <div className="text-4xl font-bold text-center mb-2">{response.score}</div>
              <div className="flex justify-center">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    response.risk_level === 'high'
                      ? 'bg-red-100 text-red-800'
                      : response.risk_level === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {response.risk_level ? response.risk_level.toUpperCase() : 'N/A'} RISK
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No score available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  response.completed_at ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
              <span>
                {response.completed_at ? 'Completed' : 'Incomplete'}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  response.flagged_for_review ? 'bg-red-500' : 'bg-gray-300'
                }`}
              ></div>
              <span>
                {response.flagged_for_review ? 'Flagged for Review' : 'Not Flagged'}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  hasAnalysis ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></div>
              <span>
                {hasAnalysis ? 'Analysis Available' : 'No Analysis'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Answers</h3>
        
        {response.answers && response.answers.length > 0 ? (
          <div className="space-y-6">
            {response.answers.map((answer: any) => (
              <div key={answer.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    {answer.question.id}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{answer.question.text}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-700">{answer.value}</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Question Type: {answer.question.type.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No answers available</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResponseDetailPage;
