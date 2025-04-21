/**
 * Real data test script
 *
 * This script tests the API with real data.
 * It creates a questionnaire, adds questions, creates a response, and tests QR code generation.
 */

require('dotenv').config();
const axios = require('axios');

// API client
const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Test data
const testQuestionnaire = {
  title: 'Test Questionnaire',
  description: 'This is a test questionnaire created by the real data test script',
  type: 'standard',
  is_active: true,
  is_qr_enabled: true,
  allow_anonymous: true
};

const testQuestions = [
  {
    text: 'How are you feeling today?',
    description: 'Please select the option that best describes your mood',
    type: 'single_choice',
    required: true,
    options: [
      { label: 'Very bad', value: '1', score: 4 },
      { label: 'Bad', value: '2', score: 3 },
      { label: 'Neutral', value: '3', score: 2 },
      { label: 'Good', value: '4', score: 1 },
      { label: 'Very good', value: '5', score: 0 }
    ]
  },
  {
    text: 'Have you had trouble sleeping?',
    description: 'Please select the option that best describes your sleep',
    type: 'single_choice',
    required: true,
    options: [
      { label: 'Not at all', value: '1', score: 0 },
      { label: 'Several days', value: '2', score: 1 },
      { label: 'More than half the days', value: '3', score: 2 },
      { label: 'Nearly every day', value: '4', score: 3 }
    ]
  },
  {
    text: 'Do you have any additional comments?',
    description: 'Please provide any additional information',
    type: 'text',
    required: false
  }
];

// Test response
const testResponse = {
  patient_email: 'test@example.com',
  patient_name: 'Test User',
  patient_age: 30,
  patient_gender: 'other',
  answers: []
};

// Run tests
async function runTests() {
  try {
    console.log('Starting real data tests...');

    // Test API health
    console.log('\n1. Testing API health...');
    const healthResponse = await apiClient.get('/health');
    console.log('Health check response:', healthResponse.data);

    // Create questionnaire
    console.log('\n2. Creating test questionnaire...');
    const questionnaireResponse = await apiClient.post('/questionnaires', testQuestionnaire);
    const questionnaire = questionnaireResponse.data.questionnaire;
    console.log('Created questionnaire:', questionnaire);

    // Create questions
    console.log('\n3. Creating test questions...');
    const questions = [];
    for (const questionData of testQuestions) {
      const questionResponse = await apiClient.post(`/questionnaires/${questionnaire.id}/questions`, questionData);
      questions.push(questionResponse.data.question);
      console.log('Created question:', questionResponse.data.question);
    }

    // Generate QR code
    console.log('\n4. Generating QR code...');
    const qrCodeResponse = await apiClient.get(`/qr-codes/questionnaires/${questionnaire.id}`);
    console.log('Generated QR code URL:', qrCodeResponse.data.url);

    // Generate QR code with different styles
    console.log('\n5. Generating QR code with different styles...');
    const styles = ['modern', 'vibrant', 'dark', 'nature'];
    for (const style of styles) {
      const styledQrCodeResponse = await apiClient.get(`/qr-codes/questionnaires/${questionnaire.id}?style=${style}`);
      console.log(`Generated ${style} style QR code`);
    }

    // Generate random style QR code
    console.log('\n6. Generating random style QR code...');
    const randomStyleQrCodeResponse = await apiClient.post('/qr-codes/random', {
      url: `http://localhost:3000/questionnaires/respond/${questionnaire.id}`
    });
    console.log('Generated random style QR code with style:', randomStyleQrCodeResponse.data.style);

    // Create response
    console.log('\n7. Creating test response...');
    // Add answers to the response
    for (const question of questions) {
      if (question.type === 'single_choice') {
        // Select a random option
        const options = typeof question.options === 'string' ?
          JSON.parse(question.options) : question.options;
        const randomOption = options[Math.floor(Math.random() * options.length)];
        testResponse.answers.push({
          question_id: question.id,
          value: randomOption.value
        });
      } else if (question.type === 'text') {
        testResponse.answers.push({
          question_id: question.id,
          value: 'This is a test response'
        });
      }
    }

    const responseData = {
      ...testResponse,
      questionnaire_id: questionnaire.id,
      start_time: new Date(Date.now() - 60000).toISOString() // 1 minute ago
    };

    const responseResponse = await apiClient.post('/responses', responseData);
    const response = responseResponse.data.response;
    console.log('Created response:', response);
    console.log('Response score:', responseResponse.data.score);
    console.log('Response risk level:', responseResponse.data.risk_level);

    // Get response with answers
    console.log('\n8. Getting response with answers...');
    const responseWithAnswersResponse = await apiClient.get(`/responses/${response.id}/answers`);
    console.log('Response with answers:', responseWithAnswersResponse.data.response);

    // Flag response for review
    console.log('\n9. Flagging response for review...');
    const flagResponse = await apiClient.put(`/responses/${response.id}/flag`, { flagged: true });
    console.log('Flagged response:', flagResponse.data.response);

    // Clean up
    console.log('\n10. Cleaning up...');
    await apiClient.delete(`/responses/${response.id}`);
    console.log('Deleted response');

    await apiClient.delete(`/questionnaires/${questionnaire.id}`);
    console.log('Deleted questionnaire');

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the tests
runTests();
