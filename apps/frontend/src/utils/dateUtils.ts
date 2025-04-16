/**
 * Utility functions for date formatting
 */

/**
 * Format date to local date string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date to local date and time string
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date to relative time (e.g. "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return diffSec === 1 ? '1 second ago' : `${diffSec} seconds ago`;
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffHour < 24) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  }
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay < 30) {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  }
  
  // Convert to months
  const diffMonth = Math.floor(diffDay / 30);
  
  if (diffMonth < 12) {
    return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  }
  
  // Convert to years
  const diffYear = Math.floor(diffMonth / 12);
  
  return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
};

/**
 * Calculate time difference in minutes
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  if (!startDate || !endDate) return 0;
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60));
};
