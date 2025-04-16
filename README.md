# MindTrack - Mental Health Tracking Application

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://mindtrackapp.vercel.app)

MindTrack is a comprehensive full-stack application designed for creating, distributing, and analyzing mental health questionnaires. It allows healthcare providers to monitor patient mental health through standardized assessments, with features for questionnaire creation, response collection, analytics, and AI-powered insights.

## Features

- **User Authentication**: Secure login and registration with role-based access control
- **Questionnaire Management**: Create, edit, and manage questionnaires with various question types
- **Response Collection**: Collect and manage responses from patients
- **Scoring and Analysis**: Automatically score responses and assess risk levels
- **AI-Powered Insights**: Generate AI analysis of responses for deeper insights
- **Organization Management**: Create and manage organizations with member roles
- **Analytics Dashboard**: Visualize response data and trends

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js API with Node.js
- **Database**: PostgreSQL via Neon (cloud-based PostgreSQL)
- **Deployment**: Vercel for both frontend and API

## Project Structure

```
mindtrackapp/
├── apps/
│   ├── frontend/         # Next.js frontend application
│   └── api/              # Express.js API
├── docs/                 # Project documentation
├── package.json          # Root package.json for workspace management
└── vercel.json           # Vercel deployment configuration
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/blackswanalpha/mindtrackapp.git
cd mindtrackapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

For the API:
```bash
cp apps/api/.env.example apps/api/.env
```
Edit `apps/api/.env` and add your Neon database connection string.

For the frontend:
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 4. Run database migrations

```bash
cd apps/api
npm run migrate:up
```

### 5. Run the development server

```bash
# Run both frontend and API
npm run dev

# Run only frontend
npm run dev:frontend

# Run only API
npm run dev:api
```

## API Documentation

The API provides endpoints for:

- Authentication (login, register, logout)
- User management
- Questionnaire management
- Question management
- Response collection
- Scoring and analysis
- Organization management
- AI analysis

For detailed API documentation, see the [API Reference](docs/api-reference.md).

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

Make sure to add the following environment variables in your Vercel project settings:

- `DATABASE_URL`: Your Neon database connection string
- `JWT_SECRET`: Secret key for JWT authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
