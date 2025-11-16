---
description: Audit the current repo and produce an alignment plan to realign structure with your goals. Asks clarifying questions if needed.
arguments:
  - name: goals
    description: Your goals/ideas (e.g., 'split API from UI, add SSR, ship v1 in 2 weeks, focus on SEO + accessibility').
    required: true
  - name: constraints
    description: Optional constraints (team size, budget, tech you must/must-not use, deadlines).
    required: false
---

Use the **align-architect** subagent to align this repository to the user's direction.

Inputs:

- Goals: "{{goals}}"
- Constraints: "{{constraints}}"

If critical unknowns exist, ask 3–6 sharp questions but proceed with reasonable defaults.
At the end, emit `__STATUS__`, a suggested `__QUEUE__`, and `__NEXT_AGENT__` to **product** by default.
