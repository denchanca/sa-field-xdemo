---
name: choose-cursor-workflow
description: Picks /multitask, /loop, /goal, or /orchestrate from the shape of the work. Use when someone asks which advanced Cursor workflow to run, how to hand over breadth or time or an objective, or which prompt to paste from /workflows.
---

# Choose a Cursor workflow

The workflows are not interchangeable. Pick on the shape of the work: how many pieces, and what tells you it is done. You still review the result.

## Two questions

1. **Many independent pieces?**
   - Yes → `/multitask` — hands over **breadth**.
2. **One objective with a clear finish?**
   - No — just waiting on it → `/loop` — hands over **time**.
   - Yes — I am steering → `/goal` — hands over **the objective**.
   - Yes — needs its own plan → `/orchestrate` — hands over **the plan itself**.

Rule of thumb: if you can state a verifiable finish condition, use `/goal`. If the work must first be decomposed and staffed, use `/orchestrate`.

## What does not change

The human reviews the result and decides what ships. These commands change how much runs without sitting there, not who is accountable.

## Paste the matching prompt

Prompts live in `lib/workflows/meta.ts` and on `/workflows`. Paste the matching `prompt` **verbatim**. Do not invent a fifth workflow or a fourth catalog price.

| Command | Ledgerly target |
| --- | --- |
| `/multitask` | Four API surfaces via `dispatch-subagents` + `api-instrumenter` |
| `/loop` | `POST` then poll `/api/demo/job` |
| `/goal` | Dispute resolution until tests and `dsp_1043` pass |
| `/orchestrate` | Same outcome, planner/workers/`dispute-verifier` (plugin + `CURSOR_API_KEY`) |
