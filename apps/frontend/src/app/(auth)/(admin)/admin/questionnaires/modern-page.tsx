'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FileQuestion, QrCode, BarChart4, Filter, Download } from 'lucide-react';
import { ModernButton, ModernCard } from '@/components/common';
import ModernQuestionnaireList from '@/components/questionnaire/ModernQuestionnaireList';

const ModernQuestionnairePage = () => {
  const router = useRouter();

  return (
    <div className="container-fluid mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Questionnaires</h1>
          <p className="text-neutral-600 font-body">Create, manage, and analyze your questionnaires</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ModernButton
            variant="outline"
            icon={<Filter className="h-4 w-4" />}
            onClick={() => router.push('/admin/questionnaires/templates')}
          >
            Templates
          </ModernButton>
          
          <ModernButton
            variant="outline"
            icon={<QrCode className="h-4 w-4" />}
            onClick={() => router.push('/admin/questionnaires/qr-codes')}
          >
            QR Codes
          </ModernButton>
          
          <ModernButton
            variant="outline"
            icon={<BarChart4 className="h-4 w-4" />}
            onClick={() => router.push('/admin/responses/analytics')}
          >
            Analytics
          </ModernButton>
          
          <ModernButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => router.push('/admin/questionnaires/create')}
          >
            Create Questionnaire
          </ModernButton>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ModernCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Questionnaires</p>
              <h3 className="text-3xl font-bold mt-2">24</h3>
              <div className="flex items-center mt-2 text-success-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>12% from last month</span>
              </div>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileQuestion className="h-6 w-6 text-primary-700" />
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Active Questionnaires</p>
              <h3 className="text-3xl font-bold mt-2">18</h3>
              <div className="flex items-center mt-2 text-success-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>8% from last month</span>
              </div>
            </div>
            <div className="bg-success-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Responses</p>
              <h3 className="text-3xl font-bold mt-2">156</h3>
              <div className="flex items-center mt-2 text-success-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>24% from last month</span>
              </div>
            </div>
            <div className="bg-secondary-100 p-3 rounded-lg">
              <BarChart4 className="h-6 w-6 text-secondary-700" />
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Completion Rate</p>
              <h3 className="text-3xl font-bold mt-2">87%</h3>
              <div className="flex items-center mt-2 text-error-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                <span>3% from last month</span>
              </div>
            </div>
            <div className="bg-accent-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </ModernCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ModernQuestionnaireList />
      </motion.div>
    </div>
  );
};

export default ModernQuestionnairePage;
