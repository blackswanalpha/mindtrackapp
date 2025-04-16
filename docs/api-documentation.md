# Advanced Questionnaire System API Documentation

This document provides detailed information about the API endpoints available in the Advanced Questionnaire System.

## Base URLs

- **Basic API**: `http://localhost:5000/api`
- **Enhanced API**: `http://localhost:5001/api`

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Questionnaires

### Get All Questionnaires

Retrieves a list of all questionnaires.

- **URL**: `/questionnaires`
- **Method**: `GET`
- **Auth Required**: Yes
- **Server**: Enhanced

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
[
  {
    "id": 1,
    "title": "Health Assessment",
    "description": "Comprehensive health assessment questionnaire",
    "type": "standard",
    "category": "health",
    "estimated_time": 10,
    "is_active": true,
    "is_adaptive": false,
    "is_qr_enabled": true,
    "is_template": false,
    "is_public": false,
    "allow_anonymous": true,
    "requires_auth": false,
    "max_responses": null,
    "expires_at": null,
    "version": 1,
    "parent_id": null,
    "tags": ["health", "assessment"],
    "organization_id": null,
    "created_by_id": 1,
    "created_by_name": "Admin User",
    "organization_name": null,
    "created_at": "2023-04-13T12:00:00.000Z",
    "updated_at": "2023-04-13T12:00:00.000Z"
  }
]
```

### Get Questionnaire by ID

Retrieves a specific questionnaire by its ID.

- **URL**: `/questionnaires/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the questionnaire to retrieve

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "id": 1,
  "title": "Health Assessment",
  "description": "Comprehensive health assessment questionnaire",
  "type": "standard",
  "category": "health",
  "estimated_time": 10,
  "is_active": true,
  "is_adaptive": false,
  "is_qr_enabled": true,
  "is_template": false,
  "is_public": false,
  "allow_anonymous": true,
  "requires_auth": false,
  "max_responses": null,
  "expires_at": null,
  "version": 1,
  "parent_id": null,
  "tags": ["health", "assessment"],
  "organization_id": null,
  "created_by_id": 1,
  "created_by_name": "Admin User",
  "organization_name": null,
  "created_at": "2023-04-13T12:00:00.000Z",
  "updated_at": "2023-04-13T12:00:00.000Z"
}
```

#### Error Response

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Questionnaire not found"
}
```

### Create Questionnaire

Creates a new questionnaire with advanced settings.

- **URL**: `/questionnaires`
- **Method**: `POST`
- **Auth Required**: Yes
- **Server**: Enhanced
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "title": "New Questionnaire",
  "description": "Description of the questionnaire",
  "type": "standard",
  "category": "health",
  "estimatedTime": 10,
  "isActive": true,
  "isAdaptive": false,
  "isQrEnabled": true,
  "isTemplate": false,
  "isPublic": false,
  "allowAnonymous": true,
  "requiresAuth": false,
  "maxResponses": null,
  "expiresAt": null,
  "tags": ["health", "assessment"],
  "organizationId": null
}
```

#### Success Response

- **Code**: `201 Created`
- **Content**: The created questionnaire object

#### Error Response

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "Error creating questionnaire",
  "error": "Error details"
}
```

### Update Questionnaire

Updates an existing questionnaire.

- **URL**: `/questionnaires/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the questionnaire to update
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "title": "Updated Questionnaire",
  "description": "Updated description",
  "isActive": false,
  "isPublic": true,
  "tags": ["updated", "health"]
}
```

#### Success Response

- **Code**: `200 OK`
- **Content**: The updated questionnaire object

#### Error Response

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Questionnaire not found"
}
```

### Delete Questionnaire

Deletes a questionnaire.

- **URL**: `/questionnaires/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the questionnaire to delete

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Questionnaire deleted successfully"
}
```

#### Error Response

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Questionnaire not found"
}
```

## Questions

### Get Questions for a Questionnaire

Retrieves all questions for a specific questionnaire.

- **URL**: `/questionnaires/:id/questions`
- **Method**: `GET`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the questionnaire

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
[
  {
    "id": 1,
    "questionnaire_id": 1,
    "text": "How would you rate your overall health?",
    "description": "Please select the option that best describes your current health status",
    "type": "single_choice",
    "required": true,
    "order_num": 1,
    "conditional_logic": null,
    "validation_rules": null,
    "scoring_weight": 1,
    "options": [
      {
        "id": 1,
        "text": "Excellent",
        "value": "excellent",
        "score": 5,
        "order_num": 1,
        "is_correct": false
      },
      {
        "id": 2,
        "text": "Good",
        "value": "good",
        "score": 4,
        "order_num": 2,
        "is_correct": false
      }
    ]
  }
]
```

### Create Question

Creates a new question for a questionnaire.

- **URL**: `/questions`
- **Method**: `POST`
- **Auth Required**: Yes
- **Server**: Enhanced
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "questionnaire_id": 1,
  "text": "Do you have any allergies?",
  "description": "Please indicate if you have any known allergies",
  "type": "yes_no",
  "required": true,
  "order_num": 2,
  "options": [
    {
      "text": "Yes",
      "value": "yes",
      "score": 1,
      "order_num": 1,
      "is_correct": false
    },
    {
      "text": "No",
      "value": "no",
      "score": 0,
      "order_num": 2,
      "is_correct": false
    }
  ]
}
```

#### Success Response

- **Code**: `201 Created`
- **Content**: The created question object

### Update Question

Updates an existing question.

- **URL**: `/questions/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the question to update
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "text": "Updated question text",
  "required": false
}
```

#### Success Response

- **Code**: `200 OK`
- **Content**: The updated question object

### Delete Question

Deletes a question.

- **URL**: `/questions/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the question to delete

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Question deleted successfully"
}
```

## Scoring Configuration

### Get Scoring Configuration for a Questionnaire

Retrieves the scoring configuration for a specific questionnaire.

- **URL**: `/questionnaires/:id/scoring-config`
- **Method**: `GET`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the questionnaire

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "id": 1,
  "questionnaire_id": 1,
  "name": "Default",
  "description": "Default scoring configuration",
  "scoring_method": "sum",
  "max_score": 100,
  "passing_score": 60,
  "is_active": true,
  "rules": [
    {
      "id": 1,
      "scoring_config_id": 1,
      "name": "Low Risk",
      "description": "Score indicates low risk",
      "min_score": 0,
      "max_score": 30,
      "risk_level": "low",
      "color": "green",
      "action": "No action required"
    },
    {
      "id": 2,
      "scoring_config_id": 1,
      "name": "Medium Risk",
      "description": "Score indicates medium risk",
      "min_score": 31,
      "max_score": 70,
      "risk_level": "medium",
      "color": "yellow",
      "action": "Follow up recommended"
    },
    {
      "id": 3,
      "scoring_config_id": 1,
      "name": "High Risk",
      "description": "Score indicates high risk",
      "min_score": 71,
      "max_score": 100,
      "risk_level": "high",
      "color": "red",
      "action": "Immediate follow up required"
    }
  ]
}
```

### Create or Update Scoring Configuration

Creates or updates the scoring configuration for a questionnaire.

- **URL**: `/questionnaires/:id/scoring-config`
- **Method**: `POST`
- **Auth Required**: Yes
- **Server**: Enhanced
- **URL Parameters**: 
  - `id`: ID of the questionnaire
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "name": "Custom Scoring",
  "description": "Custom scoring configuration",
  "scoring_method": "weighted_average",
  "max_score": 100,
  "passing_score": 70,
  "is_active": true,
  "rules": [
    {
      "name": "Low Risk",
      "description": "Score indicates low risk",
      "min_score": 0,
      "max_score": 40,
      "risk_level": "low",
      "color": "green",
      "action": "No action required"
    },
    {
      "name": "High Risk",
      "description": "Score indicates high risk",
      "min_score": 41,
      "max_score": 100,
      "risk_level": "high",
      "color": "red",
      "action": "Immediate follow up required"
    }
  ]
}
```

#### Success Response

- **Code**: `200 OK`
- **Content**: The created or updated scoring configuration object

## Usage Examples

### Creating a Questionnaire with Advanced Settings

```javascript
// Example using axios
const axios = require('axios');

async function createQuestionnaire() {
  try {
    const response = await axios.post('http://localhost:5001/api/questionnaires', {
      title: 'Mental Health Assessment',
      description: 'Comprehensive mental health screening questionnaire',
      type: 'standard',
      category: 'mental_health',
      estimatedTime: 15,
      isActive: true,
      isAdaptive: true,
      isQrEnabled: true,
      isTemplate: true,
      isPublic: false,
      allowAnonymous: false,
      requiresAuth: true,
      maxResponses: 1000,
      expiresAt: '2023-12-31T23:59:59Z',
      tags: ['mental_health', 'screening', 'assessment'],
      organizationId: 1
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Questionnaire created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating questionnaire:', error.response?.data || error.message);
    throw error;
  }
}

// Call the function
createQuestionnaire();
```

### Adding Questions to a Questionnaire

```javascript
// Example using axios
const axios = require('axios');

async function addQuestionToQuestionnaire(questionnaireId) {
  try {
    const response = await axios.post('http://localhost:5001/api/questions', {
      questionnaire_id: questionnaireId,
      text: 'How often do you feel anxious?',
      description: 'Please select the option that best describes your experience',
      type: 'single_choice',
      required: true,
      order_num: 1,
      options: [
        {
          text: 'Never',
          value: 'never',
          score: 0,
          order_num: 1,
          is_correct: false
        },
        {
          text: 'Rarely',
          value: 'rarely',
          score: 1,
          order_num: 2,
          is_correct: false
        },
        {
          text: 'Sometimes',
          value: 'sometimes',
          score: 2,
          order_num: 3,
          is_correct: false
        },
        {
          text: 'Often',
          value: 'often',
          score: 3,
          order_num: 4,
          is_correct: false
        },
        {
          text: 'Always',
          value: 'always',
          score: 4,
          order_num: 5,
          is_correct: false
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Question added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error.response?.data || error.message);
    throw error;
  }
}

// Call the function with a questionnaire ID
addQuestionToQuestionnaire(1);
```

### Setting Up Scoring Configuration

```javascript
// Example using axios
const axios = require('axios');

async function setupScoringConfig(questionnaireId) {
  try {
    const response = await axios.post(`http://localhost:5001/api/questionnaires/${questionnaireId}/scoring-config`, {
      name: 'Anxiety Assessment Scoring',
      description: 'Scoring configuration for anxiety assessment',
      scoring_method: 'sum',
      max_score: 20,
      passing_score: null,
      is_active: true,
      rules: [
        {
          name: 'Minimal Anxiety',
          description: 'Score indicates minimal anxiety',
          min_score: 0,
          max_score: 4,
          risk_level: 'low',
          color: 'green',
          action: 'No clinical intervention needed'
        },
        {
          name: 'Mild Anxiety',
          description: 'Score indicates mild anxiety',
          min_score: 5,
          max_score: 9,
          risk_level: 'medium-low',
          color: 'blue',
          action: 'Monitor and reassess in 2 weeks'
        },
        {
          name: 'Moderate Anxiety',
          description: 'Score indicates moderate anxiety',
          min_score: 10,
          max_score: 14,
          risk_level: 'medium',
          color: 'yellow',
          action: 'Consider clinical intervention'
        },
        {
          name: 'Severe Anxiety',
          description: 'Score indicates severe anxiety',
          min_score: 15,
          max_score: 20,
          risk_level: 'high',
          color: 'red',
          action: 'Clinical intervention recommended'
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Scoring configuration set up:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error setting up scoring config:', error.response?.data || error.message);
    throw error;
  }
}

// Call the function with a questionnaire ID
setupScoringConfig(1);
```
