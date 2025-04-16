/**
 * Utility functions for exporting data
 */

/**
 * Convert array of objects to CSV string
 * @param data - Array of objects to convert
 * @param columns - Column configuration
 * @returns CSV string
 */
export const convertToCSV = (
  data: any[],
  columns: { key: string; header: string }[]
): string => {
  if (!data || !data.length || !columns || !columns.length) {
    return '';
  }

  // Create header row
  const headerRow = columns.map(column => `"${column.header}"`).join(',');

  // Create data rows
  const dataRows = data.map(item => {
    return columns
      .map(column => {
        const value = item[column.key];

        // Handle different value types
        if (value === null || value === undefined) {
          return '""';
        }

        if (typeof value === 'string') {
          // Escape quotes in strings
          return `"${value.replace(/"/g, '""')}"`;
        }

        if (typeof value === 'object') {
          if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          }

          try {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          } catch (error) {
            return '""';
          }
        }

        return `"${value}"`;
      })
      .join(',');
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download data as CSV file
 * @param data - Array of objects to export
 * @param columns - Column configuration
 * @param filename - Name of the file to download
 */
export const downloadCSV = (
  data: any[],
  columns: { key: string; header: string }[],
  filename: string
): void => {
  // Convert data to CSV
  const csv = convertToCSV(data, columns);

  // Create blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export responses to CSV
 * @param responses - Array of responses to export
 * @param includeAnswers - Whether to include answers in export
 * @param filename - Name of the file to download
 */
export const exportResponsesToCSV = (
  responses: any[],
  includeAnswers = false,
  filename = 'responses'
): void => {
  if (!responses || !responses.length) {
    return;
  }

  let columns = [
    { key: 'id', header: 'ID' },
    { key: 'questionnaire_id', header: 'Questionnaire ID' },
    { key: 'patient_name', header: 'Patient Name' },
    { key: 'patient_email', header: 'Patient Email' },
    { key: 'patient_age', header: 'Patient Age' },
    { key: 'patient_gender', header: 'Patient Gender' },
    { key: 'score', header: 'Score' },
    { key: 'risk_level', header: 'Risk Level' },
    { key: 'flagged_for_review', header: 'Flagged' },
    { key: 'completed_at', header: 'Completed At' },
    { key: 'created_at', header: 'Created At' }
  ];

  let data = responses.map(response => {
    const result = { ...response };

    // Format boolean values
    result.flagged_for_review = response.flagged_for_review ? 'Yes' : 'No';

    // Format dates
    if (response.completed_at) {
      result.completed_at = new Date(response.completed_at).toISOString();
    }

    if (response.created_at) {
      result.created_at = new Date(response.created_at).toISOString();
    }

    return result;
  });

  // Include answers if requested
  if (includeAnswers && responses[0]?.answers) {
    // Flatten responses with answers
    data = responses.flatMap(response => {
      if (!response.answers || !response.answers.length) {
        return [{ ...response, question_id: '', question_text: '', answer_value: '' }];
      }

      return response.answers.map((answer: any) => ({
        ...response,
        question_id: answer.question_id,
        question_text: answer.question?.text || '',
        answer_value: answer.value
      }));
    });

    // Add answer columns
    columns = [
      ...columns,
      { key: 'question_id', header: 'Question ID' },
      { key: 'question_text', header: 'Question Text' },
      { key: 'answer_value', header: 'Answer' }
    ];
  }

  // Download CSV
  downloadCSV(data, columns, filename);
};

/**
 * Export questionnaires to CSV
 * @param questionnaires - Array of questionnaires to export
 * @param filename - Name of the file to download
 */
export const exportQuestionnairesToCSV = (
  questionnaires: any[],
  filename = 'questionnaires'
): void => {
  if (!questionnaires || !questionnaires.length) {
    return;
  }

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'description', header: 'Description' },
    { key: 'type', header: 'Type' },
    { key: 'category', header: 'Category' },
    { key: 'estimated_time', header: 'Estimated Time (min)' },
    { key: 'is_active', header: 'Active' },
    { key: 'is_public', header: 'Public' },
    { key: 'is_template', header: 'Template' },
    { key: 'created_at', header: 'Created At' },
    { key: 'created_by_id', header: 'Created By ID' }
  ];

  const data = questionnaires.map(questionnaire => {
    const result = { ...questionnaire };

    // Format boolean values
    result.is_active = questionnaire.is_active ? 'Yes' : 'No';
    result.is_public = questionnaire.is_public ? 'Yes' : 'No';
    result.is_template = questionnaire.is_template ? 'Yes' : 'No';

    // Format dates
    if (questionnaire.created_at) {
      result.created_at = new Date(questionnaire.created_at).toISOString();
    }

    return result;
  });

  // Download CSV
  downloadCSV(data, columns, filename);
};
