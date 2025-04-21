/**
 * Script to create GAD-7 and PHQ-9 questionnaires directly using the API
 * 
 * This script creates the GAD-7 and PHQ-9 questionnaires and their questions
 * by making direct API calls to the backend.
 */

require('dotenv').config();
const axios = require('axios');

// API client
const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock user for authentication (since auth is disabled)
const mockUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

/**
 * Create GAD-7 questionnaire
 */
async function createGAD7() {
  try {
    console.log('Creating GAD-7 questionnaire...');
    
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
      created_by_id: mockUser.id,
      organization_id: 1 // Default organization
    };
    
    const response = await apiClient.post('/questionnaires', questionnaireData);
    const questionnaire = response.data.questionnaire;
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
      const questionResponse = await apiClient.post(`/questionnaires/${questionnaire.id}/questions`, question);
      console.log(`Created question: ${question.text} with ID: ${questionResponse.data.id}`);
    }
    
    console.log('GAD-7 questionnaire and questions created successfully!');
    return questionnaire.id;
  } catch (error) {
    console.error('Error creating GAD-7 questionnaire:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Create PHQ-9 questionnaire
 */
async function createPHQ9() {
  try {
    console.log('Creating PHQ-9 questionnaire...');
    
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
      created_by_id: mockUser.id,
      organization_id: 1 // Default organization
    };
    
    const response = await apiClient.post('/questionnaires', questionnaireData);
    const questionnaire = response.data.questionnaire;
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
      const questionResponse = await apiClient.post(`/questionnaires/${questionnaire.id}/questions`, question);
      console.log(`Created question: ${question.text} with ID: ${questionResponse.data.id}`);
    }
    
    console.log('PHQ-9 questionnaire and questions created successfully!');
    return questionnaire.id;
  } catch (error) {
    console.error('Error creating PHQ-9 questionnaire:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Main function to create both questionnaires
 */
async function main() {
  try {
    const gad7Id = await createGAD7();
    const phq9Id = await createPHQ9();
    
    console.log('Successfully created both questionnaires:');
    console.log(`- GAD-7 ID: ${gad7Id}`);
    console.log(`- PHQ-9 ID: ${phq9Id}`);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the main function
main();
