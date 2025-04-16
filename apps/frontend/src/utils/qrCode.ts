/**
 * Utility functions for QR code generation
 */

/**
 * Generate QR code URL for a questionnaire
 * @param questionnaireId - Questionnaire ID
 * @param baseUrl - Base URL of the application
 * @returns QR code URL
 */
export const generateQuestionnaireQrUrl = (
  questionnaireId: number | string,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
): string => {
  // Create the questionnaire URL
  const questionnaireUrl = `${baseUrl}/questionnaires/respond/${questionnaireId}`;
  
  // Generate QR code URL using a free QR code API
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(questionnaireUrl)}`;
};

/**
 * Generate QR code data URL for a questionnaire
 * This function requires the qrcode library to be installed
 * @param questionnaireId - Questionnaire ID
 * @param baseUrl - Base URL of the application
 * @returns Promise resolving to QR code data URL
 */
export const generateQuestionnaireQrDataUrl = async (
  questionnaireId: number | string,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
): Promise<string> => {
  try {
    // Dynamically import the qrcode library
    const QRCode = (await import('qrcode')).default;
    
    // Create the questionnaire URL
    const questionnaireUrl = `${baseUrl}/questionnaires/respond/${questionnaireId}`;
    
    // Generate QR code data URL
    return await QRCode.toDataURL(questionnaireUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

/**
 * Download QR code as image
 * @param questionnaireId - Questionnaire ID
 * @param title - Questionnaire title for filename
 */
export const downloadQuestionnaireQr = async (
  questionnaireId: number | string,
  title: string
): Promise<void> => {
  try {
    // Generate QR code URL
    const qrUrl = generateQuestionnaireQrUrl(questionnaireId);
    
    // Fetch the image
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
  }
};
