/**
 * Script to generate mock GAD-7 responses
 *
 * This script generates realistic mock responses for the GAD-7 anxiety assessment.
 * It can be used to populate the system with test data.
 */

import { v4 as uuidv4 } from 'uuid';
import mockStorage from '../services/mockStorage';
import scoringService from '../services/scoringService';

// GAD-7 questionnaire ID (assuming it's 2 based on the code)
const GAD7_QUESTIONNAIRE_ID = 2;

// GAD-7 scoring interpretation
// 0-4: Minimal anxiety
// 5-9: Mild anxiety
// 10-14: Moderate anxiety
// 15-21: Severe anxiety

// Patient profiles for more realistic data
const patientProfiles = [
  { email: 'sarah.johnson@example.com', name: 'Sarah Johnson', age: 28, gender: 'Female' },
  { email: 'michael.smith@example.com', name: 'Michael Smith', age: 42, gender: 'Male' },
  { email: 'emma.davis@example.com', name: 'Emma Davis', age: 35, gender: 'Female' },
  { email: 'james.wilson@example.com', name: 'James Wilson', age: 31, gender: 'Male' },
  { email: 'olivia.brown@example.com', name: 'Olivia Brown', age: 24, gender: 'Female' },
  { email: 'william.jones@example.com', name: 'William Jones', age: 56, gender: 'Male' },
  { email: 'sophia.miller@example.com', name: 'Sophia Miller', age: 19, gender: 'Female' },
  { email: 'benjamin.taylor@example.com', name: 'Benjamin Taylor', age: 47, gender: 'Male' },
  { email: 'ava.anderson@example.com', name: 'Ava Anderson', age: 33, gender: 'Female' },
  { email: 'ethan.thomas@example.com', name: 'Ethan Thomas', age: 29, gender: 'Male' },
  { email: 'anonymous1@example.com', name: undefined, age: undefined, gender: undefined },
  { email: 'anonymous2@example.com', name: undefined, age: undefined, gender: undefined },
];

// Distribution of anxiety levels for more realistic data
// This will generate approximately:
// 30% minimal anxiety (0-4)
// 30% mild anxiety (5-9)
// 25% moderate anxiety (10-14)
// 15% severe anxiety (15-21)
const anxietyDistribution = [
  { min: 0, max: 4, weight: 30 },   // Minimal
  { min: 5, max: 9, weight: 30 },   // Mild
  { min: 10, max: 14, weight: 25 }, // Moderate
  { min: 15, max: 21, weight: 15 }  // Severe
];

/**
 * Generate a weighted random anxiety level
 */
function getWeightedAnxietyLevel() {
  const totalWeight = anxietyDistribution.reduce((sum, level) => sum + level.weight, 0);
  let random = Math.random() * totalWeight;

  for (const level of anxietyDistribution) {
    if (random < level.weight) {
      return {
        min: level.min,
        max: level.max
      };
    }
    random -= level.weight;
  }

  // Default to minimal if something goes wrong
  return { min: 0, max: 4 };
}

/**
 * Generate a random date within the last 3 months
 */
function getRandomRecentDate() {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  return new Date(
    threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  ).toISOString();
}

/**
 * Generate answers for GAD-7 that add up to a target score
 */
function generateGAD7Answers(questions: any[], targetScore: number) {
  const answers = [];
  let remainingScore = targetScore;

  // Process first 6 questions
  for (let i = 0; i < 6; i++) {
    const question = questions[i];
    const maxPossibleValue = 3; // GAD-7 options are 0-3

    // Calculate maximum possible value for this question
    const maxForThisQuestion = Math.min(maxPossibleValue, remainingScore);

    // Generate a random value between 0 and the maximum possible
    const value = Math.floor(Math.random() * (maxForThisQuestion + 1));

    answers.push({
      id: answers.length + 1,
      question_id: question.id,
      value: value,
      score: value
    });

    remainingScore -= value;
  }

  // For the last question, use the remaining score
  const lastQuestion = questions[6];
  const lastValue = Math.min(3, Math.max(0, remainingScore));

  answers.push({
    id: answers.length + 1,
    question_id: lastQuestion.id,
    value: lastValue,
    score: lastValue
  });

  return answers;
}

/**
 * Generate a single GAD-7 response
 */
function generateGAD7Response(questions: any[], responseId: number) {
  // Get a random patient profile
  const profile = patientProfiles[Math.floor(Math.random() * patientProfiles.length)];

  // Get a weighted anxiety level
  const anxietyLevel = getWeightedAnxietyLevel();

  // Generate a target score within the anxiety level range
  const targetScore = Math.floor(Math.random() * (anxietyLevel.max - anxietyLevel.min + 1)) + anxietyLevel.min;

  // Generate answers that add up to the target score
  const answers = generateGAD7Answers(questions, targetScore);

  // Determine risk level based on score
  let riskLevel = 'low';
  if (targetScore >= 15) {
    riskLevel = 'high';
  } else if (targetScore >= 10) {
    riskLevel = 'moderate';
  } else if (targetScore >= 5) {
    riskLevel = 'mild';
  }

  // Generate completion time (2-10 minutes in seconds)
  const completionTime = (Math.floor(Math.random() * 8) + 2) * 60;

  // Generate dates
  const completedAt = getRandomRecentDate();
  const createdAt = new Date(new Date(completedAt).getTime() - completionTime * 1000).toISOString();

  // Create the response
  return {
    id: responseId,
    questionnaire_id: GAD7_QUESTIONNAIRE_ID,
    patient_email: profile.email,
    patient_name: profile.name,
    patient_age: profile.age,
    patient_gender: profile.gender,
    score: targetScore,
    risk_level: riskLevel,
    flagged_for_review: targetScore >= 15, // Flag high risk responses
    completed_at: completedAt,
    created_at: createdAt,
    completion_time: completionTime,
    unique_code: `GAD7-${uuidv4().substring(0, 8)}`,
    answers: answers
  };
}

/**
 * Generate multiple GAD-7 responses
 */
export function generateGAD7Responses(count: number = 20) {
  // Get the GAD-7 questionnaire and questions
  const questionnaire = mockStorage.questionnaires.getById(GAD7_QUESTIONNAIRE_ID);
  if (!questionnaire) {
    console.error('GAD-7 questionnaire not found');
    return [];
  }

  const questions = mockStorage.questions.getByQuestionnaire(GAD7_QUESTIONNAIRE_ID);
  if (!questions || questions.length === 0) {
    console.error('GAD-7 questions not found');
    return [];
  }

  // Get the current highest response ID
  const responses = mockStorage.responses.getAll();
  const startId = responses.length > 0 ? Math.max(...responses.map(r => r.id)) + 1 : 1;

  // Generate responses
  const newResponses = [];
  for (let i = 0; i < count; i++) {
    const response = generateGAD7Response(questions, startId + i);
    newResponses.push(response);

    // Add to mock storage
    const answersWithResponseId = response.answers.map(answer => ({
      ...answer,
      response_id: startId + i
    }));

    mockStorage.responses.create({
      ...response,
      answers: answersWithResponseId
    });
  }

  console.log(`Generated ${count} GAD-7 responses`);
  return newResponses;
}

// Export the function for use in other files
export default generateGAD7Responses;
