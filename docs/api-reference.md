# MindTrack API Reference

This document provides a reference for all API endpoints available in the MindTrack application.

## Base URL

All API endpoints are relative to the base URL:

```
/api/v1
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Register a new user

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // Optional, defaults to "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Get current user

```
GET /auth/me
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Logout

```
POST /auth/logout
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

## User Management

### User Endpoints

#### Get all users (admin only)

```
GET /users
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "healthcare_provider"
    }
  ]
}
```

#### Get user by ID

```
GET /users/:id
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Update user

```
PUT /users/:id
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "healthcare_provider" // Admin only
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "healthcare_provider"
  }
}
```

#### Delete user (admin only)

```
DELETE /users/:id
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

#### Update user password

```
PUT /users/:id/password
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

## Questionnaire Management

### Questionnaire Endpoints

#### Get all questionnaires

```
GET /questionnaires
```

**Query Parameters:**
- `is_active` (boolean): Filter by active status
- `is_public` (boolean): Filter by public status
- `is_template` (boolean): Filter by template status
- `created_by_id` (number): Filter by creator
- `organization_id` (number): Filter by organization
- `search` (string): Search by title or description

**Response:**
```json
{
  "questionnaires": [
    {
      "id": 1,
      "title": "Depression Assessment",
      "description": "Standard depression screening tool",
      "type": "assessment",
      "is_active": true,
      "is_public": false,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get questionnaire by ID

```
GET /questionnaires/:id
```

**Response:**
```json
{
  "questionnaire": {
    "id": 1,
    "title": "Depression Assessment",
    "description": "Standard depression screening tool",
    "type": "assessment",
    "is_active": true,
    "is_public": false,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create questionnaire

```
POST /questionnaires
```

**Request Body:**
```json
{
  "title": "Anxiety Assessment",
  "description": "Standard anxiety screening tool",
  "type": "assessment",
  "category": "mental_health",
  "estimated_time": 10,
  "is_active": true,
  "is_adaptive": false,
  "is_qr_enabled": true,
  "is_template": false,
  "is_public": false,
  "allow_anonymous": true,
  "requires_auth": false,
  "max_responses": 1000,
  "expires_at": "2024-12-31T23:59:59.999Z",
  "tags": ["anxiety", "screening"],
  "organization_id": 1,
  "questions": [
    {
      "text": "How often do you feel nervous?",
      "type": "single_choice",
      "required": true,
      "options": [
        {"value": 0, "label": "Not at all"},
        {"value": 1, "label": "Several days"},
        {"value": 2, "label": "More than half the days"},
        {"value": 3, "label": "Nearly every day"}
      ]
    }
  ]
}
```

**Response:**
```json
{
  "message": "Questionnaire created successfully",
  "questionnaire": {
    "id": 2,
    "title": "Anxiety Assessment",
    "description": "Standard anxiety screening tool",
    "type": "assessment",
    "is_active": true,
    "is_public": false,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update questionnaire

```
PUT /questionnaires/:id
```

**Request Body:**
```json
{
  "title": "Updated Anxiety Assessment",
  "is_active": false
}
```

**Response:**
```json
{
  "message": "Questionnaire updated successfully",
  "questionnaire": {
    "id": 2,
    "title": "Updated Anxiety Assessment",
    "description": "Standard anxiety screening tool",
    "type": "assessment",
    "is_active": false,
    "is_public": false,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete questionnaire

```
DELETE /questionnaires/:id
```

**Response:**
```json
{
  "message": "Questionnaire deleted successfully"
}
```

#### Get questionnaire with questions

```
GET /questionnaires/:id/questions
```

**Response:**
```json
{
  "questionnaire": {
    "id": 1,
    "title": "Depression Assessment",
    "description": "Standard depression screening tool",
    "type": "assessment",
    "is_active": true,
    "is_public": false,
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "questions": [
    {
      "id": 1,
      "text": "How often do you feel down or depressed?",
      "type": "single_choice",
      "required": true,
      "order_num": 1,
      "options": [
        {"value": 0, "label": "Not at all"},
        {"value": 1, "label": "Several days"},
        {"value": 2, "label": "More than half the days"},
        {"value": 3, "label": "Nearly every day"}
      ]
    }
  ]
}
```

## Question Management

### Question Endpoints

#### Create question

```
POST /questionnaires/:questionnaireId/questions
```

**Request Body:**
```json
{
  "text": "How often do you feel anxious?",
  "type": "single_choice",
  "required": true,
  "order_num": 2,
  "options": [
    {"value": 0, "label": "Not at all"},
    {"value": 1, "label": "Several days"},
    {"value": 2, "label": "More than half the days"},
    {"value": 3, "label": "Nearly every day"}
  ],
  "scoring_weight": 1
}
```

**Response:**
```json
{
  "message": "Question created successfully",
  "question": {
    "id": 2,
    "questionnaire_id": 1,
    "text": "How often do you feel anxious?",
    "type": "single_choice",
    "required": true,
    "order_num": 2
  }
}
```

#### Update question

```
PUT /questions/:id
```

**Request Body:**
```json
{
  "text": "Updated question text",
  "required": false
}
```

**Response:**
```json
{
  "message": "Question updated successfully",
  "question": {
    "id": 2,
    "questionnaire_id": 1,
    "text": "Updated question text",
    "type": "single_choice",
    "required": false,
    "order_num": 2
  }
}
```

#### Delete question

```
DELETE /questions/:id
```

**Response:**
```json
{
  "message": "Question deleted successfully"
}
```

#### Reorder questions

```
PUT /questionnaires/:questionnaireId/questions/reorder
```

**Request Body:**
```json
{
  "questions": [
    {"id": 1, "order_num": 2},
    {"id": 2, "order_num": 1}
  ]
}
```

**Response:**
```json
{
  "message": "Questions reordered successfully"
}
```

## Response Management

### Response Endpoints

#### Get all responses

```
GET /responses
```

**Query Parameters:**
- `questionnaire_id` (number): Filter by questionnaire
- `user_id` (number): Filter by user
- `organization_id` (number): Filter by organization
- `patient_identifier` (string): Filter by patient identifier
- `risk_level` (string): Filter by risk level
- `flagged_for_review` (boolean): Filter by flagged status

**Response:**
```json
{
  "responses": [
    {
      "id": 1,
      "questionnaire_id": 1,
      "patient_name": "Patient Name",
      "patient_email": "patient@example.com",
      "score": 10,
      "risk_level": "medium",
      "flagged_for_review": false,
      "completed_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get response by ID

```
GET /responses/:id
```

**Response:**
```json
{
  "response": {
    "id": 1,
    "questionnaire_id": 1,
    "patient_name": "Patient Name",
    "patient_email": "patient@example.com",
    "score": 10,
    "risk_level": "medium",
    "flagged_for_review": false,
    "completed_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create response

```
POST /responses
```

**Request Body:**
```json
{
  "questionnaire_id": 1,
  "patient_name": "Patient Name",
  "patient_email": "patient@example.com",
  "patient_age": 35,
  "patient_gender": "female",
  "organization_id": 1,
  "answers": [
    {
      "question_id": 1,
      "value": "2"
    },
    {
      "question_id": 2,
      "value": "1"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Response submitted successfully",
  "response": {
    "id": 1,
    "questionnaire_id": 1,
    "patient_name": "Patient Name",
    "patient_email": "patient@example.com",
    "score": 3,
    "risk_level": "low",
    "flagged_for_review": false,
    "completed_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get response with answers

```
GET /responses/:id/answers
```

**Response:**
```json
{
  "response": {
    "id": 1,
    "questionnaire_id": 1,
    "patient_name": "Patient Name",
    "patient_email": "patient@example.com",
    "score": 3,
    "risk_level": "low",
    "flagged_for_review": false,
    "completed_at": "2023-01-01T00:00:00.000Z",
    "answers": [
      {
        "id": 1,
        "question_id": 1,
        "value": "2",
        "question": {
          "id": 1,
          "text": "How often do you feel down or depressed?",
          "type": "single_choice",
          "options": [
            {"value": 0, "label": "Not at all"},
            {"value": 1, "label": "Several days"},
            {"value": 2, "label": "More than half the days"},
            {"value": 3, "label": "Nearly every day"}
          ]
        }
      },
      {
        "id": 2,
        "question_id": 2,
        "value": "1",
        "question": {
          "id": 2,
          "text": "How often do you feel anxious?",
          "type": "single_choice",
          "options": [
            {"value": 0, "label": "Not at all"},
            {"value": 1, "label": "Several days"},
            {"value": 2, "label": "More than half the days"},
            {"value": 3, "label": "Nearly every day"}
          ]
        }
      }
    ]
  }
}
```

#### Flag response for review

```
PUT /responses/:id/flag
```

**Request Body:**
```json
{
  "flagged": true
}
```

**Response:**
```json
{
  "message": "Response flagged successfully",
  "response": {
    "id": 1,
    "questionnaire_id": 1,
    "patient_name": "Patient Name",
    "patient_email": "patient@example.com",
    "score": 3,
    "risk_level": "low",
    "flagged_for_review": true,
    "completed_at": "2023-01-01T00:00:00.000Z"
  }
}
```

## AI Analysis

### AI Analysis Endpoints

#### Generate analysis for response

```
POST /ai-analysis/responses/:responseId
```

**Request Body:**
```json
{
  "prompt": "Analyze this questionnaire response and provide insights.",
  "model": "gpt-4"
}
```

**Response:**
```json
{
  "message": "Analysis generated successfully",
  "analysis": {
    "id": 1,
    "response_id": 1,
    "prompt": "Analyze this questionnaire response and provide insights.",
    "analysis": "Based on the answers provided, the patient shows signs of mild anxiety...",
    "recommendations": "1. Consider follow-up assessment in 2 weeks\n2. Provide resources for stress management",
    "risk_assessment": "Risk Level: Low\nPrimary Concerns: Anxiety, stress",
    "model_used": "gpt-4",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get analysis for response

```
GET /ai-analysis/responses/:responseId
```

**Response:**
```json
{
  "analysis": {
    "id": 1,
    "response_id": 1,
    "prompt": "Analyze this questionnaire response and provide insights.",
    "analysis": "Based on the answers provided, the patient shows signs of mild anxiety...",
    "recommendations": "1. Consider follow-up assessment in 2 weeks\n2. Provide resources for stress management",
    "risk_assessment": "Risk Level: Low\nPrimary Concerns: Anxiety, stress",
    "model_used": "gpt-4",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

## Organization Management

### Organization Endpoints

#### Get all organizations

```
GET /organizations
```

**Query Parameters:**
- `with_member_count` (boolean): Include member count

**Response:**
```json
{
  "organizations": [
    {
      "id": 1,
      "name": "Mental Health Clinic",
      "description": "Local mental health clinic",
      "type": "healthcare",
      "contact_email": "contact@clinic.com",
      "member_count": 5
    }
  ]
}
```

#### Get organization by ID

```
GET /organizations/:id
```

**Response:**
```json
{
  "organization": {
    "id": 1,
    "name": "Mental Health Clinic",
    "description": "Local mental health clinic",
    "type": "healthcare",
    "contact_email": "contact@clinic.com"
  }
}
```

#### Create organization

```
POST /organizations
```

**Request Body:**
```json
{
  "name": "New Clinic",
  "description": "New mental health clinic",
  "type": "healthcare",
  "contact_email": "contact@newclinic.com",
  "contact_phone": "123-456-7890",
  "address": "123 Main St",
  "logo_url": "https://example.com/logo.png",
  "settings": {
    "theme": "light",
    "notification_preferences": {
      "email": true,
      "sms": false
    }
  }
}
```

**Response:**
```json
{
  "message": "Organization created successfully",
  "organization": {
    "id": 2,
    "name": "New Clinic",
    "description": "New mental health clinic",
    "type": "healthcare",
    "contact_email": "contact@newclinic.com"
  }
}
```

#### Get organization members

```
GET /organizations/:id/members
```

**Response:**
```json
{
  "organization": {
    "id": 1,
    "name": "Mental Health Clinic"
  },
  "members": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "member_role": "admin"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "healthcare_provider",
      "member_role": "member"
    }
  ]
}
```

#### Add member to organization

```
POST /organizations/:id/members
```

**Request Body:**
```json
{
  "user_id": 3,
  "role": "member"
}
```

**Response:**
```json
{
  "message": "Member added successfully",
  "member": {
    "id": 1,
    "organization_id": 1,
    "user_id": 3,
    "role": "member"
  }
}
```

## Error Responses

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a message and optional details:

```json
{
  "message": "Error message",
  "error": {
    "name": "ErrorName",
    "details": {}
  }
}
```
