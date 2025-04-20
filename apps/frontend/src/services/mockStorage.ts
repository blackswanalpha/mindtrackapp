/**
 * Mock Storage Service
 *
 * This service simulates a database by storing data in localStorage.
 * It provides methods for CRUD operations on various entities.
 */

// Define types for our entities
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

export type Answer = {
  id: number;
  response_id: number;
  question_id: number;
  value: string | number | boolean | string[];
  score?: number;
};

// Initialize storage with some sample data if it doesn't exist
const initializeStorage = () => {
  // Check if storage is already initialized
  if (localStorage.getItem('mockStorage_initialized') === 'true') {
    return;
  }

  // Sample questionnaires
  const questionnaires: Questionnaire[] = [
    {
      id: 1,
      title: 'Depression Assessment (PHQ-9)',
      description: 'A standardized questionnaire for screening and measuring the severity of depression.',
      instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
      type: 'assessment',
      category: 'Mental Health',
      estimated_time: 5,
      is_active: true,
      is_qr_enabled: true,
      is_public: true,
      allow_anonymous: true,
      requires_auth: false,
      created_at: '2023-01-15T10:30:00Z',
      organization_id: 1
    },
    {
      id: 2,
      title: 'Anxiety Screening (GAD-7)',
      description: 'A tool used to screen for generalized anxiety disorder.',
      instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
      type: 'assessment',
      category: 'Mental Health',
      estimated_time: 4,
      is_active: true,
      is_qr_enabled: true,
      is_public: true,
      allow_anonymous: true,
      requires_auth: false,
      created_at: '2023-02-10T09:15:00Z',
      organization_id: 1
    },
    {
      id: 3,
      title: 'Well-being Check',
      description: 'A general assessment of mental well-being and life satisfaction.',
      instructions: 'Please indicate how much you agree with each of the following statements.',
      type: 'survey',
      category: 'Well-being',
      estimated_time: 8,
      is_active: true,
      is_qr_enabled: true,
      is_public: false,
      allow_anonymous: true,
      requires_auth: false,
      created_at: '2023-03-05T14:20:00Z',
      organization_id: 2
    },
    {
      id: 4,
      title: 'Stress Assessment',
      description: 'A comprehensive assessment to measure your current stress levels and identify potential stressors.',
      instructions: 'Please answer the following questions based on your experiences over the past month.',
      type: 'assessment',
      category: 'Mental Health',
      estimated_time: 6,
      is_active: true,
      is_qr_enabled: true,
      is_public: true,
      allow_anonymous: true,
      requires_auth: false,
      created_at: '2023-04-12T11:45:00Z',
      organization_id: 1
    }
  ];

  // Sample questions for PHQ-9
  const questions: Question[] = [
    {
      id: 1,
      questionnaire_id: 1,
      text: 'Little interest or pleasure in doing things',
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
      id: 2,
      questionnaire_id: 1,
      text: 'Feeling down, depressed, or hopeless',
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
      id: 3,
      questionnaire_id: 1,
      text: 'Trouble falling or staying asleep, or sleeping too much',
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
      id: 4,
      questionnaire_id: 1,
      text: 'Feeling tired or having little energy',
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
      id: 5,
      questionnaire_id: 1,
      text: 'Poor appetite or overeating',
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
      id: 6,
      questionnaire_id: 1,
      text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
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
      id: 7,
      questionnaire_id: 1,
      text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
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
      id: 8,
      questionnaire_id: 1,
      text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
      type: 'single_choice',
      required: true,
      order_num: 8,
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ],
      scoring_weight: 1
    },
    {
      id: 9,
      questionnaire_id: 1,
      text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
      type: 'single_choice',
      required: true,
      order_num: 9,
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ],
      scoring_weight: 1
    },
    // Sample questions for GAD-7
    {
      id: 10,
      questionnaire_id: 2,
      text: 'Feeling nervous, anxious, or on edge',
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
      id: 11,
      questionnaire_id: 2,
      text: 'Not being able to stop or control worrying',
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
      id: 12,
      questionnaire_id: 2,
      text: 'Worrying too much about different things',
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
    }
  ];

  // Sample responses
  const responses: Response[] = [
    {
      id: 1,
      questionnaire_id: 1,
      patient_email: 'patient1@example.com',
      patient_name: 'John Doe',
      patient_age: 35,
      patient_gender: 'Male',
      score: 14,
      risk_level: 'moderate',
      flagged_for_review: true,
      completed_at: '2023-04-15T10:30:00Z',
      created_at: '2023-04-15T10:20:00Z',
      completion_time: 580,
      unique_code: 'RESP-1',
      answers: [
        { id: 1, response_id: 1, question_id: 1, value: 2, score: 2 },
        { id: 2, response_id: 1, question_id: 2, value: 3, score: 3 },
        { id: 3, response_id: 1, question_id: 3, value: 2, score: 2 },
        { id: 4, response_id: 1, question_id: 4, value: 3, score: 3 },
        { id: 5, response_id: 1, question_id: 5, value: 1, score: 1 },
        { id: 6, response_id: 1, question_id: 6, value: 2, score: 2 },
        { id: 7, response_id: 1, question_id: 7, value: 1, score: 1 },
        { id: 8, response_id: 1, question_id: 8, value: 0, score: 0 },
        { id: 9, response_id: 1, question_id: 9, value: 0, score: 0 }
      ]
    },
    {
      id: 2,
      questionnaire_id: 1,
      patient_email: 'patient2@example.com',
      patient_name: 'Jane Smith',
      patient_age: 42,
      patient_gender: 'Female',
      score: 8,
      risk_level: 'mild',
      flagged_for_review: false,
      completed_at: '2023-04-16T14:45:00Z',
      created_at: '2023-04-16T14:30:00Z',
      completion_time: 420,
      unique_code: 'RESP-2',
      answers: [
        { id: 10, response_id: 2, question_id: 1, value: 1, score: 1 },
        { id: 11, response_id: 2, question_id: 2, value: 1, score: 1 },
        { id: 12, response_id: 2, question_id: 3, value: 2, score: 2 },
        { id: 13, response_id: 2, question_id: 4, value: 1, score: 1 },
        { id: 14, response_id: 2, question_id: 5, value: 1, score: 1 },
        { id: 15, response_id: 2, question_id: 6, value: 1, score: 1 },
        { id: 16, response_id: 2, question_id: 7, value: 1, score: 1 },
        { id: 17, response_id: 2, question_id: 8, value: 0, score: 0 },
        { id: 18, response_id: 2, question_id: 9, value: 0, score: 0 }
      ]
    },
    {
      id: 3,
      questionnaire_id: 4,
      patient_email: 'patient3@example.com',
      patient_name: 'Robert Johnson',
      patient_age: 28,
      patient_gender: 'Male',
      score: 15,
      risk_level: 'high',
      flagged_for_review: true,
      completed_at: '2023-05-10T09:15:00Z',
      created_at: '2023-05-10T09:00:00Z',
      completion_time: 450,
      unique_code: 'RESP-ABC123',
      answers: [
        { id: 19, response_id: 3, question_id: 21, value: 3, score: 3 },
        { id: 20, response_id: 3, question_id: 22, value: 4, score: 4 },
        { id: 21, response_id: 3, question_id: 23, value: 3, score: 3 },
        { id: 22, response_id: 3, question_id: 24, value: 2, score: 2 },
        { id: 23, response_id: 3, question_id: 25, value: 3, score: 3 },
        { id: 24, response_id: 3, question_id: 26, value: [1, 2, 4] as any, score: 0 },
        { id: 25, response_id: 3, question_id: 27, value: 'I have been experiencing significant work pressure and health concerns recently.', score: 0 }
      ]
    },
    {
      id: 4,
      questionnaire_id: 2,
      patient_email: 'patient4@example.com',
      patient_name: 'Emily Davis',
      patient_age: 32,
      patient_gender: 'Female',
      score: 12,
      risk_level: 'moderate',
      flagged_for_review: false,
      completed_at: '2023-05-15T14:30:00Z',
      created_at: '2023-05-15T14:15:00Z',
      completion_time: 380,
      unique_code: 'RESP-739488',
      answers: [
        { id: 26, response_id: 4, question_id: 10, value: 2, score: 2 },
        { id: 27, response_id: 4, question_id: 11, value: 3, score: 3 },
        { id: 28, response_id: 4, question_id: 12, value: 2, score: 2 },
        { id: 29, response_id: 4, question_id: 13, value: 1, score: 1 },
        { id: 30, response_id: 4, question_id: 14, value: 2, score: 2 },
        { id: 31, response_id: 4, question_id: 15, value: 1, score: 1 },
        { id: 32, response_id: 4, question_id: 16, value: 1, score: 1 }
      ]
    }
  ];

  // Sample questions for Stress Assessment (questionnaire ID 4)
  questions.push(
    {
      id: 21,
      questionnaire_id: 4,
      text: 'How often have you felt nervous or stressed in the last month?',
      description: 'Consider all sources of stress in your life.',
      type: 'single_choice',
      required: true,
      order_num: 1,
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' }
      ],
      scoring_weight: 1
    },
    {
      id: 22,
      questionnaire_id: 4,
      text: 'How often have you felt that you were unable to control the important things in your life?',
      description: 'Think about your sense of control over life circumstances.',
      type: 'single_choice',
      required: true,
      order_num: 2,
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' }
      ],
      scoring_weight: 1
    },
    {
      id: 23,
      questionnaire_id: 4,
      text: 'How often have you felt confident about your ability to handle personal problems?',
      description: 'Consider your coping skills and resilience.',
      type: 'single_choice',
      required: true,
      order_num: 3,
      options: [
        { value: 4, label: 'Never' },
        { value: 3, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 1, label: 'Fairly often' },
        { value: 0, label: 'Very often' }
      ],
      scoring_weight: 1
    },
    {
      id: 24,
      questionnaire_id: 4,
      text: 'How often have you felt that things were going your way?',
      description: 'Think about how often you feel positive about life direction.',
      type: 'single_choice',
      required: true,
      order_num: 4,
      options: [
        { value: 4, label: 'Never' },
        { value: 3, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 1, label: 'Fairly often' },
        { value: 0, label: 'Very often' }
      ],
      scoring_weight: 1
    },
    {
      id: 25,
      questionnaire_id: 4,
      text: 'How often have you felt difficulties were piling up so high that you could not overcome them?',
      description: 'Consider your feelings of being overwhelmed.',
      type: 'single_choice',
      required: true,
      order_num: 5,
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Almost never' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Fairly often' },
        { value: 4, label: 'Very often' }
      ],
      scoring_weight: 1
    },
    {
      id: 26,
      questionnaire_id: 4,
      text: 'Which areas of your life cause you the most stress?',
      description: 'Select all that apply.',
      type: 'multiple_choice',
      required: true,
      order_num: 6,
      options: [
        { value: 1, label: 'Work/Career' },
        { value: 2, label: 'Finances' },
        { value: 3, label: 'Relationships' },
        { value: 4, label: 'Health' },
        { value: 5, label: 'Family responsibilities' },
        { value: 6, label: 'Academic pressures' },
        { value: 7, label: 'Social media/Technology' },
        { value: 8, label: 'World events/News' }
      ],
      scoring_weight: 1
    },
    {
      id: 27,
      questionnaire_id: 4,
      text: 'Please describe any specific stressors you are currently experiencing:',
      description: 'Optional - provide details about your current stress.',
      type: 'text',
      required: false,
      order_num: 7,
      scoring_weight: 0
    }
  );

  // Store data in localStorage
  localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
  localStorage.setItem('questions', JSON.stringify(questions));
  localStorage.setItem('responses', JSON.stringify(responses));
  localStorage.setItem('mockStorage_initialized', 'true');
};

// Generic CRUD operations
const getAll = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const getById = <T>(key: string, id: number): T | null => {
  const items = getAll<T>(key);
  return items.find((item: any) => item.id === id) || null;
};

const create = <T>(key: string, item: Omit<T, 'id'>): T => {
  const items = getAll<T>(key);
  const newId = items.length > 0 ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
  const newItem = { ...item, id: newId } as T;
  localStorage.setItem(key, JSON.stringify([...items, newItem]));
  return newItem;
};

const update = <T>(key: string, id: number, updates: Partial<T>): T | null => {
  const items = getAll<T>(key);
  const index = items.findIndex((item: any) => item.id === id);

  if (index === -1) return null;

  const updatedItem = { ...items[index], ...updates };
  items[index] = updatedItem;
  localStorage.setItem(key, JSON.stringify(items));
  return updatedItem;
};

const remove = <T>(key: string, id: number): boolean => {
  const items = getAll<T>(key);
  const filteredItems = items.filter((item: any) => item.id !== id);

  if (filteredItems.length === items.length) return false;

  localStorage.setItem(key, JSON.stringify(filteredItems));
  return true;
};

// Specific operations for our entities
const mockStorage = {
  initialize: initializeStorage,

  questionnaires: {
    getAll: () => getAll<Questionnaire>('questionnaires'),
    getById: (id: number) => getById<Questionnaire>('questionnaires', id),
    create: (questionnaire: Omit<Questionnaire, 'id'>) => create<Questionnaire>('questionnaires', questionnaire),
    update: (id: number, updates: Partial<Questionnaire>) => update<Questionnaire>('questionnaires', id, updates),
    delete: (id: number) => remove<Questionnaire>('questionnaires', id)
  },

  questions: {
    getAll: () => getAll<Question>('questions'),
    getById: (id: number) => getById<Question>('questions', id),
    getByQuestionnaire: (questionnaireId: number) => {
      const questions = getAll<Question>('questions');
      return questions
        .filter(q => q.questionnaire_id === questionnaireId)
        .sort((a, b) => a.order_num - b.order_num);
    },
    create: (question: Omit<Question, 'id'>) => create<Question>('questions', question),
    update: (id: number, updates: Partial<Question>) => update<Question>('questions', id, updates),
    delete: (id: number) => remove<Question>('questions', id)
  },

  responses: {
    getAll: () => getAll<Response>('responses'),
    getById: (id: number) => getById<Response>('responses', id),
    getByQuestionnaire: (questionnaireId: number) => {
      const responses = getAll<Response>('responses');
      return responses.filter(r => r.questionnaire_id === questionnaireId);
    },
    getByUniqueCode: (uniqueCode: string) => {
      const responses = getAll<Response>('responses');
      return responses.find(r => r.unique_code === uniqueCode);
    },
    create: (response: Omit<Response, 'id'>) => create<Response>('responses', response),
    update: (id: number, updates: Partial<Response>) => update<Response>('responses', id, updates),
    delete: (id: number) => remove<Response>('responses', id)
  },

  // Helper function to calculate score for a response
  calculateScore: (questionnaireId: number, answers: Omit<Answer, 'id' | 'response_id'>[]) => {
    // Import scoringService at the top of the file
    const questions = getAll<Question>('questions')
      .filter(q => q.questionnaire_id === questionnaireId);

    // Use the scoring service to calculate the score
    // This requires importing scoringService at the top of the file
    // For now, we'll keep the existing implementation

    let totalScore = 0;

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.question_id);
      if (!question) return;

      // For single choice questions, the value is the score
      if (question.type === 'single_choice' && typeof answer.value === 'number') {
        totalScore += (answer.value as number) * (question.scoring_weight || 1);
      }

      // For other question types, we would need more complex scoring logic
    });

    // Determine risk level based on score (using PHQ-9 scoring as an example)
    let riskLevel = '';
    if (questionnaireId === 1) { // PHQ-9
      if (totalScore <= 4) riskLevel = 'minimal';
      else if (totalScore <= 9) riskLevel = 'mild';
      else if (totalScore <= 14) riskLevel = 'moderate';
      else if (totalScore <= 19) riskLevel = 'moderately severe';
      else riskLevel = 'severe';
    } else if (questionnaireId === 2) { // GAD-7
      if (totalScore <= 4) riskLevel = 'minimal';
      else if (totalScore <= 9) riskLevel = 'mild';
      else if (totalScore <= 14) riskLevel = 'moderate';
      else riskLevel = 'severe';
    } else if (questionnaireId === 4) { // Stress Assessment
      if (totalScore <= 7) riskLevel = 'low';
      else if (totalScore <= 14) riskLevel = 'moderate';
      else if (totalScore <= 21) riskLevel = 'high';
      else riskLevel = 'very high';
    }

    return { score: totalScore, riskLevel };
  }
};

export default mockStorage;
