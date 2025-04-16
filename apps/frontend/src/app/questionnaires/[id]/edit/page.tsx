'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';
import api from '@/services/api';

const EditQuestionnairePage = () => {
  const params = useParams();
  const id = Number(params.id);
  
  const [questionnaire, setQuestionnaire] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.questionnaires.getById(id);
        setQuestionnaire(response.questionnaire);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questionnaire');
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
      <QuestionnaireForm initialData={questionnaire} isEditing={true} />
    </DashboardLayout>
  );
};

export default EditQuestionnairePage;
