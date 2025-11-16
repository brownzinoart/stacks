---
description: Approve the recommended plan and (optionally) narrow to a subset. Starts execution immediately.
arguments:
  - name: agents
    description: Optional comma-separated list to run, e.g., "product,ux-ui,dev". If omitted, run all in the current queue.
    required: false
---

If `agents` is provided, set `__QUEUE__` to that exact order and begin.
If missing, load the existing queue from `.claude/run_queue.json` and begin.

Emit BOTH:

- `__QUEUE__` (remaining after the first)
- `__NEXT_AGENT__` (the first to start)
