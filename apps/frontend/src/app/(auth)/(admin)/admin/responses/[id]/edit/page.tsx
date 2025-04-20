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
  Save,
  Trash2
} from 'lucide-react';
import ResponseForm from '@/components/response/ResponseForm';
import api from '@/services/api';

const EditResponsePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [response, setResponse] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          // Fetch response with answers
          const responseData = await api.responses.getWithAnswers(Number(id));
          setResponse(responseData.response);
          
          // Fetch questionnaire
          if (responseData.response.questionnaire_id) {
            const questionnaireData = await api.questionnaires.getWithQuestions(
              responseData.response.questionnaire_id
            );
            setQuestionnaire(questionnaireData.questionnaire);
          }
        }
      } catch (err) {
        setError('Failed to load response data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this response? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        await api.responses.delete(Number(id));
        router.push('/admin/responses');
      }
    } catch (err) {
      setError('Failed to delete response');
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading response data..." />
      </div>
    );
  }

  if (error || !response || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load response data'} />
        <div className="mt-4">
          <Button 
            variant="primary" 
            onClick={() => router.push('/admin/responses')}
          >
            Back to Responses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/admin/responses/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Response</h1>
          <p className="text-gray-600">
            {questionnaire.title} - {response.patient_email}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <ResponseForm 
              responseId={Number(id)}
              questionnaireId={questionnaire.id}
              initialData={response}
              isEditing={true}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>

            <div className="space-y-4">
              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/responses/${id}/email`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Send Email
              </Button>

              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/scoring/responses/${id}`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
                Update Scoring
              </Button>

              <Button
                className="w-full justify-start bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Response'}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Response Info</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Completed</h4>
                  <p className="text-gray-700">
                    {response.completed_at 
                      ? new Date(response.completed_at).toLocaleString() 
                      : 'Not completed'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Unique Code</h4>
                  <p className="text-gray-700">{response.unique_code}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Score</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      response.risk_level === 'minimal' || response.risk_level === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : response.risk_level === 'mild' || response.risk_level === 'moderate' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {response.score !== undefined ? response.score : 'N/A'} - {response.risk_level ? response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Flagged</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      response.flagged_for_review ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {response.flagged_for_review ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditResponsePage;
