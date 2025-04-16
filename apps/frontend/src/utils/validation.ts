/**
 * Utility functions for form validation
 */

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Whether email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Whether password is strong enough
 */
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns Whether URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @returns Whether phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

/**
 * Validate required field
 * @param value - Field value
 * @returns Whether field is filled
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return true;
};

/**
 * Validate minimum length
 * @param value - Field value
 * @param minLength - Minimum length
 * @returns Whether field meets minimum length
 */
export const minLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param value - Field value
 * @param maxLength - Maximum length
 * @returns Whether field meets maximum length
 */
export const maxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validate numeric value
 * @param value - Field value
 * @returns Whether field is numeric
 */
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value));
};

/**
 * Validate integer value
 * @param value - Field value
 * @returns Whether field is an integer
 */
export const isInteger = (value: string): boolean => {
  return Number.isInteger(Number(value));
};

/**
 * Validate minimum value
 * @param value - Field value
 * @param min - Minimum value
 * @returns Whether field meets minimum value
 */
export const minValue = (value: number, min: number): boolean => {
  return value >= min;
};

/**
 * Validate maximum value
 * @param value - Field value
 * @param max - Maximum value
 * @returns Whether field meets maximum value
 */
export const maxValue = (value: number, max: number): boolean => {
  return value <= max;
};
