'use client';

import React, { useState, useEffect } from 'react';
import TestLayout from '@/components/test/TestLayout';
import { Card, Button, Loading, Alert } from '@/components/common';
import Link from 'next/link';
import { FileText, ExternalLink, QrCode } from 'lucide-react';

const TestQuestionnairesPage = () => {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questionnaires on mount
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from the testquestionnaire table
        // For now, we'll use mock data based on the Google Forms
        const mockQuestionnaires = [
          {
            id: '1',
            title: 'Mental Health Assessment',
            description: 'A comprehensive mental health assessment form with questions about mood, anxiety, sleep patterns, and overall wellbeing.',
            source_url: 'https://forms.gle/E8bdVzAEbMaQsHR56',
            question_count: 15,
            estimated_time: '5-10 minutes',
            created_at: '2023-04-15T10:30:00Z'
          },
          {
            id: '2',
            title: 'Anxiety and Depression Screening',
            description: 'Screening tool for anxiety and depression symptoms based on standardized clinical measures.',
            source_url: 'https://forms.gle/NLqA1svRhX5Pez1K6',
            question_count: 12,
            estimated_time: '3-5 minutes',
            created_at: '2023-04-16T14:45:00Z'
          }
        ];
        
        setQuestionnaires(mockQuestionnaires);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load questionnaires');
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TestLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Test Questionnaires</h1>
          <Link href="/test/generate">
            <Button variant="primary">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </Link>
        </div>
        
        {error && <Alert type="error" message={error} className="mb-6" />}
        
        {isLoading ? (
          <Loading size="large" message="Loading questionnaires..." />
        ) : questionnaires.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No questionnaires available.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{questionnaire.title}</h2>
                    <p className="mt-2 text-gray-600">{questionnaire.description}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Questions:</span>{' '}
                        <span className="font-medium">{questionnaire.question_count}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>{' '}
                        <span className="font-medium">{questionnaire.estimated_time}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Added:</span>{' '}
                        <span className="font-medium">{formatDate(questionnaire.created_at)}</span>
                      </div>
                      <div>
                        <a 
                          href={questionnaire.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          View Original Form
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    <Link href={`/test/questionnaires/${questionnaire.id}`}>
                      <Button variant="primary" className="w-full md:w-auto">
                        <FileText className="h-4 w-4 mr-2" />
                        View Questionnaire
                      </Button>
                    </Link>
                    <Link href={`/test/generate?id=${questionnaire.id}`}>
                      <Button variant="outline" className="w-full md:w-auto">
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">About These Questionnaires</h3>
          <p className="text-blue-700">
            These questionnaires are scraped from Google Forms for testing purposes.
            The content is stored in the testquestionnaire and testquestion tables.
            Responses will be stored in the testresponse table.
          </p>
        </div>
      </div>
    </TestLayout>
  );
};

export default TestQuestionnairesPage;
