---
description: Run a specific agent, but allow it to propose a multi-agent plan and ask for consent to run all or a subset.
arguments:
  - name: agent
    description: Agent name (orchestrator|product|ux-ui|dev|tester-qa|analytics|marketing-growth|docs)
    required: true
  - name: prompt
    description: The task for that agent
    required: true
---
Use the **{{agent}}** subagent to tackle: "{{prompt}}"

If another agent would be better, briefly say why and propose a plan.
- If no consent detected, emit `__QUEUE__` only.
- If user consents ("run all" or "run selected: ..."), emit `__QUEUE__` (remaining) + `__NEXT_AGENT__` (first).

Always include `__STATUS__`.

