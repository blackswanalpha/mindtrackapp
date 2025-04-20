'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, Loading, Alert } from '@/components/common';
import QuestionForm from '@/components/questionnaire/QuestionForm';
import api from '@/services/api';

const CreateQuestionPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          const questionnaireData = await api.questionnaires.getById(Number(id));
          setQuestionnaire(questionnaireData);
        }
      } catch (err) {
        setError('Failed to load questionnaire details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire details..." />
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load questionnaire'} />
        <div className="mt-4">
          <Link href={`/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800">
            Back to Questionnaire
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add Question</h1>
          <p className="text-gray-600">
            Adding question to: <span className="font-medium">{questionnaire.title}</span>
          </p>
        </div>
      </div>

      <Card>
        <QuestionForm questionnaireId={Number(id)} />
      </Card>
    </div>
  );
};

export default CreateQuestionPage;
