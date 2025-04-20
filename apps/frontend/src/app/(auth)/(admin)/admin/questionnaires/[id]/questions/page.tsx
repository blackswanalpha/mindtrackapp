'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Card, Button, Loading, Alert } from '@/components/common';
import QuestionList from '@/components/questionnaire/QuestionList';
import api from '@/services/api';

const QuestionsListPage = () => {
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
        // In a real implementation, this would call the API
        // const response = await api.questionnaires.getById(Number(id));
        
        // Mock data for demonstration
        const mockQuestionnaire = {
          id: Number(id),
          title: id === '1' ? 'Depression Assessment (PHQ-9)' : 
                 id === '2' ? 'Anxiety Screening (GAD-7)' : 
                 id === '3' ? 'Well-being Check' : 'Mental Health Questionnaire',
          description: 'A standardized questionnaire for screening and measuring the severity of depression.',
          type: 'assessment',
          category: 'Mental Health',
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setQuestionnaire(mockQuestionnaire);
      } catch (err) {
        setError('Failed to load questionnaire details');
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
          <Link href="/questionnaires" className="text-blue-600 hover:text-blue-800">
            Back to Questionnaires
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
            <p className="text-gray-600">
              {questionnaire.title}
            </p>
          </div>
        </div>
        
        <Button 
          variant="primary"
          onClick={() => router.push(`/questionnaires/${id}/questions/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
      
      <Card>
        <QuestionList questionnaireId={Number(id)} />
      </Card>
    </div>
  );
};

export default QuestionsListPage;
