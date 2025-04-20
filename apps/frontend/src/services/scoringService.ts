/**
 * Scoring Service
 * 
 * This service provides functions for scoring questionnaire responses.
 */

import { Question, Answer } from '@/types';

// Define scoring methods
export type ScoringMethod = 'sum' | 'average' | 'weighted_average' | 'custom';

// Define risk level ranges
export type RiskLevelRange = {
  min: number;
  max: number;
  label: string;
  risk_level: string;
  color: string;
  description: string;
};

// Define scoring configuration
export type ScoringConfig = {
  id: number;
  name: string;
  description: string;
  questionnaire_type: string;
  scoring_method: ScoringMethod;
  ranges: RiskLevelRange[];
  max_score: number;
  passing_score?: number;
  rules?: any;
};

// Define scoring result
export type ScoringResult = {
  score: number;
  risk_level: string;
  max_score: number;
  passing_score?: number;
  answer_scores: Record<number, number>;
  flagged_for_review: boolean;
};

// Predefined scoring configurations
const scoringConfigs: Record<string, ScoringConfig> = {
  'phq9': {
    id: 1,
    name: 'PHQ-9 Depression Scoring',
    description: 'Standard scoring system for the PHQ-9 depression assessment',
    questionnaire_type: 'depression',
    scoring_method: 'sum',
    max_score: 27,
    ranges: [
      { min: 0, max: 4, label: 'Minimal', risk_level: 'minimal', color: '#4ade80', description: 'Minimal depression' },
      { min: 5, max: 9, label: 'Mild', risk_level: 'mild', color: '#a3e635', description: 'Mild depression' },
      { min: 10, max: 14, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate depression' },
      { min: 15, max: 19, label: 'Moderately Severe', risk_level: 'moderately severe', color: '#f97316', description: 'Moderately severe depression' },
      { min: 20, max: 27, label: 'Severe', risk_level: 'severe', color: '#ef4444', description: 'Severe depression' }
    ]
  },
  'gad7': {
    id: 2,
    name: 'GAD-7 Anxiety Scoring',
    description: 'Standard scoring system for the GAD-7 anxiety assessment',
    questionnaire_type: 'anxiety',
    scoring_method: 'sum',
    max_score: 21,
    ranges: [
      { min: 0, max: 4, label: 'Minimal', risk_level: 'minimal', color: '#4ade80', description: 'Minimal anxiety' },
      { min: 5, max: 9, label: 'Mild', risk_level: 'mild', color: '#a3e635', description: 'Mild anxiety' },
      { min: 10, max: 14, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate anxiety' },
      { min: 15, max: 21, label: 'Severe', risk_level: 'severe', color: '#ef4444', description: 'Severe anxiety' }
    ]
  },
  'stress': {
    id: 3,
    name: 'Perceived Stress Scale Scoring',
    description: 'Scoring system for the Perceived Stress Scale',
    questionnaire_type: 'stress',
    scoring_method: 'sum',
    max_score: 40,
    ranges: [
      { min: 0, max: 13, label: 'Low', risk_level: 'low', color: '#4ade80', description: 'Low stress' },
      { min: 14, max: 26, label: 'Moderate', risk_level: 'moderate', color: '#facc15', description: 'Moderate stress' },
      { min: 27, max: 40, label: 'High', risk_level: 'high', color: '#ef4444', description: 'High stress' }
    ]
  }
};

// Map questionnaire IDs to scoring configurations
const questionnaireToScoringConfig: Record<number, string> = {
  1: 'phq9',  // PHQ-9
  2: 'gad7',  // GAD-7
  4: 'stress' // Stress Assessment
};

/**
 * Calculate score for a response
 * @param questionnaireId - Questionnaire ID
 * @param answers - Array of answers
 * @param questions - Array of questions
 * @returns Scoring result
 */
export const calculateScore = (
  questionnaireId: number,
  answers: Answer[],
  questions: Question[]
): ScoringResult => {
  // Get scoring configuration for this questionnaire
  const configKey = questionnaireToScoringConfig[questionnaireId] || 'phq9';
  const config = scoringConfigs[configKey];
  
  // Initialize variables
  let score = 0;
  let totalWeight = 0;
  const answerScores: Record<number, number> = {};
  
  // Calculate score based on scoring method
  switch (config.scoring_method) {
    case 'sum':
      // Sum all answer values
      answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.question_id);
        if (!question) return;
        
        let answerScore = 0;
        
        // Calculate score for this answer
        if (question.type === 'single_choice' && typeof answer.value === 'number') {
          answerScore = answer.value as number;
        } else if (answer.score !== undefined) {
          answerScore = answer.score;
        }
        
        // Apply scoring weight
        const weightedScore = answerScore * (question.scoring_weight || 1);
        score += weightedScore;
        answerScores[answer.question_id] = answerScore;
      });
      break;
      
    case 'average':
      // Average all answer values
      let validAnswers = 0;
      
      answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.question_id);
        if (!question) return;
        
        let answerScore = 0;
        
        // Calculate score for this answer
        if (question.type === 'single_choice' && typeof answer.value === 'number') {
          answerScore = answer.value as number;
          validAnswers++;
        } else if (answer.score !== undefined) {
          answerScore = answer.score;
          validAnswers++;
        }
        
        score += answerScore;
        answerScores[answer.question_id] = answerScore;
      });
      
      if (validAnswers > 0) {
        score = Math.round(score / validAnswers);
      }
      break;
      
    case 'weighted_average':
      // Weighted average based on question weights
      answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.question_id);
        if (!question) return;
        
        const weight = question.scoring_weight || 1;
        let answerScore = 0;
        
        // Calculate score for this answer
        if (question.type === 'single_choice' && typeof answer.value === 'number') {
          answerScore = answer.value as number;
        } else if (answer.score !== undefined) {
          answerScore = answer.score;
        }
        
        score += answerScore * weight;
        totalWeight += weight;
        answerScores[answer.question_id] = answerScore;
      });
      
      if (totalWeight > 0) {
        score = Math.round(score / totalWeight);
      }
      break;
      
    case 'custom':
      // Apply custom scoring rules
      // This would need to be implemented based on specific requirements
      break;
  }
  
  // Determine risk level
  let riskLevel = config.ranges[0].risk_level; // Default to lowest risk level
  
  for (const range of config.ranges) {
    if (score >= range.min && score <= range.max) {
      riskLevel = range.risk_level;
      break;
    }
  }
  
  // Determine if response should be flagged for review
  const highRiskLevels = ['severe', 'moderately severe', 'high', 'very high'];
  const flaggedForReview = highRiskLevels.includes(riskLevel);
  
  return {
    score,
    risk_level: riskLevel,
    max_score: config.max_score,
    passing_score: config.passing_score,
    answer_scores: answerScores,
    flagged_for_review: flaggedForReview
  };
};

/**
 * Get scoring configuration for a questionnaire
 * @param questionnaireId - Questionnaire ID
 * @returns Scoring configuration
 */
export const getScoringConfig = (questionnaireId: number): ScoringConfig => {
  const configKey = questionnaireToScoringConfig[questionnaireId] || 'phq9';
  return scoringConfigs[configKey];
};

/**
 * Get risk level color
 * @param riskLevel - Risk level
 * @param questionnaireId - Questionnaire ID
 * @returns Color code
 */
export const getRiskLevelColor = (riskLevel: string, questionnaireId: number): string => {
  const config = getScoringConfig(questionnaireId);
  const range = config.ranges.find(r => r.risk_level === riskLevel);
  return range?.color || '#9ca3af'; // Default gray
};

/**
 * Get risk level description
 * @param riskLevel - Risk level
 * @param questionnaireId - Questionnaire ID
 * @returns Description
 */
export const getRiskLevelDescription = (riskLevel: string, questionnaireId: number): string => {
  const config = getScoringConfig(questionnaireId);
  const range = config.ranges.find(r => r.risk_level === riskLevel);
  return range?.description || 'No description available';
};

/**
 * Get recommendations based on risk level
 * @param riskLevel - Risk level
 * @param questionnaireType - Questionnaire type
 * @returns Recommendations
 */
export const getRecommendations = (riskLevel: string, questionnaireType: string): string => {
  // Depression recommendations
  if (questionnaireType === 'depression') {
    switch (riskLevel) {
      case 'minimal':
        return 'Continue with self-care practices and monitor for any changes in symptoms.';
      case 'mild':
        return 'Consider discussing symptoms with a healthcare provider. Self-help strategies may be beneficial.';
      case 'moderate':
        return 'Consultation with a healthcare provider is recommended. Treatment options may include therapy or medication.';
      case 'moderately severe':
        return 'Prompt consultation with a healthcare provider is strongly recommended. Treatment is likely necessary.';
      case 'severe':
        return 'Immediate consultation with a healthcare provider is necessary. Active treatment with a combination of medication and therapy is typically indicated.';
      default:
        return 'Please consult with a healthcare provider for personalized recommendations.';
    }
  }
  
  // Anxiety recommendations
  if (questionnaireType === 'anxiety') {
    switch (riskLevel) {
      case 'minimal':
        return 'Continue with self-care practices and monitor for any changes in symptoms.';
      case 'mild':
        return 'Consider discussing symptoms with a healthcare provider. Relaxation techniques and stress management may be helpful.';
      case 'moderate':
        return 'Consultation with a healthcare provider is recommended. Treatment options may include therapy, stress management, or medication.';
      case 'severe':
        return 'Prompt consultation with a healthcare provider is strongly recommended. Treatment with therapy, medication, or a combination approach is typically indicated.';
      default:
        return 'Please consult with a healthcare provider for personalized recommendations.';
    }
  }
  
  // Stress recommendations
  if (questionnaireType === 'stress') {
    switch (riskLevel) {
      case 'low':
        return 'Your stress levels appear to be manageable. Continue with healthy coping strategies and self-care practices.';
      case 'moderate':
        return 'Your stress levels are elevated. Consider implementing stress reduction techniques such as mindfulness, exercise, and improved time management.';
      case 'high':
        return 'Your stress levels are high. It is recommended to consult with a healthcare provider about stress management strategies and potential support resources.';
      default:
        return 'Please consult with a healthcare provider for personalized recommendations.';
    }
  }
  
  return 'Please consult with a healthcare provider for personalized recommendations.';
};

// Export the scoring service
const scoringService = {
  calculateScore,
  getScoringConfig,
  getRiskLevelColor,
  getRiskLevelDescription,
  getRecommendations
};

export default scoringService;
