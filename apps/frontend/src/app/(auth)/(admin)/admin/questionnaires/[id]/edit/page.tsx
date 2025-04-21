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
  Save,
  Trash2,
  Copy,
  Plus,
  FileText
} from 'lucide-react';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';
import api from '@/services/api';

const EditQuestionnairePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          console.log('Fetching questionnaire for editing, ID:', id);
          const response = await api.questionnaires.getById(Number(id));
          console.log('Fetched questionnaire for editing:', response);
          setQuestionnaire(response);
        }
      } catch (err) {
        console.error('Error loading questionnaire for editing:', err);
        setError('Failed to load questionnaire');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  const handleDuplicate = async () => {
    try {
      if (typeof window !== 'undefined' && questionnaire) {
        const duplicated = await api.questionnaires.duplicate(Number(id));
        router.push(`/questionnaires/${duplicated.id}`);
      }
    } catch (err) {
      setError('Failed to duplicate questionnaire');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        await api.questionnaires.delete(Number(id));
        router.push('/questionnaires');
      }
    } catch (err) {
      setError('Failed to delete questionnaire');
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire..." />
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load questionnaire'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push('/questionnaires')}>
            Back to Questionnaires
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Questionnaire</h1>
          <p className="text-gray-600">{questionnaire.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <QuestionnaireForm initialData={questionnaire} isEditing={true} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>

            <div className="space-y-4">
              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/questionnaires/${id}/questions/create`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>

              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/questionnaires/${id}/questions`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Manage Questions
              </Button>

              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleDuplicate}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Questionnaire
              </Button>

              <Button
                className="w-full justify-start bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Questionnaire'}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Questionnaire Info</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="text-gray-700">{new Date(questionnaire.created_at).toLocaleDateString()}</p>
                </div>

                {questionnaire.updated_at && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p className="text-gray-700">{new Date(questionnaire.updated_at).toLocaleDateString()}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      questionnaire.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {questionnaire.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Visibility</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      questionnaire.is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {questionnaire.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionnairePage;
