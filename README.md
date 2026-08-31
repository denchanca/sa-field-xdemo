# Ledgerly — Cursor demo app

Repo: [`denchanca/xdemo-app`](https://github.com/denchanca/xdemo-app).

**Ledgerly** is a fictional B2B billing and collections SaaS. You'll work inside a real, running product — invoices, disputes, collections, a dashboard — and use it to demo Cursor: Ask, inline edit, Agent, Design Mode, then `/multitask`, `/loop`, `/goal`, and `/orchestrate`. The operator persona is **Avery Quinn**, running the **Fieldnote Workspace** book. The demo clock is frozen at **23 August 2026**, so overdue math never drifts mid-demo.

Everything here is synthetic. No real companies, no real people, no real data.

---

## Requirements

You need **Node.js 20 LTS** and nothing else global.

**macOS**

1. Install Node 20 LTS — the installer from [nodejs.org](https://nodejs.org) (20.x LTS line), or with nvm: `nvm install 20 && nvm use 20`.
2. Verify: `node -v` prints `v20.x.x`.

**Windows (native — no WSL required)**

1. Install Node 20 LTS — the Windows installer from [nodejs.org](https://nodejs.org) (20.x LTS line), or `winget install OpenJS.NodeJS.LTS`.
2. Verify in PowerShell or Command Prompt: `node -v` prints `v20.x.x`.
3. All commands below run as-is in PowerShell. (If you already live in WSL2 that works too — it's optional, not a requirement.)

That's the whole toolchain on both platforms — no Deno, no Python, no database server, no global npm packages. Everything else arrives with `npm i`.

## Setup

```bash
git clone https://github.com/denchanca/xdemo-app.git
cd xdemo-app
npm i
npx prisma db seed
npm run dev
```

Open **http://localhost:43173**.

`npm test` shows **1 failed / 9 passed** on a clean checkout — that red test is a planted product bug used in the guided demo, not your environment. Leave it unless you are running the `/goal` or `/orchestrate` prompt. To reset everything after experimenting, ask the agent to run the `reset-demo-state` skill (or `npm run db:reset`).

## What's in the box

- **The app** — Next.js + TypeScript + Prisma/SQLite. Plans: Starter **$49** / Growth **$99** / Scale **$249** — the only prices in this product. Chrome: Dashboard, Invoices, Collections (overdue queue), Disputes, Workflows, Settings. Dark mode is the moon/sun control in the header.
- **`/workflows`** — the in-app prompt board for the four advanced Cursor commands. Each page has a copy button. `/analysis` redirects here.
- **`/api/demo/job`** — local invoice-backfill stand-in for `/loop` (idle → running → complete, ~45 seconds). Nothing is written to SQLite.
- **Agents** (`.cursor/agents/`): `ledgerly-reviewer`, `api-instrumenter`, `dispute-verifier`.
- **Skills** (`.cursor/skills/`): play skills `add-dashboard-widget`, `draft-collection-email`, `reset-demo-state`, `write-prisma-query`; workflow skills `choose-cursor-workflow`, `dispatch-subagents`, `hand-to-cloud-agent`.

The book includes the ten Fieldnote accounts plus fourteen extra accounts (Northstar Fabrication through Redwood Components) from `prisma/extra-accounts.ts`.

---

## Prompts — follow along

Paste these as-is, from the running app's `/workflows` pages or from here.

### Product demo (guided walkthrough)

**1. Ask — prices and overdue invoices.** Open chat in Ask mode:

```text
What are the only plan prices in this app, and which seeded invoices are overdue against the frozen demo clock? Cite the exact files you used. Do not invent any number that is not in the seed.
```

**2. Ask — how disputes work.**

```text
Walk me through how a dispute works in this app, end to end, as if I have never seen the codebase. Finish by telling me which parts are intentionally unfinished and why.
```

**3. Cmd-K (Ctrl-K on Windows) — one calm sentence.** Select the settings-page description input's default value, press Cmd-K:

```text
Rewrite this input's default value as one calm sentence explaining that the demo clock is frozen on 23 August 2026 so overdue math never drifts during a meeting. Keep it under 15 words.
```

**4. Agent — wire dispute resolution end to end.**

```text
Implement dispute resolution end to end: wire resolveDispute in lib/disputes/resolve.ts, make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note, and enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx. Any credit must be capped at the catalog plan price from lib/plans.ts. Do not touch tests/dispute-credit.test.ts, prisma/seed.ts, or any price.
```

**5. Design Mode — restyle the KPI cards.** With Design Mode active on the dashboard:

```text
Restyle the four KPI cards on this dashboard using only the existing design tokens in app/globals.css: a soft indigo accent on each card, stronger emphasis on the value, and a subtle hover lift. No new hex colors, no layout rewrite, no data or price changes — $49, $99, and $249 stay exactly as rendered. Touch components/kpi-card.tsx, and app/page.tsx only if you must. Two files max, nothing under lib/ or tests/. Show me the diff — I am undoing this after the demo.
```

(No Design Mode on your build? Paste the same prompt to the Agent — it names the files and constraints either way.)

### Advanced Cursor workflows

Four commands, four things you hand over. You still review the result.

1. **Many independent pieces?** `/multitask` hands over breadth.
2. **One objective with a clear finish?**
   - No — just waiting on it → `/loop` hands over time.
   - Yes — I am steering → `/goal` hands over the objective.
   - Yes — needs its own plan → `/orchestrate` hands over the plan itself.

Cloud Agents hold a `/goal` through a long-running session and are required for `/orchestrate`. Local `/loop` cannot survive closing the laptop.

**`/multitask` — hands over breadth**

```text
/multitask Add the same small request-log helper to Ledgerly's four independent API surfaces: invoices, disputes, Nudge, and Pulse.

Use the dispatch-subagents skill. Launch four api-instrumenter subagents in one parallel turn — one route each:
- app/api/invoices/route.ts and app/api/invoices/[id]/route.ts
- app/api/disputes/route.ts and app/api/disputes/[id]/route.ts
- app/api/mock/nudge/route.ts
- app/api/mock/pulse/route.ts

A shared helper may live under lib/. Each worker starts with clean context; the dispatch prompt must name the files, the helper, and the constraint. After the diffs land, launch the ledgerly-reviewer subagent. Do not touch prices, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. I will review one diff per task.
```

**`/loop` — hands over time**

```text
Start the local demo job, then hand over the checking.

1. POST http://127.0.0.1:43173/api/demo/job to start the invoice backfill (idle → running → complete over about 45 seconds).
2. /loop 10s Check GET http://127.0.0.1:43173/api/demo/job until status is complete, or until I stop the loop.

Do not add GitHub Actions. Do not write to the Ledgerly database. You still stop the loop; I still review the result.
```

**`/goal` — hands over the objective**

```text
/goal Make Ledgerly demo-complete for dispute resolution.

1. Cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price from lib/plans.ts.
2. Implement resolveDispute in lib/disputes/resolve.ts.
3. Make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note.
4. Enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx.
5. Keep going across turns until npm test is fully green and http://127.0.0.1:43173/disputes/dsp_1043 shows suggested credit at or below the Scale catalog price of $249.

Do not change prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. Do not invent a fourth price. When the checks pass, launch the dispute-verifier subagent to report evidence. I still review the result.
```

**`/orchestrate` — hands over the plan itself**

```text
/orchestrate Make Ledgerly demo-complete for dispute resolution. This is a plugin workflow — you need bun on PATH and a CURSOR_API_KEY (personal key or team service account, not a team admin key). Slack is optional.

Decompose the work. The root planner writes no code. Workers are isolated; every handoff points up. Staff at least:

- Worker: cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price. Do not touch tests/dispute-credit.test.ts or the seed.
- Worker: implement resolveDispute and POST /api/disputes/[id]/resolve.
- Worker: enable Accept / Decline on app/disputes/[id]/page.tsx.

Launch the dispute-verifier subagent as the verifier: it checks tests/dispute-credit.test.ts (or npm test), POSTs accept/decline against dsp_1043, and loads http://127.0.0.1:43173/disputes/dsp_1043. Republish a task if a verifier fails. I still review and merge. Do not invent a fourth price.
```

### Agents and subagents

| Kind | Name | When |
| --- | --- | --- |
| Agent | `ledgerly-reviewer` | After any code change. Diff-only review against catalog prices, seed names, and planted seams. |
| Agent | `api-instrumenter` | `/multitask` worker. One named API route per invocation. |
| Agent | `dispute-verifier` | `/goal` and `/orchestrate` finish line. Report evidence; write no product code. |
| Skill | `choose-cursor-workflow` | Pick the command from the two questions above. |
| Skill | `dispatch-subagents` | Many independent pieces. Launch Task subagents in one parallel turn. |
| Skill | `hand-to-cloud-agent` | `/goal` in the cloud, or `/orchestrate`. Local `/loop` cannot do this. |

---

## Ground rules

- Synthetic data only. Nothing here is real, and no external or client data comes in.
- The catalog prices ($49 / $99 / $249) and the frozen demo clock are fixed points of the Ledgerly world.
- "Not found" beats making it up: grounded answers with citations are the bar.

## Troubleshooting

- **Port 43173 busy** — a previous dev server is still running; stop it or `npm run dev` will fail fast.
- **Dashboard empty / data looks wrong** — `npm run db:reset` reseeds the book deterministically.
- **Windows is slow or file-watching flakes** — native Windows is fully supported; if you chose WSL2, keep the clone in the Linux home (not `/mnt/c`). Line endings are pinned to LF by `.gitattributes`, so no autocrlf surprises either way.
- **`npm test` is red** — one failure is shipped on purpose (see Setup above). Exactly 1 failed / 9 passed is healthy.
