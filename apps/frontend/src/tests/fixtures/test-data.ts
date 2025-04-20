/**
 * Test Data Fixtures
 * 
 * This file contains test data for API tests.
 */

// Test User Data
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'Password123!',
    name: 'Admin User',
    role: 'admin'
  },
  regular: {
    email: 'user@test.com',
    password: 'Password123!',
    name: 'Regular User',
    role: 'user'
  },
  new: {
    email: 'newuser@test.com',
    password: 'Password123!',
    name: 'New Test User',
    role: 'user'
  }
};

// Test Organization Data
export const testOrganizations = {
  main: {
    name: 'Test Organization',
    description: 'Organization for API testing',
    type: 'healthcare',
    address: '123 Test Street',
    phone: '555-123-4567',
    website: 'https://test-org.example.com'
  },
  update: {
    name: 'Updated Test Organization',
    description: 'Updated organization for API testing',
    type: 'healthcare',
    address: '456 Test Avenue',
    phone: '555-987-6543',
    website: 'https://updated-test-org.example.com'
  }
};

// Test Questionnaire Data
export const testQuestionnaires = {
  depression: {
    title: 'Depression Assessment Test',
    description: 'A test questionnaire for depression screening',
    instructions: 'Please answer all questions honestly based on how you have been feeling over the past two weeks.',
    type: 'assessment',
    category: 'Depression',
    estimated_time: 5,
    is_active: true,
    is_public: true,
    allow_anonymous: true,
    requires_auth: false
  },
  anxiety: {
    title: 'Anxiety Screening Test',
    description: 'A test questionnaire for anxiety screening',
    instructions: 'Please answer all questions based on your experiences over the past month.',
    type: 'screening',
    category: 'Anxiety',
    estimated_time: 7,
    is_active: true,
    is_public: true,
    allow_anonymous: true,
    requires_auth: false
  },
  update: {
    title: 'Updated Test Questionnaire',
    description: 'This questionnaire has been updated for testing',
    instructions: 'Updated instructions for testing purposes',
    type: 'assessment',
    category: 'General',
    estimated_time: 10,
    is_active: true,
    is_public: false,
    allow_anonymous: false,
    requires_auth: true
  }
};

// Test Question Data
export const testQuestions = {
  singleChoice: {
    text: 'How often have you felt down, depressed, or hopeless?',
    description: 'Consider your feelings over the past two weeks',
    type: 'single_choice',
    required: true,
    order_num: 1,
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  multipleChoice: {
    text: 'Which of the following symptoms have you experienced?',
    description: 'Select all that apply',
    type: 'multiple_choice',
    required: true,
    order_num: 2,
    options: [
      { value: 1, label: 'Difficulty sleeping' },
      { value: 2, label: 'Loss of appetite' },
      { value: 3, label: 'Fatigue' },
      { value: 4, label: 'Difficulty concentrating' }
    ]
  },
  text: {
    text: 'Please describe any other symptoms or concerns you have been experiencing:',
    description: 'Optional additional information',
    type: 'text',
    required: false,
    order_num: 3
  },
  update: {
    text: 'Updated test question',
    description: 'This question has been updated for testing',
    type: 'single_choice',
    required: true,
    order_num: 4,
    options: [
      { value: 0, label: 'Option A' },
      { value: 1, label: 'Option B' },
      { value: 2, label: 'Option C' }
    ]
  }
};

// Test Response Data
export const testResponses = {
  complete: {
    patient_email: 'patient@test.com',
    patient_name: 'Test Patient',
    patient_age: 35,
    patient_gender: 'female',
    completion_time: 180, // in seconds
    answers: [
      {
        question_id: 1, // This will be replaced with actual question ID in tests
        value: 2
      },
      {
        question_id: 2, // This will be replaced with actual question ID in tests
        value: [1, 3]
      },
      {
        question_id: 3, // This will be replaced with actual question ID in tests
        value: 'I have been experiencing headaches and difficulty sleeping.'
      }
    ]
  },
  partial: {
    patient_email: 'another-patient@test.com',
    completion_time: 120, // in seconds
    answers: [
      {
        question_id: 1, // This will be replaced with actual question ID in tests
        value: 1
      },
      {
        question_id: 2, // This will be replaced with actual question ID in tests
        value: [2]
      }
    ]
  }
};

// Test Notification Template Data
export const testNotificationTemplates = {
  welcome: {
    name: 'Test Welcome Email',
    subject: 'Welcome to our platform!',
    body: 'Dear {{name}},\n\nWelcome to our mental health assessment platform. We\'re glad to have you on board.\n\nBest regards,\nThe Team',
    type: 'welcome',
    is_active: true
  },
  response: {
    name: 'Test Response Notification',
    subject: 'New questionnaire response received',
    body: 'Dear {{name}},\n\nA new response has been submitted for the questionnaire "{{questionnaire_title}}".\n\nPatient: {{patient_email}}\nScore: {{score}}\nRisk Level: {{risk_level}}\n\nPlease log in to view the full response.\n\nBest regards,\nThe Team',
    type: 'response',
    is_active: true
  },
  update: {
    name: 'Updated Test Template',
    subject: 'Updated Subject Line',
    body: 'This is an updated template body for testing purposes.',
    type: 'custom',
    is_active: false
  }
};

export default {
  users: testUsers,
  organizations: testOrganizations,
  questionnaires: testQuestionnaires,
  questions: testQuestions,
  responses: testResponses,
  notificationTemplates: testNotificationTemplates
};
