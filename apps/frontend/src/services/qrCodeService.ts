/**
 * QR Code Service
 * 
 * This service handles QR code generation and management.
 */

import { apiClient } from '@/lib/apiClient';

// Flag to determine whether to use mock data or real API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

// Helper to simulate API delay
const simulateApiDelay = async (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * QR Code Service
 */
const qrCodeService = {
  /**
   * Generate QR code for a questionnaire
   */
  generateQuestionnaireQRCode: async (questionnaireId: number, options?: { style?: string, format?: string }) => {
    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        await simulateApiDelay(800);
        
        // Mock QR code data
        return {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLQ//8yV0c/JZCoain2xgj+wRqXWOMyFmtcZrHGZRZrXGaxxmUWa1xmscZlFmtcZrHGZRZrXGaxxmUWa1xmscZlFmtc5sNLSn9TxRNKpyqeUDpV8YTSb6p4Q+lNizUus1jjMos1LvPhyyq+SekNpTcpnSqeUDpVcaJ0quJE6ZsqvmmxxmUWa1xmscZlPvwypTdUPKF0qnhC6VTFidITFU8onSreUPpNFb9pscZlFmtcZrHGZT78x1ScKJ2qOFE6VXGi9ETFidJ/2WKNyyzWuMxijct8+GUVv0npRMWJ0qmKE6VTFSdKpyqeUDpV8UTFb1qscZnFGpdZrHGZD1+m9DdVnCidqjhROlVxonSq4kTpVMWJ0qmKJ5T+SxZrXGaxxmUWa1zmw0sV/09KpypOlE5VnCidqjhROlVxovRExYnSqYo3Lda4zGKNyyzWuMyHl5T+poonlJ6oOFE6VfGE0hMVJ0qnKk6UTlWcKJ2qeELpTYs1LrNY4zKLNS7z4csqvknpVMUTSqcqTpROVZwoPVFxonSq4kTpVMWJ0qmKE6VvWqxxmcUal1mscZkPv0zpDRVPKJ2qOFE6VXGidKriROnfVHGidKriCaXftFjjMos1LrNY4zIf/mMqTpROVZwoPVFxovRExYnSqYoTpVMVJ0qnKk6UTlWcKL1pscZlFmtcZrHGZT78sorfpHSq4kTpVMWJ0qmKE6UnKk6UTlWcKJ2qOFE6VfGE0psWa1xmscZlFmtc5sOXKf1NFU8onap4QulUxYnSqYoTpVMVJ0qnKk6UTlWcKJ2qeNNijcss1rjMYo3LfHip4v9J6VTFidKpihOlUxUnSqcqTpROVZwoPVHxhNKbFmtcZrHGZRZrXObDS0p/U8UTSqcqTpROVZwoPVFxovRExYnSqYoTpVMVJ0pvWqxxmcUal1mscZkPX1bxTUpvUDpV8YTSqYoTpVMVJ0qnKk6UTlWcKH3TYo3LLNY4zP8AQiHT74TvQqsAAAAASUVORK5CYII=',
          url: `http://localhost:3000/questionnaires/respond/${questionnaireId}`,
          style: options?.style || 'default'
        };
      }
      
      // Use real API
      const queryParams = new URLSearchParams();
      if (options?.style) queryParams.append('style', options.style);
      if (options?.format) queryParams.append('format', options.format);
      
      const response = await apiClient.get(`/qr-codes/questionnaires/${questionnaireId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to generate QR code for questionnaire ${questionnaireId}:`, error);
      throw error;
    }
  },
  
  /**
   * Generate QR code for a response
   */
  generateResponseQRCode: async (uniqueCode: string, options?: { style?: string, format?: string }) => {
    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        await simulateApiDelay(800);
        
        // Mock QR code data
        return {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLQ//8yV0c/JZCoain2xgj+wRqXWOMyFmtcZrHGZRZrXGaxxmUWa1xmscZlFmtcZrHGZRZrXGaxxmUWa1xmscZlFmtc5sNLSn9TxRNKpyqeUDpV8YTSb6p4Q+lNizUus1jjMos1LvPhyyq+SekNpTcpnSqeUDpVcaJ0quJE6Zsqvmmxxmw',
          url: `http://localhost:3000/responses/view/${uniqueCode}`,
          style: options?.style || 'default'
        };
      }
      
      // Use real API
      const queryParams = new URLSearchParams();
      if (options?.style) queryParams.append('style', options.style);
      if (options?.format) queryParams.append('format', options.format);
      
      const response = await apiClient.get(`/qr-codes/responses/${uniqueCode}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to generate QR code for response ${uniqueCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Download QR code for a questionnaire
   */
  downloadQuestionnaireQRCode: async (questionnaireId: number, options?: { style?: string }) => {
    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        await simulateApiDelay(800);
        
        // In mock mode, we just return the URL that would be used
        return {
          downloadUrl: `http://localhost:3001/api/v1/qr-codes/questionnaires/${questionnaireId}/download${options?.style ? `?style=${options.style}` : ''}`
        };
      }
      
      // For real API, return the download URL
      const queryParams = options?.style ? `?style=${options.style}` : '';
      return {
        downloadUrl: `${apiClient.defaults.baseURL}/qr-codes/questionnaires/${questionnaireId}/download${queryParams}`
      };
    } catch (error) {
      console.error(`Failed to get download URL for questionnaire QR code ${questionnaireId}:`, error);
      throw error;
    }
  },
  
  /**
   * Download QR code as SVG for a questionnaire
   */
  downloadQuestionnaireQRCodeAsSVG: async (questionnaireId: number, options?: { style?: string }) => {
    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        await simulateApiDelay(800);
        
        // In mock mode, we just return the URL that would be used
        return {
          downloadUrl: `http://localhost:3001/api/v1/qr-codes/questionnaires/${questionnaireId}/svg${options?.style ? `?style=${options.style}` : ''}`
        };
      }
      
      // For real API, return the download URL
      const queryParams = options?.style ? `?style=${options.style}` : '';
      return {
        downloadUrl: `${apiClient.defaults.baseURL}/qr-codes/questionnaires/${questionnaireId}/svg${queryParams}`
      };
    } catch (error) {
      console.error(`Failed to get SVG download URL for questionnaire QR code ${questionnaireId}:`, error);
      throw error;
    }
  },
  
  /**
   * Generate random style QR code
   */
  generateRandomStyleQRCode: async (url: string) => {
    try {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        await simulateApiDelay(1000);
        
        // Mock random style QR code
        return {
          dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLQ//8yV0c/JZCoain2xgj+wRqXWOMyFmtcZrHGZRZrXGaxxmUWa1xmscZlFmtcZrHGZRZrXGaxxmUWa1xmscZlFmtc5sNLSn9TxRNKpyqeUDpV8YTSb6p4Q+lNizUus1jjMos1LvPhyyq+SekNpTcpnSqeUDpVcaJ0quJE6Zsqvmmxxmw',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="10" height="10" x="10" y="10" fill="#e91e63"/></svg>',
          style: 'vibrant',
          url
        };
      }
      
      // Use real API
      const response = await apiClient.post('/qr-codes/random', { url });
      return response.data;
    } catch (error) {
      console.error('Failed to generate random style QR code:', error);
      throw error;
    }
  }
};

export default qrCodeService;
