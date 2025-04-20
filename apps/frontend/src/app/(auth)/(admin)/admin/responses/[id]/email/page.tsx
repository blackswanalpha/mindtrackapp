'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Loading, Alert } from '@/components/common';
import EmailForm from '@/components/email/EmailForm';
import api from '@/services/api';

const SendEmailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [response, setResponse] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponseData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          const responseData = await api.responses.getWithAnswers(Number(id));
          setResponse(responseData.response);
          
          // Get questionnaire details
          if (responseData.response.questionnaire_id) {
            const questionnaireData = await api.questionnaires.getById(responseData.response.questionnaire_id);
            setQuestionnaire(questionnaireData);
          }
        }
      } catch (err) {
        console.error('Failed to load response data:', err);
        setError('Failed to load response data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchResponseData();
    }
  }, [id]);

  const handleEmailSuccess = () => {
    // Redirect back to response detail page
    router.push(`/admin/responses/${id}`);
  };

  const handleCancel = () => {
    router.push(`/admin/responses/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading response data..." />
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load response'} />
        <div className="mt-4">
          <Link href={`/admin/responses/${id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Response
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href={`/admin/responses/${id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Response
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <EmailForm
          responseId={response.id}
          patientEmail={response.patient_email}
          patientName={response.patient_name}
          questionnaireName={questionnaire?.title}
          uniqueCode={response.unique_code}
          score={response.score}
          riskLevel={response.risk_level}
          onSuccess={handleEmailSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default SendEmailPage;
