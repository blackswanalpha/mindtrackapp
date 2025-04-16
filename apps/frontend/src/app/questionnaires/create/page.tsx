'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';

const CreateQuestionnairePage = () => {
  return (
    <DashboardLayout>
      <QuestionnaireForm />
    </DashboardLayout>
  );
};

export default CreateQuestionnairePage;
