#!/usr/bin/env bash
# jules-cli.sh — CLI wrapper for Jules REST API (v1alpha)
# Usage: ./scripts/jules-cli.sh <command> [args]
#
# Commands:
#   sources                     List connected GitHub repos
#   create <source> "<prompt>"  Create a new session/task
#   list                        List all sessions
#   status <session_id>         Get session status
#   activities <session_id>     List activities for a session
#   delegate <source> <file>    Batch-create sessions from a prompt file
#
# Environment:
#   JULES_API_KEY               Required. Get from jules.google.com/settings

set -euo pipefail

# ─── Config ───────────────────────────────────────────────────────────
BASE_URL="https://jules.googleapis.com/v1alpha"

if [[ -z "${JULES_API_KEY:-}" ]]; then
  # Try loading from .env in project root
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  ENV_FILE="$SCRIPT_DIR/../.env"
  if [[ -f "$ENV_FILE" ]]; then
    export "$(grep -E '^JULES_API_KEY=' "$ENV_FILE" | head -1)"
  fi
fi

if [[ -z "${JULES_API_KEY:-}" ]]; then
  echo "❌ JULES_API_KEY not set. Export it or add to .env"
  exit 1
fi

# ─── Helpers ──────────────────────────────────────────────────────────
_api() {
  local method="$1"
  local path="$2"
  shift 2

  curl -s -X "$method" \
    "${BASE_URL}${path}" \
    -H "X-Goog-Api-Key: ${JULES_API_KEY}" \
    -H "Content-Type: application/json" \
    "$@"
}

_json_pretty() {
  if command -v jq &>/dev/null; then
    jq .
  else
    cat
  fi
}

_header() {
  echo ""
  echo "━━━ $1 ━━━"
  echo ""
}

# ─── Commands ─────────────────────────────────────────────────────────

cmd_sources() {
  _header "Connected Sources (GitHub Repos)"
  _api GET "/sources" | _json_pretty
}

cmd_create() {
  local source="${1:?Usage: jules create <source> \"<prompt>\"}"
  local prompt="${2:?Usage: jules create <source> \"<prompt>\"}"

  _header "Creating Jules Session"
  echo "📦 Source: $source"
  echo "📝 Prompt: ${prompt:0:100}..."
  echo ""

  _api POST "/sessions" \
    -d "$(cat <<EOF
{
  "sourceContext": {
    "source": "$source"
  },
  "prompt": "$prompt"
}
EOF
)" | _json_pretty
}

cmd_list() {
  _header "All Sessions"
  _api GET "/sessions?pageSize=20" | _json_pretty
}

cmd_status() {
  local session_id="${1:?Usage: jules status <session_id>}"
  _header "Session Status: $session_id"
  _api GET "/sessions/${session_id}" | _json_pretty
}

cmd_activities() {
  local session_id="${1:?Usage: jules activities <session_id>}"
  _header "Activities for Session: $session_id"
  _api GET "/sessions/${session_id}/activities" | _json_pretty
}

cmd_delegate() {
  local source="${1:?Usage: jules delegate <source> <prompt_file>}"
  local prompt_file="${2:?Usage: jules delegate <source> <prompt_file>}"

  if [[ ! -f "$prompt_file" ]]; then
    echo "❌ Prompt file not found: $prompt_file"
    exit 1
  fi

  _header "Batch Delegation from: $prompt_file"
  echo "📦 Source: $source"
  echo ""

  local count=0
  local current_prompt=""

  while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip comments and empty lines
    [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue

    # Lines starting with "---" are delimiters between prompts
    if [[ "$line" == "---" ]]; then
      if [[ -n "$current_prompt" ]]; then
        count=$((count + 1))
        echo "🚀 Task $count: ${current_prompt:0:80}..."
        _api POST "/sessions" \
          -d "$(jq -n --arg s "$source" --arg p "$current_prompt" \
            '{sourceContext: {source: $s}, prompt: $p}')" | _json_pretty
        echo ""
        sleep 1  # Rate limit courtesy
      fi
      current_prompt=""
    else
      if [[ -n "$current_prompt" ]]; then
        current_prompt="$current_prompt
$line"
      else
        current_prompt="$line"
      fi
    fi
  done < "$prompt_file"

  # Handle last prompt (no trailing ---)
  if [[ -n "$current_prompt" ]]; then
    count=$((count + 1))
    echo "🚀 Task $count: ${current_prompt:0:80}..."
    _api POST "/sessions" \
      -d "$(jq -n --arg s "$source" --arg p "$current_prompt" \
        '{sourceContext: {source: $s}, prompt: $p}')" | _json_pretty
  fi

  echo ""
  echo "✅ Delegated $count tasks to Jules."
}

cmd_help() {
  cat <<'HELP'
Jules CLI — Programmatic control for Google Jules AI Agent

COMMANDS:
  sources                       List connected GitHub repos
  create <source> "<prompt>"    Create a new coding task
  list                          List recent sessions
  status <session_id>           Get session details
  activities <session_id>       List session activities/events
  delegate <source> <file>      Batch-create tasks from prompt file
  help                          Show this help

EXAMPLES:
  # List your repos
  jules sources

  # Create a task
  jules create "github:MSCHKY/B-CONTENT" "Add Playwright tests for /api/generate endpoint"

  # Batch delegate overnight tasks
  jules delegate "github:MSCHKY/B-CONTENT" docs/jules-overnight.txt

ENVIRONMENT:
  JULES_API_KEY    Required. Get from jules.google.com/settings
                   Can also be set in .env file at project root

HELP
}

# ─── Router ───────────────────────────────────────────────────────────
case "${1:-help}" in
  sources)    cmd_sources ;;
  create)     cmd_create "${2:-}" "${3:-}" ;;
  list)       cmd_list ;;
  status)     cmd_status "${2:-}" ;;
  activities) cmd_activities "${2:-}" ;;
  delegate)   cmd_delegate "${2:-}" "${3:-}" ;;
  help|--help|-h) cmd_help ;;
  *)
    echo "❌ Unknown command: $1"
    echo "Run 'jules help' for usage."
    exit 1
    ;;
esac
