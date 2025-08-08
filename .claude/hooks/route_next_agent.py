#!/usr/bin/env python3
import sys, json, re, os, datetime

BASE = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
QUEUE_PATH = os.path.join(BASE, ".claude", "run_queue.json")
LOG_PATH = os.path.join(BASE, ".claude", "run_log.jsonl")
THRESH = float(os.environ.get("MYDAWGS_CONF_THRESHOLD", "0.7"))

def safe_json_load(s):
    try:
        return json.loads(s)
    except Exception:
        import re
        m = re.search(r'(\{.*\})', s)
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                return None
    return None

def read_markers(transcript_path):
    status, queue, next_agent = None, None, None
    with open(transcript_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if "__STATUS__=" in line:
                status = safe_json_load(line.split("__STATUS__=",1)[1].strip().strip("`"))
            if "__QUEUE__=" in line:
                queue = safe_json_load(line.split("__QUEUE__=",1)[1].strip().strip("`"))
            if "__NEXT_AGENT__=" in line:
                next_agent = safe_json_load(line.split("__NEXT_AGENT__=",1)[1].strip().strip("`"))
    return status, queue, next_agent

def save_queue(q):
    os.makedirs(os.path.dirname(QUEUE_PATH), exist_ok=True)
    with open(QUEUE_PATH, "w", encoding="utf-8") as f:
        json.dump(q, f)

def load_queue():
    if not os.path.exists(QUEUE_PATH):
        return None
    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def append_log(entry):
    try:
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        entry["ts"] = datetime.datetime.utcnow().isoformat() + "Z"
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception as e:
        print(f"[router] log error: {e}", file=sys.stderr)

def pop_next_from_queue():
    q = load_queue() or {}
    agents = q.get("agents") or []
    if agents:
        nxt = agents.pop(0)
        save_queue({"agents": agents, "reason": q.get("reason","")})
        return nxt
    return None

def main():
    try:
        hook_input = json.load(sys.stdin)
    except Exception as e:
        print(f"[router] failed to parse hook input: {e}", file=sys.stderr)
        sys.exit(1)

    if hook_input.get("hook_event_name") != "SubagentStop":
        sys.exit(0)

    transcript = hook_input.get("transcript_path")
    if not transcript or not os.path.exists(transcript):
        print("[router] no transcript_path; skipping", file=sys.stderr)
        sys.exit(0)

    status, queue, next_agent = read_markers(transcript)

    # Log status for later retros
    if status:
        append_log({"status": status})

    # New queue overwrites old
    if queue and isinstance(queue, dict) and isinstance(queue.get("agents"), list):
        save_queue({"agents": queue.get("agents"), "reason": queue.get("reason","")})

    # Route by NEXT_AGENT first
    if next_agent:
        name = next_agent.get("name")
        conf = float(next_agent.get("confidence", 0) or 0)
        reason = next_agent.get("reason","")
        if name and name != "null" and conf >= THRESH:
            print(f"Use the {name} subagent to continue: {reason}", file=sys.stderr)
            sys.exit(2)

    # Otherwise pop from queue
    nxt = pop_next_from_queue()
    if nxt:
        print(f"Use the {nxt} subagent to continue: continuing per approved plan", file=sys.stderr)
        sys.exit(2)

    sys.exit(0)

if __name__ == "__main__":
    main()

