# Ledgerly

Fictional B2B billing ops. Fieldnote Workspace. Operator **Avery Quinn**. Catalog is Starter **$49**, Growth **$99**, Scale **$249**. Demo clock is frozen at **23 August 2026**. Synthetic data only — no real companies.

Use it for two jumpable Cursor demos: a deck-aligned **201** track and a deeper **Advanced** track. Prompts live on `/workflows`; the presenter run-of-show is `demo-howto.md`.

## Run

Node 20. Nothing else global.

```bash
npm i
npx prisma db seed
npm run dev
```

Open **http://localhost:43173**.

`npm test` is **1 failed / 9 passed** on a clean tree — the red test is a planted credit-cap bug (`dsp_1043` claims $400 on a $249 Scale invoice). Reset with the `reset-demo-state` skill or `npm run db:reset`.

## App

Dashboard, Invoices, Collections, Disputes, Workflows, Settings. Extra book accounts are in `prisma/extra-accounts.ts`.

| Demo hook | Where |
| --- | --- |
| Workflow prompts | `/workflows` (`/analysis` redirects here) |
| `/loop` job | `POST` then `GET` `/api/demo/job` (~45s, not written to SQLite) |
| Agents | `.cursor/agents/` — `ledgerly-reviewer`, `api-instrumenter`, `dispute-verifier` |
| Skills | `.cursor/skills/` — play the book, or pick/dispatch a workflow |
| Presenter script | `demo-howto.md` — two tracks plus an independent beat library |

## Starter prompts

Ask:

```text
What are the only plan prices in this app, and which seeded invoices are overdue against the frozen demo clock? Cite the exact files you used. Do not invent any number that is not in the seed.
```

```text
Walk me through how a dispute works in this app, end to end, as if I have never seen the codebase. Finish by telling me which parts are intentionally unfinished and why.
```

Cmd-K on the settings description default:

```text
Rewrite this input's default value as one calm sentence explaining that the demo clock is frozen on 23 August 2026 so overdue math never drifts during a meeting. Keep it under 15 words.
```

Agent — dispute resolution:

```text
Implement dispute resolution end to end: wire resolveDispute in lib/disputes/resolve.ts, make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note, and enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx. Any credit must be capped at the catalog plan price from lib/plans.ts. Do not touch tests/dispute-credit.test.ts, prisma/seed.ts, or any price.
```

Design Mode on the dashboard KPI cards:

```text
Restyle the four KPI cards on this dashboard using only the existing design tokens in app/globals.css: a soft indigo accent on each card, stronger emphasis on the value, and a subtle hover lift. No new hex colors, no layout rewrite, no data or price changes — $49, $99, and $249 stay exactly as rendered. Touch components/kpi-card.tsx, and app/page.tsx only if you must. Two files max, nothing under lib/ or tests/. Show me the diff — I am undoing this after the demo.
```

## Pick a track

**201** follows the enablement deck:

1. Getting oriented with Ask
2. Rules, skills, and subagents
3. Model selection
4. Cloud Agents
5. Automations
6. `/multitask`, `/loop`, `/autopilot` (the current name for the deck's `/babysit`), and `/orchestrate`
7. Trust through tests, app behavior, verifiers, and human review

**Advanced** goes deeper on the Ledgerly scenarios:

- `/goal` holds dispute resolution as a durable objective
- `/multitask` dispatches isolated API workers
- `/loop` hands over local checking
- `/autopilot` drives an open PR to merge-ready
- `/orchestrate` staffs a planner / worker / verifier tree

Every beat is independent. Open `/workflows`, choose a track, and jump directly to the command you want. You still review the result.

## Workflow prompt library

| Shape | Command | Hands over | Track |
| --- | --- | --- | --- |
| Many independent pieces | `/multitask` | breadth | 201 + Advanced |
| Just waiting on it | `/loop` | time | 201 + Advanced |
| Open PR must become merge-ready | `/autopilot` | the pull request | 201 + Advanced |
| One durable finish line | `/goal` | the objective | Advanced |
| Needs its own plan first | `/orchestrate` | the plan itself | 201 + Advanced |

`/goal` can run locally or in the cloud. `/autopilot` is the supported name for the older `/babysit` PR workflow. `/orchestrate` is a plugin (`bun` + `CURSOR_API_KEY`). `/loop` is local; use Cloud subscriptions or Automations when work must survive closing the laptop.

**`/multitask`**

```text
/multitask Add the same small request-log helper to Ledgerly's four independent API surfaces: invoices, disputes, Nudge, and Pulse.

Use the dispatch-subagents skill. Launch four api-instrumenter subagents in one parallel turn — one route each:
- app/api/invoices/route.ts and app/api/invoices/[id]/route.ts
- app/api/disputes/route.ts and app/api/disputes/[id]/route.ts
- app/api/mock/nudge/route.ts
- app/api/mock/pulse/route.ts

A shared helper may live under lib/. Each worker starts with clean context; the dispatch prompt must name the files, the helper, and the constraint. After the diffs land, launch the ledgerly-reviewer subagent. Do not touch prices, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. I will review one diff per task.
```

**`/loop`**

```text
Start the local demo job, then hand over the checking.

1. POST http://127.0.0.1:43173/api/demo/job to start the invoice backfill (idle → running → complete over about 45 seconds).
2. /loop 10s Check GET http://127.0.0.1:43173/api/demo/job until status is complete, or until I stop the loop.

Do not add GitHub Actions. Do not write to the Ledgerly database. You still stop the loop; I still review the result.
```

**`/autopilot`**

Before this beat, prepare an open pull request for the current feature branch with one actionable review comment or a scoped failing check.

```text
/autopilot Keep the pull request for the current branch merge-ready.

Refresh the live PR state before every pass. Work in this order: merge conflicts, active unresolved review comments (including Bugbot), then failing required checks. Validate each finding before acting. Fix only issues caused by this PR and keep every change inside its scope.

Never change CI checks, workflows, the Ledgerly catalog, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts to get green. Stop and ask if branch intent is ambiguous or a billing, security, privacy, migration, or concurrency comment needs judgment. Report ready only when the PR is mergeable, required checks are green, and every active comment is triaged. Do not merge or enable auto-merge; I still review and merge.
```

**`/goal`**

```text
/goal Make Ledgerly demo-complete for dispute resolution.

1. Cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price from lib/plans.ts.
2. Implement resolveDispute in lib/disputes/resolve.ts.
3. Make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note.
4. Enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx.
5. Keep going across turns until npm test is fully green and http://127.0.0.1:43173/disputes/dsp_1043 shows suggested credit at or below the Scale catalog price of $249.

Do not change prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. Do not invent a fourth price. When the checks pass, launch the dispute-verifier subagent to report evidence. I still review the result.
```

**`/orchestrate`**

```text
/orchestrate Make Ledgerly demo-complete for dispute resolution. This is a plugin workflow — you need bun on PATH and a CURSOR_API_KEY (personal key or team service account, not a team admin key). Slack is optional.

Decompose the work. The root planner writes no code. Workers are isolated; every handoff points up. Staff at least:

- Worker: cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price. Do not touch tests/dispute-credit.test.ts or the seed.
- Worker: implement resolveDispute and POST /api/disputes/[id]/resolve.
- Worker: enable Accept / Decline on app/disputes/[id]/page.tsx.

Launch the dispute-verifier subagent as the verifier: it checks tests/dispute-credit.test.ts (or npm test), POSTs accept/decline against dsp_1043, and loads http://127.0.0.1:43173/disputes/dsp_1043. Republish a task if a verifier fails. I still review and merge. Do not invent a fourth price.
```

| Name | Role |
| --- | --- |
| `ledgerly-reviewer` | After a change. Catalog, seed names, planted seams. |
| `api-instrumenter` | One API route per `/multitask` worker. |
| `dispute-verifier` | `/goal` / `/orchestrate` finish line. No product code. |
| `choose-cursor-workflow` | Pick the command from the table above. |
| `dispatch-subagents` | Parallel Task launches. |
| `hand-to-cloud-agent` | Cloud `/goal`, `/autopilot`, or `/orchestrate`. |
| `autopilot` (built in) | Current PR-to-merge-ready skill; formerly `/babysit`. |
| `automate` (built in) | Draft a scheduled or event-triggered Cursor Automation. |

## Notes

- Prices and customer names only from `lib/plans.ts`, `prisma/seed.ts`, and `prisma/extra-accounts.ts`.
- Port 43173 busy: stop the old `npm run dev`. Empty dashboard: `npm run db:reset`.
