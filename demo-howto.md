# Ledgerly demo howto

Presenter run-of-show. Not a course. Two tracks, independent beats. You still review every result.

The book is Fieldnote Workspace. Operator **Avery Quinn**. Catalog is Starter **$49**, Growth **$99**, Scale **$249**. Clock is frozen at **23 August 2026**. Prompts also live on `/workflows`. Source of truth for workflow prompts is `lib/workflows/meta.ts`.

## Jump menu

**Track 1 — 201**

1. [Getting oriented](#1-the-book-2-min) — book + Ask
2. [Customize the Agent](#6-customize-the-agent-3-min) — rules, skills, subagents
3. [Model selection](#7-model-selection-2-min)
4. [Cloud Agents](#8-cloud-agents-3-min)
5. [Automations](#9-automations-3-min)
6. [Choose one 201 workflow](#10-workflow-beat-library) — `/multitask`, `/loop`, `/autopilot`, or `/orchestrate`
7. [Trust and verification](#11-trust-and-verification-3-min)

**Track 2 — Advanced**

1. [The planted dispute](#1-the-book-2-min)
2. Pick one or more local surfaces: [Ask](#2-ask-3-min), [Cmd-K](#3-cmd-k-2-min), [Agent](#4-agent--wire-resolve-58-min), [Design Mode](#5-design-mode-3-min)
3. [Choose an advanced workflow](#10-workflow-beat-library) — `/goal`, `/multitask`, `/loop`, `/autopilot`, or `/orchestrate`
4. [Verify](#11-trust-and-verification-3-min) and [reset](#12-close)

Jump directly to any beat. Each section states its prerequisite; you do not need to run earlier sections first.

---

## Before you start

```bash
npm i
npx prisma db seed
npm run dev
```

Open **http://localhost:43173**.

Check shipped state:

- `npm test` is **1 failed / 9 passed**
- [http://127.0.0.1:43173/disputes/dsp_1043](http://127.0.0.1:43173/disputes/dsp_1043) shows **Suggested credit $400.00** in red, above the Scale price of **$249**
- Accept credit / Decline are disabled

If the credit reads $249.00 or the suite is all green, a prior run capped `lib/dispute-credit.ts`. Restore with the `reset-demo-state` skill, or:

```bash
git checkout -- lib/dispute-credit.ts
npx prisma db seed
```

Port 43173 busy: stop the old `npm run dev`. Empty dashboard: `npm run db:reset`.

---

## Through-line

> This is a real billing book, not a slide deck. Avery Quinn runs Fieldnote. Three prices, frozen clock, one planted dispute. The 201 track maps Cursor's platform concepts onto this book. The Advanced track goes deeper on durable goals, parallel workers, PR supervision, and verifier loops. I still review what ships.

---

## 1. The book (2 min)

**Open:** Dashboard, then Collections, then [dsp_1043](http://127.0.0.1:43173/disputes/dsp_1043).

**Do:** Point at the catalog line on the dashboard, the overdue queue, the Resolution panel.

**Say:**

> Fieldnote Workspace. Avery Quinn. Starter $49, Growth $99, Scale $249 — those are the only prices. The clock is frozen on 23 August 2026 so overdue math never drifts mid-demo.
>
> Cobalt Goods, INV-1043, Scale. They opened dsp_1043: billed on Scale, they say the signed order is Growth, and they are claiming $400 back. The invoice is $249. The panel suggests a $400 credit. That is wrong on purpose. Ledgerly must never credit more than it charged.

**Look for:** Red **Suggested credit $400.00**. Copy: *Above the Scale catalog price of $249.00.* Buttons disabled. Reason: *Billed on Scale. The signed order is Growth.*

---

## 2. Ask (3 min)

**Open:** Cursor chat in **Ask** mode. Leave the app on the dashboard or the dispute.

**Say:**

> Ask mode reads the repo. It does not edit. I am going to ask it for the prices and the overdue invoices, then how a dispute works — including what is unfinished.

**Paste:**

```text
What are the only plan prices in this app, and which seeded invoices are overdue against the frozen demo clock? Cite the exact files you used. Do not invent any number that is not in the seed.
```

**Then:**

```text
Walk me through how a dispute works in this app, end to end, as if I have never seen the codebase. Finish by telling me which parts are intentionally unfinished and why.
```

**Look for:** Citations to `lib/plans.ts`, `prisma/seed.ts`, `lib/clock.ts`. INV-1043 / Cobalt Goods among the overdue set. The resolve stub named: `lib/disputes/resolve.ts`, the resolve API route, the panel buttons.

**Say after it answers:**

> Grounded in the seed. It did not invent a fourth price. And it found the Agent seam without me pointing at the file.

---

## 3. Cmd-K (2 min)

**Open:** [Settings](http://127.0.0.1:43173/settings). Select the timezone input default: `UTC — demo clock is frozen`.

**Say:**

> Inline edit. I am not asking the Agent to roam the repo. One field, one sentence, under 15 words.

**Paste** into Cmd-K (Ctrl-K on Windows):

```text
Rewrite this input's default value as one calm sentence explaining that the demo clock is frozen on 23 August 2026 so overdue math never drifts during a meeting. Keep it under 15 words.
```

**Look for:** The input default rewrites in place. Leave the webhook **Tab** seam alone unless that is a side beat.

**Say:**

> That TODO in the file is intentional. Same idea as the dispute panel — a small, named seam.

---

## 4. Agent — wire resolve (5–8 min)

Skip this beat if the advanced command will be `/goal` or `/orchestrate` (same work, longer leash).

**Open:** Agent. Keep [dsp_1043](http://127.0.0.1:43173/disputes/dsp_1043) visible.

**Say:**

> Agent can edit. I am going to finish dispute resolution — helper, API, buttons — and cap any credit at the catalog price. I am not touching the planted test or the seed.

**Paste:**

```text
Implement dispute resolution end to end: wire resolveDispute in lib/disputes/resolve.ts, make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note, and enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx. Any credit must be capped at the catalog plan price from lib/plans.ts. Do not touch tests/dispute-credit.test.ts, prisma/seed.ts, or any price.
```

**Look for:** Accept / Decline enabled. A reviewer note can persist. Suggested credit may still read **$400** — this prompt does not require editing `lib/dispute-credit.ts`. That cap is the `/goal` / `/orchestrate` finish line.

**Say:**

> I review the diff before it is real. The $400 suggestion can stay red until we decide to cap it.

---

## 5. Design Mode (3 min)

**Open:** Dashboard. Design Mode if you have it; same prompt in Agent if you do not.

**Say:**

> Visual only. Existing tokens. I am undoing this when we are done. $49, $99, and $249 stay on the cards.

**Paste:**

```text
Restyle the four KPI cards on this dashboard using only the existing design tokens in app/globals.css: a soft indigo accent on each card, stronger emphasis on the value, and a subtle hover lift. No new hex colors, no layout rewrite, no data or price changes — $49, $99, and $249 stay exactly as rendered. Touch components/kpi-card.tsx, and app/page.tsx only if you must. Two files max, nothing under lib/ or tests/. Show me the diff — I am undoing this after the demo.
```

**Look for:** Two files max. No new hex. No data change. Show the diff, then revert before the next demo.

**Say:**

> Design Mode is not a product decision. The catalog did not move.

---

## 6. Customize the Agent (3 min)

**Prerequisite:** None. This beat is read-only.

**Open side by side:**

- `.cursor/rules/ledgerly.mdc`
- `.cursor/skills/choose-cursor-workflow/SKILL.md`
- `.cursor/agents/api-instrumenter.md`

**Say:**

> Rules are always-on guardrails: three prices, synthetic names, and planted seams. Skills are on-demand workflows: choose a track, dispatch workers, hand work to cloud. Subagents are focused workers with clean context. The parent has to send the files, constraints, and finish condition in every dispatch.

**Show:** The rule blocks invented prices. The skill distinguishes `/autopilot` from `/goal`. The worker is allowed to touch one named API surface and nothing else.

**Land:** Rules constrain every beat; skills encode repeatable methods; subagents isolate work and context.

---

## 7. Model selection (2 min)

**Prerequisite:** Open a new Agent chat so the model picker is visible.

**Say:**

> Use the strongest reasoning model for exploration, planning, and coordinating subagents. Use a faster focused model for a worker with one route and one acceptance test. Model choice follows task shape; it is not one model everywhere.

**Do:**

1. Show the model picker on the parent chat and choose a current high-reasoning option.
2. Use `/multitask` as the example where focused workers may use a faster option.
3. Do not hard-code model names in the repo; availability and enterprise policy can change.

**Land:** High reasoning plans and coordinates. Focused models execute bounded tasks. Verification stays independent of model choice.

---

## 8. Cloud Agents (3 min)

**Prerequisite:** The branch and required setup must be available remotely. `.cursor/environment.json` installs dependencies, seeds the database, and starts the app on port 43173.

**Say:**

> Same agent, its own computer. The cloud environment is isolated, persists when my laptop closes, and returns reviewable work plus proof. In the 201 track, `/autopilot` and `/orchestrate` can outlive a local sitting.

**Do:** Hand off one bounded objective with a verifiable finish.

- **201:** `/autopilot` keeps an existing PR merge-ready; `/orchestrate` runs planner, workers, and verifier in isolated environments.
- **Advanced:** `/goal` can make dispute resolution pass its test and browser check. `/autopilot` and `/orchestrate` remain available.

**Look for:** Install succeeds, the app runs on 43173, checks run, and the result includes a diff plus test/browser evidence.

**Land:** Cloud changes where work runs and how long it can persist. It does not remove the human review gate.

---

## 9. Automations (3 min)

**Prerequisite:** Use Cursor's Agents Window. This beat opens the Automations editor; it does not add a GitHub Actions file.

**Say:**

> `/loop` repeats inside a session. A Cursor Automation is event- or schedule-driven and can survive the laptop closing. First prove the workflow while watching it; then automate it.

**Use `/automate` and draft:**

```text
Create a Cursor Automation for this repository. Trigger when a pull request is opened or updated. Review the diff for Ledgerly's catalog prices, synthetic customer names, planted dispute seams, and unrelated changes. Leave a concise review comment with evidence. Do not modify product code, tests, the seed, CI configuration, or workflows.
```

**Do:** Review the draft, then open the Automations editor. Select the repository and PR trigger there. Do not save or enable it unless that is part of the live demo.

**Land:** Automations are repeatable cloud workflows. They are not local shell loops and they do not require adding CI files to this repo.

---

## 10. Workflow beat library

**Open:** [http://127.0.0.1:43173/workflows](http://127.0.0.1:43173/workflows). Copy the prompt from the page, or paste from below.

**Say:**

> The 201 track has four deck-aligned workflows using the current product name `/autopilot` for the deck's `/babysit`. The Advanced track adds `/goal`. I pick on the shape of the work. I still review.

| If the work is… | Command | Hands over | Track |
| --- | --- | --- | --- |
| Many independent pieces | `/multitask` | breadth | 201 + Advanced |
| Just waiting on a job | `/loop` | time | 201 + Advanced |
| An open PR must become merge-ready | `/autopilot` | the pull request | 201 + Advanced |
| One durable finish line | `/goal` | the objective | Advanced |
| Needs its own plan first | `/orchestrate` | the plan itself | 201 + Advanced |

`/loop` is local. `/goal` can run locally or in the cloud. `/autopilot` needs a real open PR. `/orchestrate` is a plugin (`bun` + `CURSOR_API_KEY`).

Run one, or jump directly to the one named in the deck discussion.

### 10a. `/multitask` — breadth

**Say:**

> Four API surfaces, no shared diff. I am not going to sit and do them in series. Four workers, then a reviewer. I read one diff per task.

**Paste** (verbatim from `lib/workflows/meta.ts`):

```text
/multitask Add the same small request-log helper to Ledgerly's four independent API surfaces: invoices, disputes, Nudge, and Pulse.

Use the dispatch-subagents skill. Launch four api-instrumenter subagents in one parallel turn — one route each:
- app/api/invoices/route.ts and app/api/invoices/[id]/route.ts
- app/api/disputes/route.ts and app/api/disputes/[id]/route.ts
- app/api/mock/nudge/route.ts
- app/api/mock/pulse/route.ts

A shared helper may live under lib/. Each worker starts with clean context; the dispatch prompt must name the files, the helper, and the constraint. After the diffs land, launch the ledgerly-reviewer subagent. Do not touch prices, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. I will review one diff per task.
```

**Look for:** Four `api-instrumenter` launches in one turn. A shared helper under `lib/`. `ledgerly-reviewer` after the diffs. No price or seed edits.

### 10b. `/loop` — time

**Say:**

> I would otherwise sit and watch a 45-second job. I start it, then hand over the checking. I still stop the loop.

**Paste:**

```text
Start the local demo job, then hand over the checking.

1. POST http://127.0.0.1:43173/api/demo/job to start the invoice backfill (idle → running → complete over about 45 seconds).
2. /loop 10s Check GET http://127.0.0.1:43173/api/demo/job until status is complete, or until I stop the loop.

Do not add GitHub Actions. Do not write to the Ledgerly database. You still stop the loop; I still review the result.
```

**Look for:** `idle` → `running` → `complete`. Nothing written to SQLite. No GitHub Actions.

### 10c. `/autopilot` — the pull request

The 201 deck calls this `/babysit`. The current supported name is `/autopilot`.

**Prerequisite:** Prepare an open pull request for the current feature branch with one actionable review comment or a scoped failing required check. Do not run this beat on `main`.

**Say:**

> This is not a generic goal. It is one real pull request. Autopilot refreshes live state, handles conflicts before comments before CI, and stops at merge-ready. I still merge.

**Paste:**

```text
/autopilot Keep the pull request for the current branch merge-ready.

Refresh the live PR state before every pass. Work in this order: merge conflicts, active unresolved review comments (including Bugbot), then failing required checks. Validate each finding before acting. Fix only issues caused by this PR and keep every change inside its scope.

Never change CI checks, workflows, the Ledgerly catalog, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts to get green. Stop and ask if branch intent is ambiguous or a billing, security, privacy, migration, or concurrency comment needs judgment. Report ready only when the PR is mergeable, required checks are green, and every active comment is triaged. Do not merge or enable auto-merge; I still review and merge.
```

**Look for:** Fresh PR state on every pass. Conflicts first, then active comments, then CI. Findings are validated rather than obeyed blindly. No CI weakening or unrelated fixes. The run stops at merge-ready.

### 10d. `/goal` — the objective

**Say:**

> One objective: make dispute resolution demo-complete. Cap the credit, wire resolve, enable the buttons, keep going until the checks pass. The agent judges the finish line. I review.

**Paste:**

```text
/goal Make Ledgerly demo-complete for dispute resolution.

1. Cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price from lib/plans.ts.
2. Implement resolveDispute in lib/disputes/resolve.ts.
3. Make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note.
4. Enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx.
5. Keep going across turns until npm test is fully green and http://127.0.0.1:43173/disputes/dsp_1043 shows suggested credit at or below the Scale catalog price of $249.

Do not change prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. Do not invent a fourth price. When the checks pass, launch the dispute-verifier subagent to report evidence. I still review the result.
```

**Look for:** Suggested credit on dsp_1043 at or below **$249**. `npm test` green. `dispute-verifier` reports evidence. Seed and `tests/dispute-credit.test.ts` untouched.

If the run must survive closing the laptop, use the `hand-to-cloud-agent` skill.

### 10e. `/orchestrate` — the plan itself

Need `bun` on PATH and a `CURSOR_API_KEY` (personal key or team service account, not a team admin key). Slack is optional.

**Say:**

> Same outcome as /goal, but the work needs a plan first. A root planner writes no code. Isolated workers. A verifier. I still review and merge.

**Paste:**

```text
/orchestrate Make Ledgerly demo-complete for dispute resolution. This is a plugin workflow — you need bun on PATH and a CURSOR_API_KEY (personal key or team service account, not a team admin key). Slack is optional.

Decompose the work. The root planner writes no code. Workers are isolated; every handoff points up. Staff at least:

- Worker: cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price. Do not touch tests/dispute-credit.test.ts or the seed.
- Worker: implement resolveDispute and POST /api/disputes/[id]/resolve.
- Worker: enable Accept / Decline on app/disputes/[id]/page.tsx.

Launch the dispute-verifier subagent as the verifier: it checks tests/dispute-credit.test.ts (or npm test), POSTs accept/decline against dsp_1043, and loads http://127.0.0.1:43173/disputes/dsp_1043. Republish a task if a verifier fails. I still review and merge. Do not invent a fourth price.
```

**Look for:** Planner does not write product code. Three workers, then `dispute-verifier`. Same finish line as `/goal`.

---

## 11. Trust and verification (3 min)

**Prerequisite:** Use the checks appropriate to the beat you ran.

**Say:**

> Trust rises through evidence, not agent count. The rule prevents known bad changes. The worker has a narrow scope. Tests prove the contract. The agent runs the app like a user. A verifier reports evidence. Then I read the diff and decide what ships.

**Show four layers:**

1. **Guardrail:** `.cursor/rules/ledgerly.mdc`
2. **Narrow worker:** `.cursor/agents/api-instrumenter.md`
3. **Independent verifier:** `.cursor/agents/dispute-verifier.md`
4. **Human gate:** diff review and merge decision

**Run for any track:**

```bash
npx vitest run tests/workflows.test.ts tests/money.test.ts tests/plans.test.ts
```

**If `/goal` or `/orchestrate` completed dispute resolution:** run `npm test`, load dsp_1043, and confirm suggested credit is at or below **$249** and Accept / Decline work.

**If no credit-cap beat ran:** `npm test` should remain **1 failed / 9 passed**. That is shipped state, not failed setup.

**Land:** A green check is evidence, not permission to merge. The presenter remains accountable.

---

## 12. Close

**Say:**

> I reviewed the result. The book is still Fieldnote — three prices, no real companies. I am putting the machine back so the next run starts from the planted $400 seam.

**Do:** Ask the agent to run `reset-demo-state`, or:

```bash
git checkout -- lib/dispute-credit.ts
git checkout -- .
npx prisma db seed
npm test
```

Only run `git checkout -- .` if you mean to drop **all** local changes.

**Shipped state again:** suggested credit **$400.00** on dsp_1043, suite **1 failed / 9 passed**.

---

## Do not

- Invent a fourth price, ARR, or a real customer
- “Correct” the $400 claim on dsp_1043 or the seed
- Touch `tests/dispute-credit.test.ts` unless the beat is the cap
- Commit a KPI restyle to `main`
- Run `/loop` in the cloud, or `/orchestrate` without `bun` and a key
- Treat a green verifier as a ship decision

---

## 201 short path (20–25 min)

1. Book + Ask — orientation
2. Open one rule, one skill, one subagent
3. Explain model choice in the picker
4. Explain Cloud Agents; open an Automation draft if time allows
5. Run one: `/multitask`, `/loop`, `/autopilot`, or `/orchestrate`
6. Show the verification layers
7. Reset

## Advanced short path (15–25 min)

1. Book — dsp_1043 ($400 vs $249)
2. One local surface: Ask, Cmd-K, Agent, or Design
3. Run `/goal`, or jump to another workflow from `/workflows`
4. Show verifier evidence and review the diff
5. Reset
