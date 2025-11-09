#!/bin/bash
# Clean dev server startup script (for Unix/Mac)
# This script kills any running Node processes, removes lock files, and starts the dev server

echo "🧹 Cleaning up..."

# Kill all Node processes
if pgrep -x "node" > /dev/null; then
    echo "   Stopping Node processes..."
    pkill -f node
    sleep 1
    echo "   ✓ Node processes stopped"
else
    echo "   ✓ No Node processes running"
fi

# Remove lock file
if [ -f ".next/dev/lock" ]; then
    rm -f .next/dev/lock
    echo "   ✓ Lock file removed"
else
    echo "   ✓ No lock file found"
fi

echo ""
echo "🚀 Starting dev server..."
echo ""

# Start the dev server
npm run dev

