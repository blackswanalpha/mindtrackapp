/**
 * Script to generate GAD-7 responses and store them directly in the database
 *
 * This script creates realistic GAD-7 responses with proper scoring and stores them
 * in the database for retrieval and analysis.
 */

import api from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

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
  );
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
    question_id: lastQuestion.id,
    value: lastValue,
    score: lastValue
  });

  // Add the impact question (doesn't contribute to score)
  if (questions.length > 7) {
    const impactQuestion = questions[7];
    const impactValue = Math.floor(Math.random() * 4); // 0-3

    answers.push({
      question_id: impactQuestion.id,
      value: impactValue,
      score: 0 // Doesn't contribute to score
    });
  }

  return answers;
}

/**
 * Determine risk level based on score
 */
function getRiskLevel(score: number) {
  if (score >= 15) {
    return 'high';
  } else if (score >= 10) {
    return 'moderate';
  } else if (score >= 5) {
    return 'mild';
  } else {
    return 'low';
  }
}

/**
 * Generate and store GAD-7 responses in the database
 */
export async function generateGAD7DatabaseResponses(questionnaireId: number, count: number = 20) {
  try {
    console.log(`Generating ${count} GAD-7 responses for questionnaire ID ${questionnaireId}...`);

    // Fetch the questionnaire and its questions
    const questionnaire = await api.questionnaires.getWithQuestions(questionnaireId);
    const questions = questionnaire.questions.sort((a: any, b: any) => a.order_num - b.order_num);

    if (!questions || questions.length === 0) {
      throw new Error('No questions found for this questionnaire');
    }

    // Generate and store responses
    const generatedResponses = [];

    for (let i = 0; i < count; i++) {
      // Get a random patient profile
      const profile = patientProfiles[Math.floor(Math.random() * patientProfiles.length)];

      // Get a weighted anxiety level
      const anxietyLevel = getWeightedAnxietyLevel();

      // Generate a target score within the anxiety level range
      const targetScore = Math.floor(Math.random() * (anxietyLevel.max - anxietyLevel.min + 1)) + anxietyLevel.min;

      // Generate answers that add up to the target score
      const answers = generateGAD7Answers(questions, targetScore);

      // Determine risk level based on score
      const riskLevel = getRiskLevel(targetScore);

      // Generate completion time (2-10 minutes in seconds)
      const completionTime = (Math.floor(Math.random() * 8) + 2) * 60;

      // Generate dates
      const completedAt = getRandomRecentDate();
      const createdAt = new Date(completedAt.getTime() - completionTime * 1000);

      // Create the response data
      const responseData = {
        questionnaire_id: questionnaireId,
        patient_email: profile.email,
        patient_name: profile.name,
        patient_age: profile.age,
        patient_gender: profile.gender,
        score: targetScore,
        risk_level: riskLevel,
        flagged_for_review: targetScore >= 15, // Flag high risk responses
        completed_at: completedAt.toISOString(),
        created_at: createdAt.toISOString(),
        completion_time: completionTime,
        unique_code: `GAD7-${uuidv4().substring(0, 8)}`,
        answers: answers
      };

      // Store the response in the database
      const response = await api.responses.create(responseData.questionnaire_id, responseData);
      generatedResponses.push(response);

      console.log(`Generated response ${i + 1}/${count} with score ${targetScore} (${riskLevel} risk)`);
    }

    console.log(`Successfully generated ${count} GAD-7 responses`);
    return generatedResponses;
  } catch (error) {
    console.error('Error generating GAD-7 responses:', error);
    throw error;
  }
}

export default generateGAD7DatabaseResponses;
