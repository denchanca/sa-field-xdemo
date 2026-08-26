# Ledgerly — Workshop App

Repo: [`denchanca/xdemo-app`](https://github.com/denchanca/xdemo-app).

Welcome! **Ledgerly** is a fictional B2B billing and collections SaaS. You'll work inside a real, running product — invoices, disputes, collections, a dashboard — plus the working files behind Ledgerly's next big release, **Collections 4.2**, and the company's pending decision about launching it in Europe. The operator persona is **Avery Quinn**, running the **Fieldnote Workspace** book. The demo clock is frozen at **23 August 2026**, so overdue math never drifts mid-demo; the release-planning corpus runs a few weeks ahead of it, toward the planned October 26 launch.

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

`npm test` shows **1 failed / 13 passed** on a clean checkout — that red test is a planted product bug used in the guided demo, not your environment. Leave it unless the facilitator points you at it. To reset everything after experimenting, ask the agent to run the `reset-demo-state` skill (or `npm run db:reset`).

## What's in the box

- **The app** — Next.js + TypeScript + Prisma/SQLite. Plans: Starter **$49** / Growth **$99** / Scale **$249** — the only prices in this product. Chrome: Dashboard, Invoices, Collections (overdue queue), Disputes, Analysis, Settings. Dark mode is the moon/sun control in the header.
- **`workshop/data/`** — the five use-case datasets, one per team track:
  - `use_case_1_enterprise_knowledge/` — the Collections 4.2 release packet: 60 native docs (`.pdf`/`.docx`/`.pptx`), `documents_metadata.csv`, `evaluation_questions.json`
  - `use_case_2_product_management_copilot/` — `feedback.csv` (120 rows), `themes.json`, `prioritization_rubric.json`, `backlog_candidates.csv`, PRD templates, native source artifacts
  - `use_case_3_operations_automation/` — `cases.csv` (50 cases), `runbooks/`, `events.jsonl`, `mock_system_responses.jsonl`, `audit_expectations.csv`, intake documents
  - `use_case_4_research_synthesis/` — 16 vendored market sources on the collections-automation space (Slatebook, Harborbill and friends), `claim_ledger.csv`, fact-check fixtures — fully offline
  - `use_case_5_decision_support/` — `artifacts/collections_42_financial_model.xlsx`, scenario inputs, `risk_register.csv`, `decision_record.json`, expected-calculation checks
  - `shared/` — the common world: customers, employees, teams, products (Collections, Nudge, Pulse), systems, policies
- **`/analysis`** — the in-app page that renders agent-written reports as briefs with charts. Citations link to live invoices and accounts and to the corpus viewer. Contract: `workshop/REPORT_CONTRACT.md`; reports land in `workshop/runs/`. One example run per use case ships in the repo so you can see the bar before your first run.
- **Skills** (`.cursor/skills/`): `add-dashboard-widget`, `draft-collection-email`, `reset-demo-state`, `write-prisma-query`.

The corpus customers are live rows: the fourteen accounts in the release packet (Northstar Fabrication through Redwood Components) are seeded into the Ledgerly book with real invoices, which is why report citations can land on actual app pages.

---

## Prompts — follow along

Paste these as-is, from the running app's `/analysis` pages or from here. The product-demo prompts are for the guided walkthrough; the use-case prompts are your team's Day-2 starting points — a first move, not a ceiling.

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

**6. Cloud Agents** are **facilitator-led only** in this workshop. Nothing in your build depends on them; skip any Cloud Agent UI you see.

### Workshop use cases (Day 2 team tracks)

Every prompt ends the same way: the agent writes a `report.json` per `workshop/REPORT_CONTRACT.md` into `workshop/runs/`, and your work appears rendered at `/analysis` while the dev server runs. Each `/analysis` use-case page carries the same prompt with a copy button.

**UC1 — Enterprise knowledge hub**

```text
You are a Ledgerly knowledge assistant working in this repo.
Ingest only workshop/data/use_case_1_enterprise_knowledge/ (60 native docs,
documents_metadata.csv, evaluation_questions.json) plus workshop/data/shared/employees.csv.
Answer every question in evaluation_questions.json, citing document IDs for every answer.
Respect document status and supersession metadata — prefer authoritative sources over
superseded ones. If the requester is not authorized for a document's classification,
abstain. If the corpus does not contain the answer, abstain — do not invent.
Write your results to workshop/runs/uc1/<your-run-name>/report.json following
workshop/REPORT_CONTRACT.md — use a "qa" section for the twelve questions and a "metrics"
section with your pass count — then check http://localhost:43173/analysis/uc1.
Do not import corpus content into the app database.
```

**UC2 — Product management copilot**

```text
You are a Ledgerly PM copilot. Use only
workshop/data/use_case_2_product_management_copilot/ and workshop/data/shared/.
Theme the 120 feedback rows against themes.json — classify from the feedback text itself,
then score your classification against expected_theme_id afterwards and report agreement.
Recompute RICE for backlog_candidates.csv using prioritization_rubric.json exactly as
written and rank the backlog. Apply product_owner_reviews.json as a visible human gate.
Draft 3 PRDs for the top themes from templates/prd_template.docx and one stakeholder
update; save them as .md files in your run folder.
Write workshop/runs/uc2/<your-run-name>/report.json per workshop/REPORT_CONTRACT.md —
include a chart of theme volumes and the ranked backlog as a table with scoring rationale,
and cite feedback (FBK-*) and customer (CUST-*) IDs so rows link to live Ledgerly accounts.
Do not touch Ledgerly catalog prices or existing seed rows.
```

**UC3 — Operations automation agent**

```text
You are a Ledgerly ops agent. Use only workshop/data/use_case_3_operations_automation/
(cases.csv, events.jsonl, mock_system_responses.jsonl, audit_expectations.csv, runbooks/,
intake_documents/). Route all 50 cases: automate the routine ones end-to-end and escalate
the rest with a specific reason grounded in the case text, requires_approval, or a
malformed mock response. Never fabricate missing identity, customer, or system fields.
Record each downstream update against the local mock services — POST /api/mock/nudge and
POST /api/mock/pulse on the running app (port 43173).
Produce an audit log reconcilable against audit_expectations.csv and save it as
audit-log.jsonl in your run folder. Write workshop/runs/uc3/<your-run-name>/report.json
per workshop/REPORT_CONTRACT.md — include your automation rate as a metric, the routing
table, and an escalation-reasons chart; cite TKT-* and CUST-* IDs.
Mock downstream only — no hosted MCP, no live ticketing, no writes to the Ledgerly database.
```

**UC4 — Research synthesis**

```text
You are a Ledgerly market researcher. Use only workshop/data/use_case_4_research_synthesis/
(16 sources, sources_metadata.csv, claim_ledger.csv, fact_check_cases.json,
research_scope.json). Work offline — every source is a local file; do not fetch the web.
Build a claim ledger: every claim attributed to specific sources (SRC-*), verified fact
separated from inference, each claim carrying a confidence level. Where sources disagree,
flag the conflict explicitly and keep both sides visible — do not smooth it over.
Quote corpus prices as cited evidence only; never import them into lib/plans.ts.
Write workshop/runs/uc4/<your-run-name>/report.json per workshop/REPORT_CONTRACT.md —
include the claim ledger as a table, a callout for any unresolved contradiction, and a
recommendation with an explicit confidence level. Save your full memo as decision-memo.md
in the run folder.
```

**UC5 — Decision support**

```text
You are a Ledgerly decision analyst. Use only workshop/data/use_case_5_decision_support/.
Recompute the three scenarios (broad_launch, phased_rollout, delay) from
artifacts/collections_42_financial_model.xlsx and scenario_inputs_and_outputs.csv using
code you save in your run folder so a reviewer can rerun it — no prose-only math. Check
your numbers against expected_calculation_checks.json and report any deviation.
Extract the risk register with likelihood and impact from the corpus, citing evidence
(EVD-*) and source documents. Write workshop/runs/uc5/<your-run-name>/report.json per
workshop/REPORT_CONTRACT.md — include a scenario-comparison chart, a "risks" section, and
a "decision" section reflecting decision_record.json exactly as recorded. The final call
belongs to the named human owner; your brief supports that review — it does not make the
decision. Do not change Ledgerly catalog prices.
```

---

## Ground rules

- Synthetic data only. Nothing here is real, and no external or client data comes in.
- Every use case is solvable offline from the files in this repo.
- The catalog prices ($49 / $99 / $249) and the frozen demo clock are fixed points of the Ledgerly world. Corpus numbers are evidence to quote and cite — never imports into the app.
- "Not found" beats making it up: grounded answers with citations are the bar on every track.

## Troubleshooting

- **Port 43173 busy** — a previous dev server is still running; stop it or `npm run dev` will fail fast.
- **Dashboard empty / data looks wrong** — `npm run db:reset` reseeds the book deterministically.
- **Windows is slow or file-watching flakes** — native Windows is fully supported; if you chose WSL2, keep the clone in the Linux home (not `/mnt/c`). Line endings are pinned to LF by `.gitattributes`, so no autocrlf surprises either way.
- **`npm test` is red** — one failure is shipped on purpose (see Setup above). Exactly 1 failed / 13 passed is healthy.
