# mydawgs team memory (v6)

- Team name: **mydawgs**
- Goal: move fast with clarity; always return the smallest artifact that unblocks progress.
- Routing lines:
  - `__STATUS__=<json>` — summary, decisions, artifacts
  - `__QUEUE__=<json>` — approved sequence of agents to run (remaining order)
  - `__NEXT_AGENT__=<json>` — the immediate next agent (confidence gated)

Tips:
- Use `/dawgs` to propose a plan and wait for consent.
- Approve with `/approve` or by replying "run all" or "run selected: …".
- Tune auto-handoff threshold via env: `MYDAWGS_CONF_THRESHOLD=0.75`.
