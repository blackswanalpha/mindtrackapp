/**
 * Utility functions for local storage
 */

/**
 * Get item from local storage
 * @param key - Storage key
 * @returns Stored value or null if not found
 */
export const getStorageItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return null;
  }
};

/**
 * Set item in local storage
 * @param key - Storage key
 * @param value - Value to store
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
  }
};

/**
 * Remove item from local storage
 * @param key - Storage key
 */
export const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
  }
};

/**
 * Clear all items from local storage
 */
export const clearStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};
