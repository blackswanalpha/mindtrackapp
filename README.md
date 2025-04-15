# MindTrack App

A full-stack monorepo project with Next.js frontend and Express.js API using Neon as the database provider.

## Project Structure

```
mindtrackapp/
├── apps/
│   ├── frontend/         # Next.js frontend application
│   └── api/              # Express.js API
├── package.json          # Root package.json for workspace management
└── vercel.json           # Vercel deployment configuration
```

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Neon PostgreSQL database (or any PostgreSQL database)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
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
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

### 4. Run the development server

```bash
# Run both frontend and API
npm run dev

# Run only frontend
npm run dev:frontend

# Run only API
npm run dev:api
```

## Deployment

This project is configured for deployment on Vercel. Connect your repository to Vercel and it will automatically deploy both the frontend and API.

Make sure to add the following environment variables in your Vercel project settings:

- `DATABASE_URL`: Your Neon database connection string

## License

[MIT](LICENSE)
