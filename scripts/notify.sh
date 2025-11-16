#!/bin/bash

# Audio notification script for task completion
# Usage: ./scripts/notify.sh "message" [voice]

MESSAGE="${1:-Task complete}"
VOICE="${2:-Samantha}"

# Check if we're on macOS and have the say command
if command -v say &> /dev/null; then
    say -v "$VOICE" "$MESSAGE"
    echo "🔊 Announced: $MESSAGE"
elif command -v espeak &> /dev/null; then
    # Linux fallback with espeak
    espeak "$MESSAGE" 2>/dev/null
    echo "🔊 Announced: $MESSAGE"
else
    # Universal fallback - terminal bell
    printf '\a'
    echo "🔔 Bell notification (no text-to-speech available)"
fi

# Also show a notification if possible
if command -v osascript &> /dev/null; then
    # macOS notification
    osascript -e "display notification \"$MESSAGE\" with title \"Stacks Dev\" sound name \"Glass\""
elif command -v notify-send &> /dev/null; then
    # Linux notification
    notify-send "Stacks Dev" "$MESSAGE"
fi