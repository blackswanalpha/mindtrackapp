'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Alert,
  Loading
} from '@/components/common';
import {
  FileText,
  Check,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

const ImportTemplatesPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdQuestionnaires, setCreatedQuestionnaires] = useState<any[]>([]);

  // Import GAD-7 questionnaire
  const importGAD7 = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create questionnaire
      const questionnaireData = {
        title: 'GAD-7',
        description: 'The Generalized Anxiety Disorder 7-item (GAD-7) scale is a brief self-report questionnaire used to assess and measure the severity of generalized anxiety disorder.',
        instructions: 'Over the last two weeks, how often have you been bothered by the following problems?',
        type: 'assessment',
        category: 'anxiety',
        estimated_time_minutes: 5,
        is_active: true,
        is_qr_enabled: true,
        is_public: true,
        allow_anonymous: true,
        organization_id: 1 // Default organization
      };
      
      const questionnaire = await api.questionnaires.create(questionnaireData);
      console.log(`GAD-7 questionnaire created with ID: ${questionnaire.id}`);
      
      // Create questions
      const questions = [
        {
          text: 'Feeling nervous, anxious or on edge',
          type: 'single_choice',
          required: true,
          order_num: 1,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Not being able to stop or control worrying',
          type: 'single_choice',
          required: true,
          order_num: 2,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Worrying too much about different things',
          type: 'single_choice',
          required: true,
          order_num: 3,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Trouble relaxing',
          type: 'single_choice',
          required: true,
          order_num: 4,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Being so restless that it is hard to sit still',
          type: 'single_choice',
          required: true,
          order_num: 5,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Becoming easily annoyed or irritable',
          type: 'single_choice',
          required: true,
          order_num: 6,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Feeling afraid as if something awful might happen',
          type: 'single_choice',
          required: true,
          order_num: 7,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        }
      ];
      
      for (const question of questions) {
        await api.questions.create(questionnaire.id, question);
      }
      
      setCreatedQuestionnaires(prev => [...prev, questionnaire]);
      setSuccess('GAD-7 questionnaire imported successfully!');
    } catch (error) {
      console.error('Error importing GAD-7:', error);
      setError('Failed to import GAD-7 questionnaire. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Import PHQ-9 questionnaire
  const importPHQ9 = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create questionnaire
      const questionnaireData = {
        title: 'PHQ-9',
        description: 'The Patient Health Questionnaire-9 (PHQ-9) is a self-report questionnaire used to screen, diagnose, monitor, and measure the severity of depression.',
        instructions: 'INSTRUCTIONS: How often have you been bothered by each of the following symptoms during the past two weeks? For each symptom put an "X" in the box beneath the answer that best describes how you have been feeling.',
        type: 'assessment',
        category: 'depression',
        estimated_time_minutes: 5,
        is_active: true,
        is_qr_enabled: true,
        is_public: true,
        allow_anonymous: true,
        organization_id: 1 // Default organization
      };
      
      const questionnaire = await api.questionnaires.create(questionnaireData);
      console.log(`PHQ-9 questionnaire created with ID: ${questionnaire.id}`);
      
      // Create questions
      const questions = [
        {
          text: 'Feeling down, depressed, irritable, or hopeless?',
          type: 'single_choice',
          required: true,
          order_num: 1,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Little interest or pleasure in doing things?',
          type: 'single_choice',
          required: true,
          order_num: 2,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Trouble falling asleep, staying asleep, or sleeping too much?',
          type: 'single_choice',
          required: true,
          order_num: 3,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Poor appetite, weight loss, or overeating?',
          type: 'single_choice',
          required: true,
          order_num: 4,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Feeling tired, or having little energy?',
          type: 'single_choice',
          required: true,
          order_num: 5,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Feeling bad about yourself - or feeling that you are a failure, or that you have let yourself or your family down?',
          type: 'single_choice',
          required: true,
          order_num: 6,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Trouble concentrating on things like school work, reading or watching TV?',
          type: 'single_choice',
          required: true,
          order_num: 7,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you were moving around a lot more than usual?',
          type: 'single_choice',
          required: true,
          order_num: 8,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'Thoughts that you would be better off dead, or hurting yourself in some way?',
          type: 'single_choice',
          required: true,
          order_num: 9,
          options: JSON.stringify(['Not at all', 'Several days', 'More than half the days', 'Nearly every day']),
          scoring_weight: 1
        },
        {
          text: 'In the PAST YEAR have you felt depressed or sad most days, even if you felt okay sometimes?',
          type: 'single_choice',
          required: true,
          order_num: 10,
          options: JSON.stringify(['Yes', 'No']),
          scoring_weight: 0
        },
        {
          text: 'If you are experiencing any of the problems on this form, how difficult have these problems made it for you to do your work, take care of things at home or get along with other people?',
          type: 'single_choice',
          required: true,
          order_num: 11,
          options: JSON.stringify(['Not difficult at all', 'Somewhat difficult', 'Very difficult', 'Extremely difficult']),
          scoring_weight: 0
        },
        {
          text: 'Has there been a time in the PAST MONTH when you have had serious thoughts about ending your life?',
          type: 'single_choice',
          required: true,
          order_num: 12,
          options: JSON.stringify(['Yes', 'No']),
          scoring_weight: 0
        },
        {
          text: 'Have you EVER, in your WHOLE LIFE, tried to kill yourself or made a suicide attempt?',
          type: 'single_choice',
          required: true,
          order_num: 13,
          options: JSON.stringify(['Yes', 'No', 'Other']),
          scoring_weight: 0
        }
      ];
      
      for (const question of questions) {
        await api.questions.create(questionnaire.id, question);
      }
      
      setCreatedQuestionnaires(prev => [...prev, questionnaire]);
      setSuccess('PHQ-9 questionnaire imported successfully!');
    } catch (error) {
      console.error('Error importing PHQ-9:', error);
      setError('Failed to import PHQ-9 questionnaire. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Import both questionnaires
  const importBoth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await importGAD7();
      await importPHQ9();
      
      setSuccess('Both questionnaires imported successfully!');
    } catch (error) {
      console.error('Error importing questionnaires:', error);
      setError('Failed to import questionnaires. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/questionnaires" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </Link>
        <h1 className="text-2xl font-bold">Import Template Questionnaires</h1>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error}
          className="mb-6"
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message={success}
          className="mb-6"
        />
      )}
      
      {isLoading ? (
        <Loading size="large" message="Importing questionnaires..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">GAD-7</h2>
                <p className="text-gray-600 mb-4">
                  The Generalized Anxiety Disorder 7-item (GAD-7) scale is a brief self-report questionnaire used to assess and measure the severity of generalized anxiety disorder.
                </p>
                <Button 
                  variant="primary" 
                  onClick={importGAD7}
                  disabled={isLoading}
                >
                  Import GAD-7
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">PHQ-9</h2>
                <p className="text-gray-600 mb-4">
                  The Patient Health Questionnaire-9 (PHQ-9) is a self-report questionnaire used to screen, diagnose, monitor, and measure the severity of depression.
                </p>
                <Button 
                  variant="primary" 
                  onClick={importPHQ9}
                  disabled={isLoading}
                >
                  Import PHQ-9
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="md:col-span-2">
            <Card className="p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Import Both Questionnaires</h2>
                  <p className="text-gray-600 mb-4">
                    Import both the GAD-7 and PHQ-9 questionnaires at once.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={importBoth}
                    disabled={isLoading}
                  >
                    Import Both
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {createdQuestionnaires.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Imported Questionnaires</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {createdQuestionnaires.map((questionnaire) => (
                  <tr key={questionnaire.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{questionnaire.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{questionnaire.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{questionnaire.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/admin/questionnaires/${questionnaire.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/admin/questionnaires/${questionnaire.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportTemplatesPage;
