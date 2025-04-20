/**
 * Statistics Service
 */

const Response = require('../models/Response');
const Questionnaire = require('../models/Questionnaire');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Organization = require('../models/Organization');

/**
 * Get questionnaire statistics
 * @param {Number} questionnaireId - Questionnaire ID
 * @returns {Promise<Object>} - Statistics object
 */
const getQuestionnaireStatistics = async (questionnaireId) => {
  try {
    // Get questionnaire
    const questionnaire = await Questionnaire.findById(questionnaireId);
    
    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }
    
    // Get responses for the questionnaire
    const responses = await Response.findByQuestionnaire(questionnaireId);
    
    // Calculate basic statistics
    const totalResponses = responses.length;
    const completedResponses = responses.filter(r => r.completed_at).length;
    const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;
    
    // Calculate score statistics
    const scores = responses.filter(r => r.score !== null && r.score !== undefined).map(r => r.score);
    const avgScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    
    // Calculate risk level distribution
    const riskLevels = {};
    responses.forEach(response => {
      if (response.risk_level) {
        riskLevels[response.risk_level] = (riskLevels[response.risk_level] || 0) + 1;
      }
    });
    
    // Calculate response time statistics
    const completionTimes = responses
      .filter(r => r.completion_time)
      .map(r => r.completion_time);
    
    const avgCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
      : 0;
    
    // Get response trend over time
    const responseTrend = await getResponseTrend(questionnaireId);
    
    return {
      questionnaire: {
        id: questionnaire.id,
        title: questionnaire.title,
        description: questionnaire.description
      },
      responses: {
        total: totalResponses,
        completed: completedResponses,
        completion_rate: completionRate.toFixed(2)
      },
      scores: {
        average: avgScore.toFixed(2),
        min: minScore,
        max: maxScore
      },
      risk_levels: riskLevels,
      completion_time: {
        average_seconds: avgCompletionTime.toFixed(2)
      },
      trends: responseTrend
    };
  } catch (error) {
    console.error('Error getting questionnaire statistics:', error);
    throw error;
  }
};

/**
 * Get response trend over time
 * @param {Number} questionnaireId - Questionnaire ID
 * @returns {Promise<Array>} - Trend data
 */
const getResponseTrend = async (questionnaireId) => {
  try {
    const query = `
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as count
      FROM responses
      WHERE questionnaire_id = $1
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `;
    
    const result = await Response.query(query, [questionnaireId]);
    
    return result.rows.map(row => ({
      date: row.date,
      count: parseInt(row.count)
    }));
  } catch (error) {
    console.error('Error getting response trend:', error);
    return [];
  }
};

/**
 * Get question statistics
 * @param {Number} questionId - Question ID
 * @returns {Promise<Object>} - Statistics object
 */
const getQuestionStatistics = async (questionId) => {
  try {
    // Get answer statistics from the Answer model
    const statistics = await Answer.getStatistics(questionId);
    
    if (!statistics) {
      return {
        total_answers: 0,
        statistics: null
      };
    }
    
    return statistics;
  } catch (error) {
    console.error('Error getting question statistics:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @returns {Promise<Object>} - Statistics object
 */
const getUserStatistics = async () => {
  try {
    // Get total users
    const totalUsers = await User.count();
    
    // Get users by role
    const adminUsers = await User.count({ role: 'admin' });
    const providerUsers = await User.count({ role: 'healthcare_provider' });
    const regularUsers = await User.count({ role: 'user' });
    
    // Get recently active users
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.last_login
      FROM users u
      WHERE u.last_login IS NOT NULL
      ORDER BY u.last_login DESC
      LIMIT 10
    `;
    
    const recentlyActiveResult = await User.query(query);
    
    return {
      total: totalUsers,
      by_role: {
        admin: adminUsers,
        healthcare_provider: providerUsers,
        user: regularUsers
      },
      recently_active: recentlyActiveResult.rows
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw error;
  }
};

/**
 * Get organization statistics
 * @returns {Promise<Object>} - Statistics object
 */
const getOrganizationStatistics = async () => {
  try {
    // Get organizations with member count
    const organizations = await Organization.findWithMemberCount();
    
    // Calculate total members
    const totalMembers = organizations.reduce((sum, org) => sum + parseInt(org.member_count || 0), 0);
    
    // Get organizations with most members
    const topOrganizations = [...organizations]
      .sort((a, b) => parseInt(b.member_count || 0) - parseInt(a.member_count || 0))
      .slice(0, 5);
    
    return {
      total_organizations: organizations.length,
      total_members: totalMembers,
      average_members_per_org: organizations.length > 0 ? (totalMembers / organizations.length).toFixed(2) : 0,
      top_organizations: topOrganizations.map(org => ({
        id: org.id,
        name: org.name,
        member_count: parseInt(org.member_count || 0)
      }))
    };
  } catch (error) {
    console.error('Error getting organization statistics:', error);
    throw error;
  }
};

/**
 * Get system-wide statistics
 * @returns {Promise<Object>} - Statistics object
 */
const getSystemStatistics = async () => {
  try {
    // Get counts from various models
    const userCount = await User.count();
    const questionnaireCount = await Questionnaire.count();
    const responseCount = await Response.count();
    
    // Get recent activity
    const recentResponsesQuery = `
      SELECT 
        r.id,
        r.questionnaire_id,
        q.title as questionnaire_title,
        r.created_at,
        r.score,
        r.risk_level
      FROM responses r
      JOIN questionnaires q ON r.questionnaire_id = q.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    
    const recentResponsesResult = await Response.query(recentResponsesQuery);
    
    return {
      counts: {
        users: userCount,
        questionnaires: questionnaireCount,
        responses: responseCount
      },
      recent_activity: {
        responses: recentResponsesResult.rows
      }
    };
  } catch (error) {
    console.error('Error getting system statistics:', error);
    throw error;
  }
};

module.exports = {
  getQuestionnaireStatistics,
  getQuestionStatistics,
  getUserStatistics,
  getOrganizationStatistics,
  getSystemStatistics
};
