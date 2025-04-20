#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build and deployment process..."

# Step 1: Build the frontend
echo "📦 Building the frontend..."
cd apps/frontend
npm run build
cd ../..

# Step 2: Add all changes to git
echo "📝 Adding all changes to git..."
git add .

# Step 3: Commit changes
echo "💾 Committing changes..."
git commit -m "Build: Updated with modern UI design and improved features"

# Step 4: Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin master

# Step 5: Deploy to Vercel (if vercel CLI is installed)
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "ℹ️ Vercel CLI not installed. Manual deployment required."
    echo "ℹ️ Your changes have been pushed to GitHub."
    echo "ℹ️ If you have GitHub integration enabled on Vercel, deployment should start automatically."
fi

echo "✅ Build and deployment process completed!"
