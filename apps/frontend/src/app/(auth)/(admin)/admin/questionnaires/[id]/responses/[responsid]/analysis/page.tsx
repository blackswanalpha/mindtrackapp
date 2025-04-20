'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';
import api from '@/services/api';

const ResponseAnalysisPage = () => {
  const params = useParams();
  const router = useRouter();
  const responseId = Number(params.id);
  
  const [response, setResponse] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch response
        const responseData = await api.responses.getById(responseId);
        setResponse(responseData.response);
        
        // Fetch analysis
        try {
          const analysisData = await api.aiAnalysis.getByResponse(responseId);
          setAnalysis(analysisData.analysis);
        } catch (err) {
          setError('No analysis available for this response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId) {
      fetchData();
    }
  }, [responseId]);

  const generateNewAnalysis = async () => {
    try {
      setIsLoading(true);
      const result = await api.aiAnalysis.generate(responseId);
      setAnalysis(result.analysis);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setIsLoading(false);
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">AI Analysis</h2>
            <p className="text-gray-600">
              {response?.patient_name
                ? `Analysis for ${response.patient_name}'s response`
                : 'Analysis for anonymous response'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/responses/${responseId}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Response
            </Link>
            <button
              onClick={generateNewAnalysis}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate New Analysis
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4">
            <button
              onClick={generateNewAnalysis}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Generate Analysis
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Analysis Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Details</h3>
              <p className="text-gray-700">
                <span className="font-medium">Created:</span>{' '}
                {new Date(analysis.created_at).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Model:</span> {analysis.model_used}
              </p>
              {response.score !== null && (
                <p className="text-gray-700">
                  <span className="font-medium">Score:</span> {response.score}
                </p>
              )}
              {response.risk_level && (
                <p className="text-gray-700">
                  <span className="font-medium">Risk Level:</span>{' '}
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      response.risk_level === 'high'
                        ? 'bg-red-100 text-red-800'
                        : response.risk_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {response.risk_level.toUpperCase()}
                  </span>
                </p>
              )}
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Prompt</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">{analysis.prompt}</p>
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis</h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{analysis.analysis}</p>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{analysis.recommendations}</p>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {analysis.risk_assessment && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{analysis.risk_assessment}</p>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ResponseAnalysisPage;
