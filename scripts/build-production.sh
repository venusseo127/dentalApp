#!/bin/bash

# Build script for production deployment
echo "🔨 Building SmileCare Dental for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build frontend
echo "📦 Building frontend..."
npm run build:frontend

# Build production server
echo "🚀 Building production server..."
esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js

echo "✅ Production build completed!"
echo ""
echo "📁 Build output:"
ls -la dist/
echo ""
echo "🚀 To start production server:"
echo "NODE_ENV=production node dist/server.js"