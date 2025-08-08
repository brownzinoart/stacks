---
description: Suggest a plan of agents for your thought/problem, ask for consent, then (optionally) run the plan or a selected subset.
arguments:
  - name: prompt
    description: The problem, idea, or task to tackle
    required: true
---
Team **mydawgs**: The user says: "{{prompt}}"

1) Act as **orchestrator**. Clarify constraints quickly.
2) Suggest a recommended sequence of agents (with reasons).
3) Present options explicitly:
   - "run all" (execute full sequence)
   - "run selected: <comma-separated agents>"
   - "tweak plan" (adjust and resuggest)
4) If the user has not yet consented, DO NOT start execution; output `__QUEUE__` but omit `__NEXT_AGENT__`.
5) If the user consents ("run all" or "run selected"), include BOTH:
   - `__QUEUE__` with the remaining agents (after the first)
   - `__NEXT_AGENT__` for the first agent to start

Always include a `__STATUS__` JSON capturing summary and decisions.

