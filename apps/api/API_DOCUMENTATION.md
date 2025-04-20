# MindTrack API Documentation

## Overview

The MindTrack API provides endpoints for managing questionnaires, responses, scoring, notifications, and analytics for mental health assessments.

Base URL: `/api/v1`

## Authentication

Most endpoints require authentication using a JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticate a user and get a JWT token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin"
    }
  }
  ```

#### Register
- **URL:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

## Questionnaires

### Get All Questionnaires
- **URL:** `/questionnaires`
- **Method:** `GET`
- **Description:** Get all questionnaires
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search term
  - `category` (optional): Filter by category
  - `type` (optional): Filter by type
- **Response:**
  ```json
  {
    "questionnaires": [
      {
        "id": 1,
        "title": "Depression Assessment (PHQ-9)",
        "description": "The Patient Health Questionnaire (PHQ-9)",
        "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
        "created_by": 1,
        "is_published": true,
        "created_at": "2023-06-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
  ```

### Get Questionnaire by ID
- **URL:** `/questionnaires/:id`
- **Method:** `GET`
- **Description:** Get a questionnaire by ID
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Depression Assessment (PHQ-9)",
    "description": "The Patient Health Questionnaire (PHQ-9)",
    "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    "created_by": 1,
    "is_published": true,
    "created_at": "2023-06-01T12:00:00Z",
    "questions": [
      {
        "id": 1,
        "text": "Little interest or pleasure in doing things",
        "type": "scale",
        "required": true,
        "order_num": 1,
        "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      }
    ]
  }
  ```

### Create Questionnaire
- **URL:** `/questionnaires`
- **Method:** `POST`
- **Description:** Create a new questionnaire
- **Request Body:**
  ```json
  {
    "title": "Depression Assessment (PHQ-9)",
    "description": "The Patient Health Questionnaire (PHQ-9)",
    "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    "is_published": true
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Depression Assessment (PHQ-9)",
    "description": "The Patient Health Questionnaire (PHQ-9)",
    "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    "created_by": 1,
    "is_published": true,
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

## Questions

### Get Questions for Questionnaire
- **URL:** `/questions/questionnaire/:questionnaireId`
- **Method:** `GET`
- **Description:** Get all questions for a questionnaire
- **Response:**
  ```json
  [
    {
      "id": 1,
      "questionnaire_id": 1,
      "text": "Little interest or pleasure in doing things",
      "type": "scale",
      "required": true,
      "order_num": 1,
      "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ]
  ```

### Create Question
- **URL:** `/questions`
- **Method:** `POST`
- **Description:** Create a new question
- **Request Body:**
  ```json
  {
    "questionnaire_id": 1,
    "text": "Little interest or pleasure in doing things",
    "type": "scale",
    "required": true,
    "order_num": 1,
    "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "questionnaire_id": 1,
    "text": "Little interest or pleasure in doing things",
    "type": "scale",
    "required": true,
    "order_num": 1,
    "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

## Responses

### Submit Response
- **URL:** `/responses`
- **Method:** `POST`
- **Description:** Submit a response to a questionnaire
- **Request Body:**
  ```json
  {
    "questionnaire_id": 1,
    "respondent_email": "patient@example.com",
    "answers": [
      {
        "question_id": 1,
        "value": "Several days"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "questionnaire_id": 1,
    "respondent_email": "patient@example.com",
    "score": 10,
    "risk_level": "moderate",
    "completed_at": "2023-06-01T12:00:00Z",
    "answers": [
      {
        "id": 1,
        "question_id": 1,
        "value": "Several days",
        "score": 1
      }
    ]
  }
  ```

### Get Responses
- **URL:** `/responses`
- **Method:** `GET`
- **Description:** Get all responses
- **Query Parameters:**
  - `questionnaire_id` (optional): Filter by questionnaire
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:**
  ```json
  {
    "responses": [
      {
        "id": 1,
        "questionnaire_id": 1,
        "questionnaire_title": "Depression Assessment (PHQ-9)",
        "respondent_email": "patient@example.com",
        "score": 10,
        "risk_level": "moderate",
        "completed_at": "2023-06-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
  ```

## Scoring

### Create Scoring Configuration
- **URL:** `/scoring/configs`
- **Method:** `POST`
- **Description:** Create a new scoring configuration
- **Request Body:**
  ```json
  {
    "questionnaire_id": 1,
    "name": "PHQ-9 Scoring",
    "description": "Standard scoring for PHQ-9 depression assessment",
    "scoring_method": "sum",
    "rules": {
      "type": "sum",
      "max_score": 27
    },
    "max_score": 27,
    "passing_score": 10
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "questionnaire_id": 1,
    "name": "PHQ-9 Scoring",
    "description": "Standard scoring for PHQ-9 depression assessment",
    "scoring_method": "sum",
    "rules": {
      "type": "sum",
      "max_score": 27
    },
    "max_score": 27,
    "passing_score": 10,
    "created_by_id": 1,
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

### Get Scoring Configurations for Questionnaire
- **URL:** `/scoring/questionnaires/:questionnaireId/configs`
- **Method:** `GET`
- **Description:** Get scoring configurations for a questionnaire
- **Response:**
  ```json
  [
    {
      "id": 1,
      "questionnaire_id": 1,
      "name": "PHQ-9 Scoring",
      "description": "Standard scoring for PHQ-9 depression assessment",
      "scoring_method": "sum",
      "rules": {
        "type": "sum",
        "max_score": 27
      },
      "max_score": 27,
      "passing_score": 10,
      "created_by_id": 1,
      "created_at": "2023-06-01T12:00:00Z"
    }
  ]
  ```

### Calculate Score for Response
- **URL:** `/scoring/responses/:responseId/calculate`
- **Method:** `POST`
- **Description:** Calculate score for a response
- **Response:**
  ```json
  {
    "response": {
      "id": 1,
      "questionnaire_id": 1,
      "respondent_email": "patient@example.com",
      "score": 10,
      "risk_level": "moderate",
      "completed_at": "2023-06-01T12:00:00Z"
    },
    "score": 10,
    "riskLevel": "moderate",
    "maxScore": 27,
    "passingScore": 10
  }
  ```

## AI Analysis

### Generate Analysis
- **URL:** `/ai-analysis/responses/:responseId`
- **Method:** `POST`
- **Description:** Generate AI analysis for a response
- **Response:**
  ```json
  {
    "id": 1,
    "response_id": 1,
    "analysis_text": "The respondent shows moderate symptoms of depression...",
    "recommendations": "1. Follow-up within the next week is recommended...",
    "confidence_score": 0.85,
    "model_used": "gpt-4",
    "created_by_id": 1,
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

### Get Analyses for Response
- **URL:** `/ai-analysis/responses/:responseId`
- **Method:** `GET`
- **Description:** Get AI analyses for a response
- **Response:**
  ```json
  [
    {
      "id": 1,
      "response_id": 1,
      "analysis_text": "The respondent shows moderate symptoms of depression...",
      "recommendations": "1. Follow-up within the next week is recommended...",
      "confidence_score": 0.85,
      "model_used": "gpt-4",
      "created_by_id": 1,
      "created_at": "2023-06-01T12:00:00Z"
    }
  ]
  ```

## Notifications

### Get User Notifications
- **URL:** `/notifications`
- **Method:** `GET`
- **Description:** Get notifications for current user
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "title": "New Response Received",
      "message": "A new response was submitted for your questionnaire \"Depression Assessment (PHQ-9)\".",
      "type": "new_response",
      "is_read": false,
      "link": "/responses/1",
      "created_at": "2023-06-01T12:00:00Z"
    }
  ]
  ```

### Get Unread Notifications
- **URL:** `/notifications/unread`
- **Method:** `GET`
- **Description:** Get unread notifications for current user
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "title": "New Response Received",
      "message": "A new response was submitted for your questionnaire \"Depression Assessment (PHQ-9)\".",
      "type": "new_response",
      "is_read": false,
      "link": "/responses/1",
      "created_at": "2023-06-01T12:00:00Z"
    }
  ]
  ```

### Mark Notification as Read
- **URL:** `/notifications/:id/read`
- **Method:** `PUT`
- **Description:** Mark notification as read
- **Response:**
  ```json
  {
    "id": 1,
    "user_id": 1,
    "title": "New Response Received",
    "message": "A new response was submitted for your questionnaire \"Depression Assessment (PHQ-9)\".",
    "type": "new_response",
    "is_read": true,
    "link": "/responses/1",
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:05:00Z"
  }
  ```

### Mark All Notifications as Read
- **URL:** `/notifications/read-all`
- **Method:** `PUT`
- **Description:** Mark all notifications as read
- **Response:**
  ```json
  {
    "message": "5 notifications marked as read",
    "count": 5
  }
  ```

### Create Notification (Admin Only)
- **URL:** `/notifications`
- **Method:** `POST`
- **Description:** Create a notification for a user
- **Request Body:**
  ```json
  {
    "user_id": 2,
    "title": "Important Update",
    "message": "There has been an important update to the system.",
    "type": "system",
    "link": "/dashboard"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "user_id": 2,
    "title": "Important Update",
    "message": "There has been an important update to the system.",
    "type": "system",
    "is_read": false,
    "link": "/dashboard",
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

## Statistics

### Get Questionnaire Statistics
- **URL:** `/statistics/questionnaires/:id`
- **Method:** `GET`
- **Description:** Get statistics for a questionnaire
- **Response:**
  ```json
  {
    "questionnaire": {
      "id": 1,
      "title": "Depression Assessment (PHQ-9)",
      "description": "The Patient Health Questionnaire (PHQ-9)"
    },
    "responses": {
      "total": 100,
      "completed": 95,
      "completion_rate": "95.00"
    },
    "scores": {
      "average": "12.50",
      "min": 0,
      "max": 27
    },
    "risk_levels": {
      "minimal": 20,
      "mild": 30,
      "moderate": 25,
      "moderately_severe": 15,
      "severe": 5
    },
    "completion_time": {
      "average_seconds": "180.50"
    },
    "trends": [
      {
        "date": "2023-06-01T00:00:00Z",
        "count": 10
      }
    ]
  }
  ```

### Get System Statistics (Admin Only)
- **URL:** `/statistics/system`
- **Method:** `GET`
- **Description:** Get system-wide statistics
- **Response:**
  ```json
  {
    "counts": {
      "users": 50,
      "questionnaires": 10,
      "responses": 500
    },
    "recent_activity": {
      "responses": [
        {
          "id": 1,
          "questionnaire_id": 1,
          "questionnaire_title": "Depression Assessment (PHQ-9)",
          "created_at": "2023-06-01T12:00:00Z",
          "score": 10,
          "risk_level": "moderate"
        }
      ]
    }
  }
  ```

## User Metrics

### Get User Metrics
- **URL:** `/user-metrics`
- **Method:** `GET`
- **Description:** Get metrics for current user
- **Response:**
  ```json
  {
    "id": 1,
    "user_id": 1,
    "login_count": 25,
    "questionnaires_created": 5,
    "responses_submitted": 10,
    "last_active_at": "2023-06-01T12:00:00Z"
  }
  ```

### Get Most Active Users (Admin Only)
- **URL:** `/user-metrics/most-active`
- **Method:** `GET`
- **Description:** Get most active users
- **Query Parameters:**
  - `limit` (optional): Number of users to return (default: 10)
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin",
      "login_count": 25,
      "questionnaires_created": 5,
      "responses_submitted": 10,
      "last_active_at": "2023-06-01T12:00:00Z"
    }
  ]
  ```

## QR Codes

### Generate QR Code
- **URL:** `/qr-codes/generate`
- **Method:** `POST`
- **Description:** Generate a QR code for a questionnaire
- **Request Body:**
  ```json
  {
    "questionnaire_id": 1,
    "expiration_days": 30,
    "max_scans": 100
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "questionnaire_id": 1,
    "code": "abc123",
    "url": "https://mindtrack.app/q/abc123",
    "qr_image_url": "https://mindtrack.app/qr/abc123.png",
    "expiration_date": "2023-07-01T12:00:00Z",
    "max_scans": 100,
    "scan_count": 0,
    "created_by_id": 1,
    "created_at": "2023-06-01T12:00:00Z"
  }
  ```

### Get QR Codes
- **URL:** `/qr-codes`
- **Method:** `GET`
- **Description:** Get all QR codes
- **Response:**
  ```json
  [
    {
      "id": 1,
      "questionnaire_id": 1,
      "questionnaire_title": "Depression Assessment (PHQ-9)",
      "code": "abc123",
      "url": "https://mindtrack.app/q/abc123",
      "qr_image_url": "https://mindtrack.app/qr/abc123.png",
      "expiration_date": "2023-07-01T12:00:00Z",
      "max_scans": 100,
      "scan_count": 0,
      "created_by_id": 1,
      "created_at": "2023-06-01T12:00:00Z"
    }
  ]
  ```

## Google Forms Integration

### Import Form Responses
- **URL:** `/google-forms/import`
- **Method:** `POST`
- **Description:** Import responses from a Google Form
- **Request Body:**
  ```json
  {
    "formId": "NLqA1svRhX5Pez1K6",
    "formUrl": "https://forms.gle/NLqA1svRhX5Pez1K6"
  }
  ```
- **Response:**
  ```json
  {
    "message": "5 responses imported successfully",
    "responses": [
      {
        "id": 1,
        "response_id": "response_1623456789_0",
        "form_id": "NLqA1svRhX5Pez1K6",
        "respondent_email": "user0@example.com",
        "created_at": "2023-06-01T12:00:00Z"
      }
    ]
  }
  ```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Not authorized to access the resource
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "error": "Error message"
}
```
