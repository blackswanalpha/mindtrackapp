/**
 * Utility functions for handling API errors
 */

/**
 * Format error message from API response
 * @param error - Error object
 * @returns Formatted error message
 */
export const formatErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Handle API error and return formatted message
 * @param error - Error object
 * @param defaultMessage - Default message to return if error cannot be formatted
 * @returns Formatted error message
 */
export const handleApiError = (error: any, defaultMessage = 'An error occurred'): string => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return formatErrorMessage(error) || defaultMessage;
};

/**
 * Check if error is an authentication error
 * @param error - Error object
 * @returns Whether error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  if (error?.response?.status === 401) {
    return true;
  }
  
  if (error?.message?.includes('authentication') || error?.message?.includes('unauthorized')) {
    return true;
  }
  
  return false;
};

/**
 * Check if error is a validation error
 * @param error - Error object
 * @returns Whether error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  return error?.response?.status === 400 || !!error?.response?.data?.errors;
};

/**
 * Get validation errors from API response
 * @param error - Error object
 * @returns Object with field names as keys and error messages as values
 */
export const getValidationErrors = (error: any): Record<string, string> => {
  if (!isValidationError(error)) {
    return {};
  }
  
  const errors = error?.response?.data?.errors || [];
  const errorMap: Record<string, string> = {};
  
  errors.forEach((err: any) => {
    if (err.param && err.msg) {
      errorMap[err.param] = err.msg;
    }
  });
  
  return errorMap;
};
