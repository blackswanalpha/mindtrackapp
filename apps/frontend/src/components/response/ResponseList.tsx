'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { Mail, Download, Eye, Flag } from 'lucide-react';

type Response = {
  id: number;
  questionnaire_id: number;
  patient_name: string;
  patient_email: string;
  score: number;
  risk_level: string;
  flagged_for_review: boolean;
  completed_at: string;
};

type ResponseListProps = {
  questionnaireId?: number;
};

const ResponseList: React.FC<ResponseListProps> = ({ questionnaireId }) => {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, flagged, high_risk, medium_risk, low_risk
  const [selectedResponses, setSelectedResponses] = useState<number[]>([])

  useEffect(() => {
    const fetchResponses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let params: any = {};

        // Apply questionnaire filter if provided
        if (questionnaireId) {
          params.questionnaire_id = questionnaireId;
        }

        // Apply risk/flag filters
        if (filter === 'flagged') {
          params.flagged_for_review = true;
        } else if (filter === 'high_risk') {
          params.risk_level = 'high';
        } else if (filter === 'medium_risk') {
          params.risk_level = 'medium';
        } else if (filter === 'low_risk') {
          params.risk_level = 'low';
        }

        const response = await api.responses.getAll(params);
        setResponses(response.responses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch responses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [questionnaireId, filter]);

  const handleFlag = async (id: number, flagged: boolean) => {
    try {
      await api.responses.flag(id, flagged);
      // Update response in state
      setResponses((prev) =>
        prev.map((r) => (r.id === id ? { ...r, flagged_for_review: flagged } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update flag status');
    }
  };

  // Handle response selection
  const handleSelectResponse = (id: number) => {
    setSelectedResponses(prev => {
      if (prev.includes(id)) {
        return prev.filter(responseId => responseId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedResponses.length === responses.length) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(responses.map(response => response.id));
    }
  };

  // Send email to selected responses
  const handleSendEmail = async () => {
    if (selectedResponses.length === 0) {
      return;
    }

    router.push(`/email/send?responses=${selectedResponses.join(',')}`);
  };

  // Export selected responses
  const handleExport = async () => {
    if (selectedResponses.length === 0) {
      return;
    }

    try {
      const response = await api.responses.export(selectedResponses);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `responses-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export responses');
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
          <h2 className="text-2xl font-bold">Responses</h2>
          <p className="text-gray-600">
            {questionnaireId
              ? 'Responses for this questionnaire'
              : 'All questionnaire responses'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSendEmail}
            disabled={selectedResponses.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </button>
          <button
            onClick={handleExport}
            disabled={selectedResponses.length === 0}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
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
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-md ${
              filter === 'flagged'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Flagged
          </button>
          <button
            onClick={() => setFilter('high_risk')}
            className={`px-4 py-2 rounded-md ${
              filter === 'high_risk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setFilter('medium_risk')}
            className={`px-4 py-2 rounded-md ${
              filter === 'medium_risk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Medium Risk
          </button>
          <button
            onClick={() => setFilter('low_risk')}
            className={`px-4 py-2 rounded-md ${
              filter === 'low_risk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Low Risk
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No responses found.</p>
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedResponses.length === responses.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Respondent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Risk Level
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
                  Completed
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
              {responses.map((response) => (
                <tr key={response.id} className={`hover:bg-gray-50 ${response.flagged_for_review ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedResponses.includes(response.id)}
                      onChange={() => handleSelectResponse(response.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {response.patient_name || 'Anonymous'}
                    </div>
                    {response.patient_email && (
                      <div className="text-sm text-gray-500">{response.patient_email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {response.score !== null ? response.score : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        response.risk_level === 'high'
                          ? 'bg-red-100 text-red-800'
                          : response.risk_level === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {response.risk_level ? response.risk_level.toUpperCase() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {response.flagged_for_review && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Flagged
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {response.completed_at
                      ? new Date(response.completed_at).toLocaleDateString()
                      : 'Incomplete'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/responses/view/${response.unique_code}`}
                        className="flex items-center p-1 text-blue-600 hover:text-blue-900"
                        title="View Response"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/email/send?responses=${response.id}`}
                        className="flex items-center p-1 text-indigo-600 hover:text-indigo-900"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() =>
                          handleFlag(response.id, !response.flagged_for_review)
                        }
                        className={`flex items-center p-1 ${
                          response.flagged_for_review
                            ? 'text-gray-600 hover:text-gray-900'
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        title={response.flagged_for_review ? 'Unflag' : 'Flag'}
                      >
                        <Flag className="h-4 w-4" />
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

export default ResponseList;
