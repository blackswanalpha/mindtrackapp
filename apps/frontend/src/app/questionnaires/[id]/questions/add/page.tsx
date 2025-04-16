'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import QuestionForm from '@/components/questionnaire/QuestionForm';

const AddQuestionPage = () => {
  const params = useParams();
  const questionnaireId = Number(params.id);

  return (
    <DashboardLayout>
      <QuestionForm questionnaireId={questionnaireId} />
    </DashboardLayout>
  );
};

export default AddQuestionPage;
