'use client';

import React from 'react';
import QuestionnaireList from '@/components/questionnaires/QuestionnaireList';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { PlusCircle, Filter } from 'lucide-react';

const QuestionnairesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Questionnaires</h1>
            <p className="text-gray-600 mt-1">
              Manage and view all mental health assessments
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New
            </button>
          </div>
        </div>

        {/* Questionnaire List */}
        <QuestionnaireList />
      </div>
    </DashboardLayout>
  );
};

export default QuestionnairesPage;
