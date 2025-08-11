#!/bin/bash

# Test Production Build Script
echo "🔨 Building application..."
vite build
esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js

echo "📋 Checking build output..."
ls -la dist/

echo "🚀 Testing production server..."
PORT=3001 NODE_ENV=production FIREBASE_PROJECT_ID=dental-scheduling-test node dist/server.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "🔍 Testing health endpoint..."
if curl -f http://localhost:3001/health; then
    echo "✅ Production build working correctly!"
else
    echo "❌ Production build failed to start or respond"
    echo "Server logs:"
    ps aux | grep "node dist/index.js" || echo "No server process found"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null || true
echo "🧹 Cleanup completed"