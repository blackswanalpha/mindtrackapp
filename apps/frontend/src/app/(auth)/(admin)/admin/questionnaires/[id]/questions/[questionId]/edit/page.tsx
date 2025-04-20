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
  ArrowLeft 
} from 'lucide-react';
import QuestionForm from '@/components/questionnaire/QuestionForm';
import api from '@/services/api';

const EditQuestionPage = () => {
  const { id, questionId } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          // Fetch questionnaire
          const questionnaireData = await api.questionnaires.getById(Number(id));
          setQuestionnaire(questionnaireData);
          
          // Fetch question
          const questionData = await api.questions.getById(Number(questionId));
          setQuestion(questionData);
        }
      } catch (err) {
        setError('Failed to load question data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && questionId) {
      fetchData();
    }
  }, [id, questionId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading question data..." />
      </div>
    );
  }

  if (error || !questionnaire || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load question data'} />
        <div className="mt-4">
          <Button 
            variant="primary" 
            onClick={() => router.push(`/questionnaires/${id}/questions`)}
          >
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/questionnaires/${id}/questions`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Question</h1>
          <p className="text-gray-600">
            {questionnaire.title}
          </p>
        </div>
      </div>
      
      <Card>
        <QuestionForm 
          questionnaireId={Number(id)} 
          initialData={question} 
          isEditing={true} 
        />
      </Card>
    </div>
  );
};

export default EditQuestionPage;
