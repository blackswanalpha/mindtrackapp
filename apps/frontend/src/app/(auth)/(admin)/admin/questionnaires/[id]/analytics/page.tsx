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
  Download,
  Share2
} from 'lucide-react';
import QuestionnaireAnalytics from '@/components/questionnaire/QuestionnaireAnalytics';
import api from '@/services/api';

const QuestionnaireAnalyticsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // Fetch questionnaire data
  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          // Get questionnaire details
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

  // Handle export analytics report
  const handleExportReport = () => {
    alert('Export functionality would be implemented here');
    // In a real implementation, this would call the API to generate a PDF or Excel report
  };

  // Handle share analytics
  const handleShareAnalytics = () => {
    alert('Share functionality would be implemented here');
    // In a real implementation, this would generate a shareable link or email the report
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} className="mb-6" />
        <Button
          variant="primary"
          onClick={() => router.push('/admin/questionnaires')}
        >
          Back to Questionnaires
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Link href={`/admin/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-600">
              {questionnaire?.title || 'Questionnaire Analytics'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="light"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant="light"
            onClick={handleShareAnalytics}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analytics
          </Button>
        </div>
      </div>

      {/* Analytics Content */}
      <QuestionnaireAnalytics
        questionnaireId={Number(id)}
        timeRange={timeRange}
      />
    </div>
  );
};

export default QuestionnaireAnalyticsPage;
