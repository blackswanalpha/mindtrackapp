/**
 * Type definitions for the application
 */

// Question types
export type Question = {
  id: number;
  questionnaire_id: number;
  text: string;
  description?: string;
  type: string;
  required: boolean;
  order_num: number;
  options?: Array<{ value: number; label: string }>;
  scoring_weight: number;
};

// Answer types
export type Answer = {
  id: number;
  response_id: number;
  question_id: number;
  value: string | number | boolean | string[];
  score?: number;
};

// Response types
export type Response = {
  id: number;
  questionnaire_id: number;
  patient_email: string;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  score?: number;
  risk_level?: string;
  flagged_for_review: boolean;
  completed_at: string;
  created_at: string;
  completion_time?: number;
  unique_code: string;
  answers: Answer[];
};

// Questionnaire types
export type Questionnaire = {
  id: number;
  title: string;
  description?: string;
  instructions?: string;
  type: string;
  category?: string;
  estimated_time?: number;
  is_active: boolean;
  is_adaptive?: boolean;
  is_qr_enabled?: boolean;
  is_template?: boolean;
  is_public?: boolean;
  allow_anonymous?: boolean;
  requires_auth?: boolean;
  max_responses?: number;
  created_at: string;
  updated_at?: string;
  created_by_id?: number;
  organization_id?: number;
};

// Scoring types
export type ScoringRange = {
  min: number;
  max: number;
  label: string;
  risk_level: string;
  color: string;
  description: string;
};

export type ScoringSystem = {
  id: number;
  name: string;
  description: string;
  questionnaire_type: string;
  ranges: ScoringRange[];
  formula: string;
  created_at: string;
  updated_at?: string;
  created_by: {
    id: number;
    name: string;
  };
  questionnaire_count: number;
  is_default: boolean;
};

export type ScoringResult = {
  score: number;
  risk_level: string;
  max_score: number;
  passing_score?: number;
  answer_scores: Record<number, number>;
  flagged_for_review: boolean;
};
