#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# jules.sh — CLI wrapper for the Jules REST API (v1alpha)
# BenderWire Group / B-CONTENT
#
# Usage:
#   ./scripts/jules.sh <command> [options]
#
# Commands:
#   create   <prompt-file|->   Create a new Jules session
#   list     [--state X]       List all sessions (optionally filter by state)
#   status   <session-id>      Get status of a specific session
#   approve  <session-id>      Approve a session's plan
#   message  <session-id> <msg> Send a message to a session
#   delete   <session-id>      Delete a session
#   persona  <name>            Create session from persona (stahl|glut|zink|schliff)
#   batch    <persona> [...]   Create multiple sessions from personas
#   active                     Show all non-terminal sessions
#   cleanup                    Delete all COMPLETED and FAILED sessions
#
# Environment:
#   JULES_API_KEY  — Required. Your Jules API key.
#
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
API_BASE="https://jules.googleapis.com/v1alpha"
REPO="MSCHKY/B-CONTENT"
BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROMPTS_DIR="$PROJECT_ROOT/docs/jules-prompts"
TRACKER_FILE="$PROJECT_ROOT/docs/jules-tracker.md"

# ── Early help (before validation) ────────────────────────────────────────────
if [[ "${1:-}" == "help" || "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  head -25 "${BASH_SOURCE[0]}" | tail -22
  exit 0
fi

# ── Load .env if JULES_API_KEY not set ────────────────────────────────────────
if [[ -z "${JULES_API_KEY:-}" ]]; then
  ENV_FILE="$PROJECT_ROOT/.env"
  if [[ -f "$ENV_FILE" ]]; then
    JULES_API_KEY=$(grep -E '^JULES_API_KEY=' "$ENV_FILE" | head -1 | cut -d'=' -f2-)
    export JULES_API_KEY
  fi
fi

# ── Validation ────────────────────────────────────────────────────────────────
if [[ -z "${JULES_API_KEY:-}" ]]; then
  echo "❌ JULES_API_KEY not set."
  echo "   Option 1: export JULES_API_KEY=your-key-here"
  echo "   Option 2: Add JULES_API_KEY=... to ${PROJECT_ROOT}/.env"
  exit 1
fi

# ── Helpers ───────────────────────────────────────────────────────────────────
_api() {
  local method="$1" endpoint="$2"
  shift 2
  curl -s -X "$method" \
    "${API_BASE}${endpoint}" \
    -H "X-Goog-Api-Key: ${JULES_API_KEY}" \
    -H "Content-Type: application/json" \
    "$@"
}

_json_field() {
  # Extract a field from JSON using python (available on macOS)
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('$1',''))" 2>/dev/null
}

_format_state() {
  case "$1" in
    QUEUED)                  echo "⏳ QUEUED" ;;
    PLANNING)                echo "🧠 PLANNING" ;;
    AWAITING_PLAN_APPROVAL)  echo "📋 AWAITING PLAN APPROVAL" ;;
    AWAITING_USER_FEEDBACK)  echo "💬 AWAITING USER FEEDBACK" ;;
    IN_PROGRESS)             echo "🔄 IN PROGRESS" ;;
    PAUSED)                  echo "⏸️  PAUSED" ;;
    FAILED)                  echo "❌ FAILED" ;;
    COMPLETED)               echo "✅ COMPLETED" ;;
    *)                       echo "❓ $1" ;;
  esac
}

_track_session() {
  local id="$1" title="$2" persona="${3:-manual}"
  local date=$(date +%Y-%m-%d)
  local time=$(date +%H:%M)

  # Append to tracker
  if [[ -f "$TRACKER_FILE" ]]; then
    echo "| ${date} ${time} | ${id} | ${persona} | ${title:0:60} | ⏳ QUEUED | — |" >> "$TRACKER_FILE"
    echo "📝 Tracked in jules-tracker.md"
  fi
}

# ── Commands ──────────────────────────────────────────────────────────────────

cmd_create() {
  local prompt_source="${1:--}"
  local title="${2:-}"
  local auto_approve="${3:-true}"

  # Read prompt from file or stdin
  local prompt_file
  if [[ "$prompt_source" == "-" ]]; then
    prompt_file=$(mktemp)
    echo "📝 Enter prompt (Ctrl+D to finish):"
    cat > "$prompt_file"
  elif [[ -f "$prompt_source" ]]; then
    prompt_file="$prompt_source"
  else
    echo "❌ File not found: $prompt_source"
    exit 1
  fi

  # Build JSON request body via Python (handles all escaping safely)
  local require_plan="false"
  [[ "$auto_approve" == "false" ]] && require_plan="true"

  local json_body
  json_body=$(python3 - "$prompt_file" "$BRANCH" "$require_plan" "$title" <<'PYEOF'
import json, sys

prompt_file, branch, require_plan, title = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

with open(prompt_file, 'r') as f:
    prompt = f.read().strip()

body = {
    "prompt": prompt,
    "sourceContext": {
        "source": "sources/github/MSCHKY/B-CONTENT",
        "githubRepoContext": {
            "startingBranch": branch
        }
    },
    "requirePlanApproval": require_plan == "true",
    "automationMode": "AUTO_CREATE_PR"
}

if title:
    body["title"] = title

print(json.dumps(body))
PYEOF
)

  # Cleanup temp file if we created one
  [[ "$prompt_source" == "-" ]] && rm -f "$prompt_file"

  echo "🚀 Creating Jules session..."
  local response
  response=$(_api POST "/sessions" -d "$json_body")

  local session_id session_state session_url
  session_id=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)
  session_state=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('state','UNKNOWN'))" 2>/dev/null)
  session_url=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('url',''))" 2>/dev/null)

  if [[ -z "$session_id" ]]; then
    echo "❌ Failed to create session:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    exit 1
  fi

  echo "✅ Session created!"
  echo "   ID:    ${session_id}"
  echo "   State: $(_format_state "$session_state")"
  echo "   URL:   ${session_url}"

  # Track the session
  _track_session "$session_id" "${title:-$(echo "$prompt" | head -1 | cut -c1-60)}" "${PERSONA_NAME:-manual}"
}

cmd_list() {
  local filter_state="${1:-}"

  echo "📋 Jules Sessions:"
  echo "─────────────────────────────────────────────────────────────"

  local response
  response=$(_api GET "/sessions")

  python3 -c "
import json, sys
data = json.load(sys.stdin)
sessions = data.get('sessions', [])
if not sessions:
    print('  (no sessions found)')
    sys.exit(0)

filter_state = '${filter_state}'.upper() if '${filter_state}' else None

for s in sessions:
    state = s.get('state', 'UNKNOWN')
    if filter_state and state != filter_state:
        continue
    sid = s.get('id', '?')
    title = s.get('title', '(no title)')[:50]
    created = s.get('createTime', '?')[:16]
    url = s.get('url', '')

    state_icons = {
        'QUEUED': '⏳', 'PLANNING': '🧠', 'AWAITING_PLAN_APPROVAL': '📋',
        'AWAITING_USER_FEEDBACK': '💬', 'IN_PROGRESS': '🔄', 'PAUSED': '⏸️',
        'FAILED': '❌', 'COMPLETED': '✅'
    }
    icon = state_icons.get(state, '❓')

    print(f'  {icon} {sid}  {title}')
    print(f'     State: {state}  |  Created: {created}')
    if url:
        print(f'     URL: {url}')
    print()
" <<< "$response"
}

cmd_status() {
  local session_id="$1"

  echo "🔍 Session: ${session_id}"
  echo "─────────────────────────────────────────────────────────────"

  local response
  response=$(_api GET "/sessions/${session_id}")

  python3 -c "
import json, sys
s = json.load(sys.stdin)
state = s.get('state', 'UNKNOWN')
title = s.get('title', '(no title)')
prompt = s.get('prompt', '')[:200]
created = s.get('createTime', '?')
updated = s.get('updateTime', '?')
url = s.get('url', '')
outputs = s.get('outputs', [])

state_icons = {
    'QUEUED': '⏳', 'PLANNING': '🧠', 'AWAITING_PLAN_APPROVAL': '📋',
    'AWAITING_USER_FEEDBACK': '💬', 'IN_PROGRESS': '🔄', 'PAUSED': '⏸️',
    'FAILED': '❌', 'COMPLETED': '✅'
}
icon = state_icons.get(state, '❓')

print(f'  Title:   {title}')
print(f'  State:   {icon} {state}')
print(f'  Created: {created}')
print(f'  Updated: {updated}')
if url:
    print(f'  URL:     {url}')
print(f'  Prompt:  {prompt}...' if len(s.get('prompt','')) > 200 else f'  Prompt:  {prompt}')

if outputs:
    print()
    print('  Outputs:')
    for o in outputs:
        print(f'    - {json.dumps(o, indent=2)[:200]}')
" <<< "$response"
}

cmd_approve() {
  local session_id="$1"

  echo "📋 Approving plan for session: ${session_id}..."

  local response
  response=$(_api POST "/sessions/${session_id}:approvePlan" -d '{}')

  echo "✅ Plan approved!"
  echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
}

cmd_message() {
  local session_id="$1"
  local message="$2"

  echo "💬 Sending message to session: ${session_id}..."

  local json_body
  json_body=$(python3 -c "import json,sys; print(json.dumps({'prompt': sys.argv[1]}))" "$message")

  local response
  response=$(_api POST "/sessions/${session_id}:sendMessage" -d "$json_body")

  echo "✅ Message sent!"
  echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
}

cmd_delete() {
  local session_id="$1"

  echo "🗑️  Deleting session: ${session_id}..."

  local response
  response=$(_api DELETE "/sessions/${session_id}")

  echo "✅ Session deleted."
}

cmd_cleanup() {
  echo "🧹 Cleaning up terminal sessions (COMPLETED + FAILED)..."
  echo "─────────────────────────────────────────────────────────────"

  local response
  response=$(_api GET "/sessions")

  # Get IDs of terminal sessions
  local ids
  ids=$(python3 -c "
import json, sys
data = json.load(sys.stdin)
sessions = data.get('sessions', [])
terminal = {'COMPLETED', 'FAILED'}
for s in sessions:
    if s.get('state', '') in terminal:
        print(s.get('id', ''))
" <<< "$response")

  if [[ -z "$ids" ]]; then
    echo "  (nothing to clean up)"
    return 0
  fi

  local count=0
  while IFS= read -r sid; do
    [[ -z "$sid" ]] && continue
    _api DELETE "/sessions/${sid}" > /dev/null
    count=$((count + 1))
    echo "  🗑️  Deleted: ${sid}"
  done <<< "$ids"

  echo ""
  echo "✅ Cleaned up ${count} sessions."
}

cmd_persona() {
  local persona_name
  persona_name=$(echo "$1" | tr '[:upper:]' '[:lower:]')
  local prompt_file="${PROMPTS_DIR}/${persona_name}.txt"

  if [[ ! -f "$prompt_file" ]]; then
    echo "❌ Persona not found: ${persona_name}"
    echo "   Available personas:"
    ls -1 "$PROMPTS_DIR"/*.txt 2>/dev/null | xargs -I{} basename {} .txt | sed 's/^/   - /'
    exit 1
  fi

  local persona_title
  case "$persona_name" in
    stahl)   persona_title="🔩 STAHL: Testing & QA" ;;
    glut)    persona_title="🔥 GLUT: Performance" ;;
    zink)    persona_title="🛡️ ZINK: Security" ;;
    schliff) persona_title="✨ SCHLIFF: UX Polish" ;;
    *)       persona_title="$persona_name" ;;
  esac

  PERSONA_NAME="$persona_name"
  echo "🎭 Deploying persona: ${persona_title}"
  cmd_create "$prompt_file" "${persona_title}" "true"
}

cmd_batch() {
  local personas=("$@")

  if [[ ${#personas[@]} -eq 0 ]]; then
    echo "❌ Usage: jules.sh batch <persona1> <persona2> ..."
    echo "   Example: jules.sh batch stahl zink"
    exit 1
  fi

  echo "🏭 Batch deployment: ${personas[*]}"
  echo "═══════════════════════════════════════════════════════════"

  for persona in "${personas[@]}"; do
    echo ""
    cmd_persona "$persona"
    echo ""
    # Small delay between API calls
    sleep 1
  done

  echo "═══════════════════════════════════════════════════════════"
  echo "✅ All ${#personas[@]} sessions created!"
}

cmd_active() {
  echo "🔄 Active Jules Sessions:"
  echo "─────────────────────────────────────────────────────────────"

  local response
  response=$(_api GET "/sessions")

  python3 -c "
import json, sys
data = json.load(sys.stdin)
sessions = data.get('sessions', [])

terminal = {'COMPLETED', 'FAILED'}
active = [s for s in sessions if s.get('state', '') not in terminal]

if not active:
    print('  (no active sessions)')
    sys.exit(0)

state_icons = {
    'QUEUED': '⏳', 'PLANNING': '🧠', 'AWAITING_PLAN_APPROVAL': '📋',
    'AWAITING_USER_FEEDBACK': '💬', 'IN_PROGRESS': '🔄', 'PAUSED': '⏸️'
}

for s in active:
    state = s.get('state', 'UNKNOWN')
    icon = state_icons.get(state, '❓')
    sid = s.get('id', '?')
    title = s.get('title', '(no title)')[:50]
    updated = s.get('updateTime', '?')[:16]
    url = s.get('url', '')

    print(f'  {icon} [{state}] {title}')
    print(f'     ID: {sid}  |  Updated: {updated}')
    if url:
        print(f'     URL: {url}')
    # Show action hint
    if state == 'AWAITING_PLAN_APPROVAL':
        print(f'     → Run: ./scripts/jules.sh approve {sid}')
    elif state == 'AWAITING_USER_FEEDBACK':
        print(f'     → Run: ./scripts/jules.sh message {sid} \"your feedback\"')
    print()
" <<< "$response"
}

# ── Main Dispatch ─────────────────────────────────────────────────────────────
main() {
  local cmd="${1:-help}"
  shift || true

  case "$cmd" in
    create)   cmd_create "$@" ;;
    list)     cmd_list "$@" ;;
    status)   cmd_status "$@" ;;
    approve)  cmd_approve "$@" ;;
    message)  cmd_message "$@" ;;
    delete)   cmd_delete "$@" ;;
    persona)  cmd_persona "$@" ;;
    batch)    cmd_batch "$@" ;;
    active)   cmd_active ;;
    cleanup)  cmd_cleanup ;;
    help|--help|-h)
      head -25 "${BASH_SOURCE[0]}" | tail -22
      ;;
    *)
      echo "❌ Unknown command: $cmd"
      echo "   Run: ./scripts/jules.sh help"
      exit 1
      ;;
  esac
}

main "$@"
