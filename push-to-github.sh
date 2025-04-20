#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting GitHub push process..."

# Step 1: Add all changes to git
echo "📝 Adding all changes to git..."
git add .

# Step 2: Commit changes
echo "💾 Committing changes..."
git commit -m "Update: Modern UI design with improved whitespace and typography"

# Step 3: Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin master

echo "✅ GitHub push process completed!"
echo "ℹ️ If you have GitHub integration enabled on Vercel, deployment should start automatically."
