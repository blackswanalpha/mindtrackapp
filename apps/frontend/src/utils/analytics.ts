/**
 * Utility functions for analytics
 */

/**
 * Calculate average score from responses
 * @param responses - Array of responses
 * @returns Average score
 */
export const calculateAverageScore = (responses: any[]): number => {
  if (!responses || responses.length === 0) {
    return 0;
  }

  const validScores = responses
    .filter(response => response.score !== null && response.score !== undefined)
    .map(response => response.score);

  if (validScores.length === 0) {
    return 0;
  }

  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / validScores.length) * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculate completion rate from responses
 * @param responses - Array of responses
 * @returns Completion rate (0-100)
 */
export const calculateCompletionRate = (responses: any[]): number => {
  if (!responses || responses.length === 0) {
    return 0;
  }

  const completedCount = responses.filter(response => response.completed_at).length;
  return Math.round((completedCount / responses.length) * 100);
};

/**
 * Calculate risk level distribution from responses
 * @param responses - Array of responses
 * @returns Object with risk level counts
 */
export const calculateRiskDistribution = (responses: any[]): Record<string, number> => {
  if (!responses || responses.length === 0) {
    return { high: 0, medium: 0, low: 0 };
  }

  const distribution = {
    high: 0,
    medium: 0,
    low: 0
  };

  responses.forEach(response => {
    const riskLevel = response.risk_level as keyof typeof distribution;
    if (riskLevel && distribution[riskLevel] !== undefined) {
      distribution[riskLevel]++;
    }
  });

  return distribution;
};

/**
 * Calculate response count by date
 * @param responses - Array of responses
 * @param days - Number of days to include
 * @returns Array of objects with date and count
 */
export const calculateResponsesByDate = (responses: any[], days = 7): any[] => {
  if (!responses || responses.length === 0) {
    return [];
  }

  // Create date range
  const dateRange: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    dateRange.push({
      date: date.toISOString().split('T')[0],
      count: 0
    });
  }

  // Count responses by date
  responses.forEach(response => {
    if (!response.created_at) return;

    const responseDate = new Date(response.created_at);
    responseDate.setHours(0, 0, 0, 0);
    const dateString = responseDate.toISOString().split('T')[0];

    const dateEntry = dateRange.find(entry => entry.date === dateString);
    if (dateEntry) {
      dateEntry.count++;
    }
  });

  return dateRange;
};

/**
 * Calculate average completion time from responses
 * @param responses - Array of responses
 * @returns Average completion time in minutes
 */
export const calculateAverageCompletionTime = (responses: any[]): number => {
  if (!responses || responses.length === 0) {
    return 0;
  }

  const validTimes = responses
    .filter(response => response.completion_time)
    .map(response => response.completion_time);

  if (validTimes.length === 0) {
    return 0;
  }

  const sum = validTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / validTimes.length);
};
