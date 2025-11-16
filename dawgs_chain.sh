#!/usr/bin/env bash
# dawgs_chain.sh - Headless runner for "mydawgs"
# Usage:
#   ./dawgs_chain.sh "Kick off: <your idea>"                 # suggests plan; no auto-run
#   PLAN="product,ux-ui,dev,tester-qa,analytics,docs" ./dawgs_chain.sh "Run plan"
# Env:
#   MYDAWGS_CONF_THRESHOLD=0.75  MAX_TURNS=12
set -euo pipefail

PROMPT="${1:-}"
if [[ -z "$PROMPT" ]]; then
  echo "Usage: $0 \"Your initial prompt\"" >&2
  exit 1
fi

turn=1
MAX_TURNS="${MAX_TURNS:-12}"

if [[ -n "${PLAN:-}" ]]; then
  echo "__QUEUE__={\"agents\":[\"${PLAN//,/\",\"}\"]}" > .claude/plan_seed.txt
  SEED_PROMPT="Apply the approved plan and start"
else
  SEED_PROMPT="$PROMPT"
fi

CURRENT_PROMPT="/dawgs prompt:\"$SEED_PROMPT\""

while [[ $turn -le $MAX_TURNS ]]; do
  echo "---- Turn $turn ----" >&2
  OUT_JSON="$(claude -p "$CURRENT_PROMPT" --output-format json)"
  echo "$OUT_JSON" > .claude/last_run.json

  CONTENT="$(echo "$OUT_JSON" | jq -r '.[-1].content // ""')"
  echo "$CONTENT"

  if [[ -n "${PLAN:-}" ]]; then
    CURRENT_PROMPT="Proceed with the first agent in the approved plan queue"
  else
    CURRENT_PROMPT="Continue if a NEXT_AGENT or queue is present; otherwise stop"
  fi

  turn=$((turn+1))
done

echo "Reached MAX_TURNS=$MAX_TURNS. Exiting." >&2

