#!/bin/bash

# Load port configuration
FRONTEND_PORT=4000
BACKEND_PORT=4001

echo "🚀 Starting Stacks development servers..."
echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔌 Backend:  http://localhost:$BACKEND_PORT"
echo "📱 Network:  http://192.168.86.190:$FRONTEND_PORT (for mobile testing)"

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:$FRONTEND_PORT | xargs -r kill -9 2>/dev/null || true
lsof -ti:$BACKEND_PORT | xargs -r kill -9 2>/dev/null || true

# Clean build cache to prevent errors
echo "🗑️  Cleaning build cache..."
rm -rf .next node_modules/.cache out

# Start backend in background
echo "🔌 Starting backend server on port $BACKEND_PORT..."
HOST=0.0.0.0 PORT=$BACKEND_PORT node api/server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "📱 Starting frontend server on port $FRONTEND_PORT..."
PORT=$FRONTEND_PORT npx next dev --turbopack -H 0.0.0.0 &
FRONTEND_PID=$!

echo "✅ Both servers started!"
echo "💡 Press Ctrl+C to stop both servers"

# Function to cleanup processes
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Set trap to cleanup on script termination
trap cleanup INT TERM

# Wait for either process to finish
wait