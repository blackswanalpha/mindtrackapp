const { google } = require('googleapis');
const axios = require('axios');
const GoogleFormResponse = require('../models/GoogleFormResponse');

// Form ID from the URL: https://forms.gle/NLqA1svRhX5Pez1K6
const FORM_ID = process.env.GOOGLE_FORM_ID || 'NLqA1svRhX5Pez1K6';

/**
 * Import responses from Google Form
 * Note: For a production app, you would use proper Google API authentication
 * This simplified version uses a workaround for demo purposes
 */
exports.importFormResponses = async (req, res) => {
  try {
    // In a real implementation, you would use the Google Forms API with proper authentication
    // For this demo, we'll simulate the response structure
    
    // Generate some sample responses based on the form structure
    const sampleResponses = generateSampleResponses();
    
    // Save responses to database
    const savedResponses = await GoogleFormResponse.saveResponses(
      FORM_ID, 
      sampleResponses
    );
    
    res.status(200).json({
      success: true,
      message: `Imported ${savedResponses.length} responses`,
      data: savedResponses
    });
  } catch (error) {
    console.error('Error importing form responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import form responses',
      error: error.message
    });
  }
};

/**
 * Get all form responses
 */
exports.getAllResponses = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    const responses = await GoogleFormResponse.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    });
    
    res.status(200).json({
      success: true,
      data: responses
    });
  } catch (error) {
    console.error('Error fetching form responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch form responses',
      error: error.message
    });
  }
};

/**
 * Get a single form response by ID
 */
exports.getResponseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await GoogleFormResponse.getById(id);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error fetching form response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch form response',
      error: error.message
    });
  }
};

/**
 * Get form response statistics
 */
exports.getResponseStatistics = async (req, res) => {
  try {
    const stats = await GoogleFormResponse.getStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching response statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response statistics',
      error: error.message
    });
  }
};

/**
 * Helper function to generate sample responses for the form
 * In a real implementation, this would be replaced with actual API calls
 */
function generateSampleResponses() {
  // Based on the form structure at https://forms.gle/NLqA1svRhX5Pez1K6
  const responses = [];
  
  // Generate 5 sample responses
  for (let i = 0; i < 5; i++) {
    const responseId = `response_${Date.now()}_${i}`;
    
    // Create a response with answers to each question
    const response = {
      responseId,
      createTime: new Date().toISOString(),
      lastSubmittedTime: new Date().toISOString(),
      answers: {
        // Email question
        "question_1": {
          textAnswers: {
            answers: [{ value: `user${i}@example.com` }]
          }
        },
        // Name question
        "question_2": {
          textAnswers: {
            answers: [{ value: `User ${i}` }]
          }
        },
        // Age question
        "question_3": {
          textAnswers: {
            answers: [{ value: `${20 + i}` }]
          }
        },
        // Gender question
        "question_4": {
          choiceAnswers: {
            answers: [{ value: i % 2 === 0 ? "Male" : "Female" }]
          }
        },
        // Feedback question
        "question_5": {
          textAnswers: {
            answers: [{ value: `This is sample feedback number ${i}` }]
          }
        }
      }
    };
    
    responses.push(response);
  }
  
  return responses;
}
