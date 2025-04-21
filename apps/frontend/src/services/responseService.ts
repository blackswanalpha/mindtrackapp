/**
 * Response Service
 *
 * Handles saving and retrieving questionnaire responses to/from the database
 */

import api from './api';

/**
 * Save a complete response with answers to the database
 *
 * @param questionnaireId - ID of the questionnaire
 * @param data - Response data including answers
 * @returns The saved response
 */
export const saveResponse = async (questionnaireId: number, data: any) => {
  try {
    console.log('Starting saveResponse with data:', data);

    // Validate data before proceeding
    if (!data.email) {
      console.error('Email is missing in the data');
      throw new Error('Email is required');
    }

    if (!data.answers) {
      console.error('Answers are missing in the data');
      throw new Error('Answers are required');
    }

    if (!Array.isArray(data.answers)) {
      console.error('Answers are not an array:', data.answers);
      throw new Error('Answers must be an array');
    }

    if (data.answers.length === 0) {
      console.error('Answers array is empty');
      throw new Error('At least one answer is required');
    }

    // Format the response data according to the API requirements
    const responseData = {
      questionnaire_id: questionnaireId,
      patient_email: data.email,
      patient_name: data.name || null,
      patient_age: data.age || null,
      patient_gender: data.gender || null,
      start_time: data.startTime || new Date().toISOString(),
      answers: formatAnswers(data.answers)
    };

    // Log the formatted data
    console.log('Formatted response data for API:', JSON.stringify(responseData));
    console.log('Original answers:', JSON.stringify(data.answers));
    console.log('Formatted answers:', JSON.stringify(responseData.answers));

    // Ensure we have answers after formatting
    if (!responseData.answers || responseData.answers.length === 0) {
      console.error('No valid answers after formatting');
      throw new Error('No valid answers to submit');
    }

    // Save the response to the database
    console.log('Sending data to API...');
    const response = await api.responses.create(questionnaireId, responseData);
    console.log('API response:', response);
    return response;
  } catch (error: any) {
    console.error('Error saving response:', error);

    // Check if we have a detailed error message from the API
    if (error.response && error.response.data) {
      console.error('API error details:', error.response.data);

      // If there are missing questions, log them
      if (error.response.data.missing_questions) {
        console.error('Missing required questions:', error.response.data.missing_questions);
        console.error('Missing question texts:', error.response.data.missing_question_texts);
      }

      // Rethrow the error with the API message
      throw new Error(error.response.data.message || 'Failed to save response');
    }

    // Rethrow the original error if it's not an API error
    if (error instanceof Error) {
      throw error;
    }

    // If API fails, create a mock response
    console.warn('Falling back to mock response');
    return createMockResponse(questionnaireId, data);
  }
};

/**
 * Calculate completion time in seconds
 *
 * @param startTime - Start time of the questionnaire
 * @returns Completion time in seconds
 */
const calculateCompletionTime = (startTime?: string) => {
  if (!startTime) return 0;

  const start = new Date(startTime).getTime();
  const end = new Date().getTime();

  // Return time in seconds
  return Math.floor((end - start) / 1000);
};

/**
 * Generate a unique code for the response
 *
 * @returns A unique code
 */
const generateUniqueCode = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

/**
 * Format answers for database storage
 *
 * @param answers - Array of answers
 * @returns Formatted answers
 */
const formatAnswers = (answers: any[]) => {
  if (!answers || !Array.isArray(answers)) {
    console.warn('Invalid answers format:', answers);
    return [];
  }

  // Log the original answers for debugging
  console.log('Formatting answers:', JSON.stringify(answers));

  // Filter out any answers with empty values
  const formattedAnswers = answers
    .filter(answer => {
      // Skip answers without question_id
      if (!answer.question_id && answer.question_id !== 0) {
        console.log('Filtering out answer without question_id:', answer);
        return false;
      }

      const value = answer.value;
      const isEmpty = value === '' || value === null || value === undefined ||
              (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        console.log(`Filtering out empty answer for question ${answer.question_id}:`, answer);
        return false;
      }

      return true;
    })
    .map(answer => {
      try {
        // Ensure question_id is a number
        let questionId;
        if (typeof answer.question_id === 'string') {
          questionId = parseInt(answer.question_id, 10);
        } else {
          questionId = Number(answer.question_id);
        }

        if (isNaN(questionId)) {
          console.error('Invalid question_id:', answer.question_id);
          throw new Error(`Invalid question_id: ${answer.question_id}`);
        }

        // Format the answer value
        const formattedValue = formatAnswerValue(answer.value);
        console.log(`Formatted value for question ${questionId}:`, formattedValue);

        return {
          question_id: questionId,
          value: formattedValue
          // Note: Don't include score in the API request, the server will calculate it
        };
      } catch (error) {
        console.error('Error formatting answer:', error);
        console.error('Problematic answer:', answer);
        // Skip this answer
        return null;
      }
    })
    .filter(answer => answer !== null) as any[];

  console.log('Formatted answers:', JSON.stringify(formattedAnswers));
  return formattedAnswers;
};

/**
 * Format answer value for database storage
 *
 * @param value - Answer value
 * @returns Formatted value
 */
const formatAnswerValue = (value: any) => {
  try {
    console.log('Formatting answer value:', value, 'Type:', typeof value);

    // Handle null or undefined
    if (value === null || value === undefined) {
      console.log('Value is null or undefined, returning empty string');
      return '';
    }

    // Convert arrays to strings if needed
    if (Array.isArray(value)) {
      console.log('Value is an array');
      // Filter out any null or undefined values
      const filteredArray = value.filter(v => v !== null && v !== undefined);
      console.log('Filtered array:', filteredArray);

      // If array is empty after filtering, return empty string
      if (filteredArray.length === 0) {
        console.log('Array is empty after filtering, returning empty string');
        return '';
      }

      // Convert each value to string
      const result = filteredArray.map(v => String(v));
      console.log('Converted array to strings:', result);
      return result;
    }

    // Convert numbers to strings
    if (typeof value === 'number') {
      console.log('Value is a number, converting to string');
      return String(value);
    }

    // Convert booleans to strings
    if (typeof value === 'boolean') {
      console.log('Value is a boolean, converting to string');
      return value ? 'true' : 'false';
    }

    // Handle objects by converting to JSON string
    if (typeof value === 'object') {
      console.log('Value is an object, converting to JSON string');
      return JSON.stringify(value);
    }

    // For any other type, convert to string
    console.log('Converting value to string');
    return String(value);
  } catch (error) {
    console.error('Error formatting answer value:', error);
    console.error('Problematic value:', value);
    return '';
  }
};

/**
 * Create a mock response when API fails
 *
 * @param questionnaireId - ID of the questionnaire
 * @param data - Response data
 * @returns Mock response
 */
const createMockResponse = (questionnaireId: number, data: any) => {
  const uniqueCode = generateUniqueCode();
  const completionTime = calculateCompletionTime(data.startTime);
  const score = data.score || 0;

  // Determine risk level based on score
  let riskLevel = 'low';
  if (score > 15) riskLevel = 'high';
  else if (score > 7) riskLevel = 'medium';

  // Create a mock response that matches the API response format
  return {
    id: Math.floor(Math.random() * 10000),
    questionnaire_id: questionnaireId,
    patient_email: data.email || null,
    patient_name: data.name || null,
    score: score,
    risk_level: riskLevel,
    flagged_for_review: riskLevel === 'high',
    completed_at: new Date().toISOString(),
    created_at: data.startTime || new Date().toISOString(),
    completion_time: completionTime,
    unique_code: uniqueCode,
    answers: data.answers || [],
    message: 'Response submitted successfully (mock)',
  };
};

/**
 * Get response by unique code
 *
 * @param uniqueCode - Unique code of the response
 * @returns The response
 */
export const getResponseByUniqueCode = async (uniqueCode: string) => {
  try {
    const response = await api.responses.getByUniqueCode(uniqueCode);
    return response;
  } catch (error) {
    console.error('Error getting response by unique code:', error);
    throw error;
  }
};

export default {
  saveResponse,
  getResponseByUniqueCode
};
