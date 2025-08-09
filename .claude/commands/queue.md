---
description: Show or modify the current execution queue for mydawgs.
arguments:
  - name: action
    description: "show" | "set"
    required: true
  - name: agents
    description: When action is "set", a comma-separated order to run, e.g., "product,ux-ui,dev"
    required: false
---

- If action is "show": read `.claude/run_queue.json` and present the current order.
- If action is "set": overwrite `.claude/run_queue.json` with the provided order.
  Always include a short `__STATUS__` summary.
