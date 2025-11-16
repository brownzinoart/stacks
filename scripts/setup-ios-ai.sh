#!/bin/bash

# iOS AI Service Setup Script
# This script configures the environment for iOS-compatible AI services

set -e

echo "🚀 Setting up iOS-compatible AI services..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Please create it first by copying .env.example"
    echo "   cp .env.example .env.local"
    exit 1
fi

# Function to check if a variable exists in .env.local
check_env_var() {
    local var_name=$1
    if grep -q "^${var_name}=" .env.local; then
        return 0
    else
        return 1
    fi
}

# Function to add or update environment variable
set_env_var() {
    local var_name=$1
    local var_value=$2
    
    if check_env_var "$var_name"; then
        # Variable exists, update it
        sed -i.bak "s/^${var_name}=.*/${var_name}=${var_value}/" .env.local
        echo "✅ Updated ${var_name}"
    else
        # Variable doesn't exist, add it
        echo "${var_name}=${var_value}" >> .env.local
        echo "✅ Added ${var_name}"
    fi
}

echo "📋 Checking AI service configuration..."

# Check for server-side API keys
OPENAI_KEY=""
ANTHROPIC_KEY=""
GOOGLE_AI_KEY=""

if check_env_var "OPENAI_API_KEY"; then
    OPENAI_KEY=$(grep "^OPENAI_API_KEY=" .env.local | cut -d'=' -f2)
fi

if check_env_var "ANTHROPIC_API_KEY"; then
    ANTHROPIC_KEY=$(grep "^ANTHROPIC_API_KEY=" .env.local | cut -d'=' -f2)
fi

if check_env_var "GOOGLE_AI_API_KEY"; then
    GOOGLE_AI_KEY=$(grep "^GOOGLE_AI_API_KEY=" .env.local | cut -d'=' -f2)
fi

# Set up client-side keys for iOS compatibility
echo "🔧 Setting up client-side API keys for iOS..."

if [ -n "$OPENAI_KEY" ] && [ "$OPENAI_KEY" != "your-openai-api-key-here" ]; then
    set_env_var "NEXT_PUBLIC_OPENAI_API_KEY" "$OPENAI_KEY"
else
    echo "⚠️  OPENAI_API_KEY not found or not set. Add it to .env.local for OpenAI support."
fi

if [ -n "$ANTHROPIC_KEY" ] && [ "$ANTHROPIC_KEY" != "your-anthropic-api-key-here" ]; then
    set_env_var "NEXT_PUBLIC_ANTHROPIC_API_KEY" "$ANTHROPIC_KEY"
else
    echo "⚠️  ANTHROPIC_API_KEY not found or not set. Add it to .env.local for Claude support."
fi

if [ -n "$GOOGLE_AI_KEY" ] && [ "$GOOGLE_AI_KEY" != "your-google-ai-api-key-here" ]; then
    set_env_var "NEXT_PUBLIC_GOOGLE_AI_API_KEY" "$GOOGLE_AI_KEY"
else
    echo "⚠️  GOOGLE_AI_API_KEY not found or not set. Add it to .env.local for Gemini support."
fi

# Clean up backup file
rm -f .env.local.bak

echo ""
echo "✅ iOS AI Service setup complete!"
echo ""
echo "📱 Your app now supports both environments:"
echo "   • Web development: Uses API proxy routes"
echo "   • iOS app: Uses direct client-side API calls"
echo ""
echo "🔑 API Keys configured:"
[ -n "$OPENAI_KEY" ] && [ "$OPENAI_KEY" != "your-openai-api-key-here" ] && echo "   ✅ OpenAI (GPT-4o)"
[ -n "$ANTHROPIC_KEY" ] && [ "$ANTHROPIC_KEY" != "your-anthropic-api-key-here" ] && echo "   ✅ Anthropic (Claude)"
[ -n "$GOOGLE_AI_KEY" ] && [ "$GOOGLE_AI_KEY" != "your-google-ai-api-key-here" ] && echo "   ✅ Google AI (Gemini)"
echo ""
echo "🚀 Ready for iOS development and deployment!"
echo ""
echo "💡 Next steps:"
echo "   1. Test web development: npm run dev"
echo "   2. Build for iOS: npm run build && npm run ios:setup"
echo "   3. Test on device: Open Xcode and run on your device"