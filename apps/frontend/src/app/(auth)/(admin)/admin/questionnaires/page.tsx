'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/common';
import EnhancedQuestionnaireList from '@/components/questionnaire/EnhancedQuestionnaireList';
import { motion } from 'framer-motion';

const QuestionnairesPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Questionnaires</h1>
          <p className="text-gray-600">Manage your mental health assessments and surveys</p>
        </div>

        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          onClick={() => router.push('/admin/questionnaires/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Questionnaire
        </Button>
      </motion.div>

      <EnhancedQuestionnaireList />
    </div>
  );
};

export default QuestionnairesPage;
