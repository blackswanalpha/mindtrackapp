/**
 * Script to create the GAD-7 questionnaire with proper question types
 *
 * This script creates a complete GAD-7 (Generalized Anxiety Disorder-7) questionnaire
 * with all questions and proper question types.
 */

import api from '@/services/api';
import mockStorage from '@/services/mockStorage';

// GAD-7 questionnaire data
const gad7QuestionnaireData = {
  title: 'GAD-7 Anxiety Assessment',
  description: 'The Generalized Anxiety Disorder 7-item (GAD-7) scale is a brief self-report questionnaire used to assess and measure the severity of generalized anxiety disorder.',
  instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  type: 'assessment',
  category: 'anxiety',
  estimated_time_minutes: 5,
  is_active: true,
  is_qr_enabled: true,
  is_public: true,
  allow_anonymous: true,
  created_by_id: 1, // Default admin user
  organization_id: 1 // Default organization
};

// GAD-7 questions with proper types
const gad7Questions = [
  {
    text: 'Feeling nervous, anxious, or on edge',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 1,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'Not being able to stop or control worrying',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 2,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'Worrying too much about different things',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 3,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'Trouble relaxing',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 4,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'Being so restless that it\'s hard to sit still',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 5,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'Becoming easily annoyed or irritable',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 6,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'Feeling afraid as if something awful might happen',
    description: 'Consider how often you have felt this way over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 7,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    scoring_weight: 1
  },
  {
    text: 'If you checked off any problems, how difficult have these made it for you to do your work, take care of things at home, or get along with other people?',
    description: 'This question helps assess the impact of your symptoms on daily functioning',
    type: 'single_choice',
    required: false,
    order_num: 8,
    options: [
      { value: 0, label: 'Not difficult at all' },
      { value: 1, label: 'Somewhat difficult' },
      { value: 2, label: 'Very difficult' },
      { value: 3, label: 'Extremely difficult' }
    ],
    scoring_weight: 0 // This question doesn't contribute to the GAD-7 score
  }
];

/**
 * Create GAD-7 questionnaire in the system
 */
export async function createGAD7Questionnaire() {
  try {
    console.log('Creating GAD-7 questionnaire...');

    // Check if we're using mock storage
    const useMockStorage = process.env.NODE_ENV === 'development';

    let questionnaireId: number;

    if (useMockStorage) {
      // Create questionnaire in mock storage
      const questionnaire = mockStorage.questionnaires.create({
        ...gad7QuestionnaireData,
        created_at: new Date().toISOString()
      });

      questionnaireId = questionnaire.id;

      // Create questions in mock storage
      for (const questionData of gad7Questions) {
        mockStorage.questions.create({
          ...questionData,
          questionnaire_id: questionnaireId
        });
      }
    } else {
      // Create questionnaire using API
      const questionnaire = await api.questionnaires.create(gad7QuestionnaireData);
      questionnaireId = questionnaire.id;

      // Create questions using API
      for (const questionData of gad7Questions) {
        await api.questions.create(questionnaireId, questionData);
      }
    }

    console.log(`GAD-7 questionnaire created successfully with ID: ${questionnaireId}`);
    return questionnaireId;
  } catch (error) {
    console.error('Error creating GAD-7 questionnaire:', error);
    throw error;
  }
}

// Export the function for use in other files
export default createGAD7Questionnaire;
