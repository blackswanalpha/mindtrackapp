# MindTrack Deployment Guide

This guide provides instructions for deploying the MindTrack application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [GitHub](https://github.com) account
3. A [Neon](https://neon.tech) database (or any PostgreSQL database)

## Setup Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

1. `DATABASE_URL`: Your PostgreSQL connection string
2. `JWT_SECRET`: A secret key for JWT token generation
3. `EMAIL_SERVICE`: Email service provider (e.g., "gmail")
4. `EMAIL_USER`: Email username/address
5. `EMAIL_PASSWORD`: Email password or app-specific password
6. `FRONTEND_URL`: URL of the frontend application

## Deployment Steps

### Manual Deployment

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **Import your project in Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Set the Framework Preset to "Other"
     - Set the Root Directory to "/"
     - Add the environment variables mentioned above
   - Click "Deploy"

### Automatic Deployment with GitHub Actions

1. **Set up GitHub Secrets**

   In your GitHub repository, go to Settings > Secrets and add the following secrets:

   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. **Push your code to GitHub**

   The GitHub Actions workflow will automatically deploy your application to Vercel when you push to the master branch.

## Database Setup

After deployment, you need to set up the database:

1. **Run the database setup script**

   ```bash
   # Using Vercel CLI
   vercel env pull .env.production
   source .env.production
   cd apps/api
   npm run setup-neon-db
   ```

   Alternatively, you can run the setup script from the Vercel dashboard:

   - Go to your project in the Vercel dashboard
   - Click on "Functions"
   - Find the API function
   - Click on "Logs"
   - Run the setup command in the console

## Verifying Deployment

1. **Check the frontend**

   Visit your deployed frontend URL (e.g., `https://mindtrack.vercel.app`)

2. **Check the API**

   Visit the API health endpoint (e.g., `https://mindtrack.vercel.app/api/v1/health`)

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify that the `DATABASE_URL` environment variable is correct
2. Check if your database allows connections from Vercel's IP addresses
3. For Neon databases, make sure SSL is enabled in the connection string

### API Not Found

If the API endpoints return 404:

1. Check the routes in `vercel.json`
2. Verify that the API server is running
3. Check the Vercel function logs for errors

### Email Sending Issues

If emails are not being sent:

1. Verify the email service credentials
2. Check if your email provider allows sending from third-party applications
3. For Gmail, you may need to use an app-specific password

## Monitoring and Logs

- **View logs**: Go to your project in the Vercel dashboard and click on "Functions" > "Logs"
- **Set up monitoring**: Consider setting up monitoring tools like Sentry or LogRocket

## Updating the Deployment

To update your deployment:

1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically deploy the changes

## Rollback

To rollback to a previous deployment:

1. Go to your project in the Vercel dashboard
2. Click on "Deployments"
3. Find the deployment you want to rollback to
4. Click on the three dots and select "Promote to Production"
