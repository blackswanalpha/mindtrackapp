'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button
} from '@/components/common';
import {
  ArrowLeft
} from 'lucide-react';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';

const CreateQuestionnairePage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/questionnaires" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Questionnaire</h1>
          <p className="text-gray-600">Create a new questionnaire for your organization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <QuestionnaireForm />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Tips</h2>

            <div className="space-y-4 text-sm text-gray-600">
              <p>
                <strong>Title:</strong> Choose a clear, descriptive title that indicates the purpose of the questionnaire.
              </p>

              <p>
                <strong>Description:</strong> Provide context about what the questionnaire is for and who should complete it.
              </p>

              <p>
                <strong>Instructions:</strong> Give clear directions to respondents about how to complete the questionnaire.
              </p>

              <p>
                <strong>Type:</strong> Select the appropriate type to help categorize your questionnaire.
              </p>

              <p>
                <strong>Settings:</strong> Configure visibility, access, and other options to control how your questionnaire works.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Next Steps</h3>

              <p className="text-sm text-gray-600 mb-4">
                After creating your questionnaire, you'll be able to:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Add questions of various types</li>
                <li>Configure scoring rules</li>
                <li>Generate QR codes for easy access</li>
                <li>Collect and analyze responses</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionnairePage;
