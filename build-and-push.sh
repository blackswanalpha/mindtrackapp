#!/bin/bash

# Exit on error
set -e

echo "🔧 Fixing build issues..."

# Install missing dependencies
echo "📦 Installing missing dependencies..."
cd apps/frontend
npm install recharts

# Create a .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local
fi

# Return to root directory
cd ../..

# Build the project
echo "🏗️ Building the project..."
npm run build

# Check if git is initialized
if [ ! -d .git ]; then
  echo "🔄 Initializing git repository..."
  git init
  git config --global user.email "user@example.com"
  git config --global user.name "MindTrack User"
fi

# Add all files to git
echo "➕ Adding files to git..."
git add .

# Commit changes
echo "✅ Committing changes..."
git commit -m "Initial commit with build fixes"

# Check if remote exists
if ! git remote | grep -q "origin"; then
  echo "🌐 Adding GitHub remote..."
  git remote add origin https://github.com/blackswanalpha/mindtrackapp.git
fi

echo "🚀 Pushing to GitHub..."
echo "Note: You may need to enter your GitHub credentials"
git push -u origin master

echo "✨ Done! Project built and pushed to GitHub."
