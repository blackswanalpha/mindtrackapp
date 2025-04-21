'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Import } from 'lucide-react';
import { Button } from '@/components/common';
import EnhancedQuestionnaireList from '@/components/questionnaire/EnhancedQuestionnaireList';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

        <div className="flex space-x-3">
          <Link href="/admin/questionnaires/import-templates">
            <Button
              className="bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Import className="h-4 w-4 mr-2" />
              Import Templates
            </Button>
          </Link>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            onClick={() => router.push('/admin/questionnaires/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Questionnaire
          </Button>
        </div>
      </motion.div>

      <EnhancedQuestionnaireList />
    </div>
  );
};

export default QuestionnairesPage;
