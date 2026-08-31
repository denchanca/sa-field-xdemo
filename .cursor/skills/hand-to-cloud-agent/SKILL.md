---
name: hand-to-cloud-agent
description: Hands a long-lived Ledgerly objective to a Cloud Agent. Use for /goal runs that must survive closing the laptop, or for /orchestrate planner/worker/verifier trees. Not for local /loop.
---

# Hand work to a Cloud Agent

Local `/loop` lives inside this session and dies when the laptop closes. A Cloud Agent can hold a `/goal` through a long-running session. `/orchestrate` staffs a tree of cloud agents.

## When to use

- `/goal` and the finish line will take longer than this sitting, or must continue after the laptop closes.
- `/orchestrate` — a root planner decomposes the work; workers are isolated; verifiers check the result.

## /goal in the cloud

Paste the `/goal` prompt from `lib/workflows/meta.ts` verbatim. Scope the finish line so it is verifiable (`npm test` green, `dsp_1043` suggested credit at or below $249). The agent judges when the objective is met; you review.

## /orchestrate

This one is a **plugin**, not built in. Before running it:

- `bun` on PATH
- `CURSOR_API_KEY` — a personal key or a team service account, not a team admin key
- Slack is optional and mirrors the run in a thread

The root planner writes no code. Workers are isolated; every handoff points up. Name `dispute-verifier` as the verifier for the dispute-resolution goal. Republish a task if a verifier fails.

## What you keep

You review and merge. Do not treat a green verifier as a ship decision. Do not use this skill for a local `/loop` on `/api/demo/job`.
