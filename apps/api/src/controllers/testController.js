const { google } = require('googleapis');
const axios = require('axios');
const cheerio = require('cheerio');
const TestQuestionnaire = require('../models/TestQuestionnaire');
const TestQuestion = require('../models/TestQuestion');
const TestResponse = require('../models/TestResponse');

/**
 * Get all test questionnaires
 * @route GET /api/test/questionnaires
 */
const getQuestionnaires = async (req, res, next) => {
  try {
    const questionnaires = await TestQuestionnaire.findAll();
    
    res.json({
      success: true,
      data: {
        questionnaires
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get test questionnaire by ID with questions
 * @route GET /api/test/questionnaires/:id
 */
const getQuestionnaireById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get questionnaire
    const questionnaire = await TestQuestionnaire.findById(id);
    
    if (!questionnaire) {
      return res.status(404).json({ 
        success: false,
        message: 'Questionnaire not found' 
      });
    }
    
    // Get questions
    const questions = await TestQuestion.findByQuestionnaire(id);
    
    res.json({
      success: true,
      data: {
        questionnaire,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Scrape questionnaire from Google Forms
 * @route POST /api/test/questionnaires/scrape
 */
const scrapeQuestionnaire = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    // Validate URL is a Google Form
    if (!url.includes('docs.google.com/forms')) {
      return res.status(400).json({
        success: false,
        message: 'URL must be a Google Form'
      });
    }
    
    // Fetch the form content
    const response = await axios.get(url);
    const html = response.data;
    
    // Parse the HTML
    const $ = cheerio.load(html);
    
    // Extract form title
    const title = $('title').text().replace(' - Google Forms', '');
    
    // Extract form description
    const description = $('.freebirdFormviewerViewDescriptionText').text();
    
    // Create questionnaire
    const questionnaire = await TestQuestionnaire.create({
      title,
      description,
      source_url: url,
      is_active: true
    });
    
    // Extract questions
    const questions = [];
    $('.freebirdFormviewerViewNumberedItemContainer').each((i, element) => {
      const questionText = $(element).find('.freebirdFormviewerViewItemsItemItemTitle').text();
      const isRequired = $(element).find('.freebirdFormviewerViewItemsItemRequiredAsterisk').length > 0;
      
      let type = 'text';
      let options = [];
      
      // Check if it's a multiple choice question
      if ($(element).find('.freebirdFormviewerViewItemsRadioOptionContainer').length > 0) {
        type = 'single_choice';
        $(element).find('.freebirdFormviewerViewItemsRadioOptionContainer').each((j, option) => {
          options.push($(option).text().trim());
        });
      }
      
      // Check if it's a checkbox question
      if ($(element).find('.freebirdFormviewerViewItemsCheckboxOptionContainer').length > 0) {
        type = 'multiple_choice';
        $(element).find('.freebirdFormviewerViewItemsCheckboxOptionContainer').each((j, option) => {
          options.push($(option).text().trim());
        });
      }
      
      questions.push({
        questionnaire_id: questionnaire.id,
        text: questionText,
        type,
        required: isRequired,
        options: options.length > 0 ? JSON.stringify(options) : null,
        order_num: i + 1
      });
    });
    
    // Create questions
    await TestQuestion.createBulk(questionnaire.id, questions);
    
    res.status(201).json({
      success: true,
      message: 'Questionnaire scraped successfully',
      data: {
        questionnaire,
        questions_count: questions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create test response
 * @route POST /api/test/responses
 */
const createResponse = async (req, res, next) => {
  try {
    const {
      questionnaire_id,
      respondent_email,
      unique_code,
      answers
    } = req.body;
    
    // Check if questionnaire exists
    const questionnaire = await TestQuestionnaire.findById(questionnaire_id);
    
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found'
      });
    }
    
    // Create response
    const response = await TestResponse.create({
      questionnaire_id,
      respondent_email,
      unique_code,
      response_data: JSON.stringify({ answers }),
      completed: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      data: {
        response
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all test responses
 * @route GET /api/test/responses
 */
const getResponses = async (req, res, next) => {
  try {
    const { questionnaire_id } = req.query;
    
    let responses;
    if (questionnaire_id) {
      responses = await TestResponse.findByQuestionnaire(questionnaire_id);
    } else {
      responses = await TestResponse.findAll();
    }
    
    res.json({
      success: true,
      data: {
        responses
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get test response by ID
 * @route GET /api/test/responses/:id
 */
const getResponseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get response
    const response = await TestResponse.findById(id);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }
    
    // Get questionnaire
    const questionnaire = await TestQuestionnaire.findById(response.questionnaire_id);
    
    // Get questions
    const questions = await TestQuestion.findByQuestionnaire(response.questionnaire_id);
    
    res.json({
      success: true,
      data: {
        response,
        questionnaire,
        questions
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestionnaires,
  getQuestionnaireById,
  scrapeQuestionnaire,
  createResponse,
  getResponses,
  getResponseById
};
