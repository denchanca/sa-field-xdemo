/**
 * The five workshop use cases as they appear on /analysis and in the README.
 * Prompts are attendee-safe: Ledgerly names only, no planted-fact spoilers.
 */

export type UcMeta = {
  n: 1 | 2 | 3 | 4 | 5;
  slug: string;
  title: string;
  short: string;
  blurb: string;
  dataDir: string;
  goodRun: string;
  prompt: string;
};

export const USE_CASES: UcMeta[] = [
  {
    n: 1,
    slug: "uc1",
    title: "Enterprise knowledge hub",
    short: "Knowledge",
    blurb:
      "Ground a Q&A assistant in the Collections 4.2 release packet — 60 native docs from Fieldnote — and answer the evaluation set with verifiable citations.",
    dataDir: "workshop/data/use_case_1_enterprise_knowledge",
    goodRun:
      "All twelve evaluation questions answered or correctly abstained, every answer citing document IDs, stale and restricted sources handled per their metadata.",
    prompt: `You are a Ledgerly knowledge assistant working in this repo.
Ingest only workshop/data/use_case_1_enterprise_knowledge/ (60 native docs,
documents_metadata.csv, evaluation_questions.json) plus workshop/data/shared/employees.csv.
Answer every question in evaluation_questions.json, citing document IDs for every answer.
Respect document status and supersession metadata — prefer authoritative sources over
superseded ones. If the requester is not authorized for a document's classification,
abstain. If the corpus does not contain the answer, abstain — do not invent.
Write your results to workshop/runs/uc1/<your-run-name>/report.json following
workshop/REPORT_CONTRACT.md — use a "qa" section for the twelve questions and a "metrics"
section with your pass count — then check http://localhost:43173/analysis/uc1.
Do not import corpus content into the app database.`,
  },
  {
    n: 2,
    slug: "uc2",
    title: "Product management copilot",
    short: "PM copilot",
    blurb:
      "Turn 120 rows of raw customer feedback into a themed, RICE-ranked backlog with drafted PRDs and a stakeholder update — with the human gate visible.",
    dataDir: "workshop/data/use_case_2_product_management_copilot",
    goodRun:
      "Feedback themed with the classification scored against expectations, RICE applied exactly as the rubric says, three PRDs drafted, customer references linking to live accounts.",
    prompt: `You are a Ledgerly PM copilot. Use only
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
Do not touch Ledgerly catalog prices or existing seed rows.`,
  },
  {
    n: 3,
    slug: "uc3",
    title: "Operations automation agent",
    short: "Ops automation",
    blurb:
      "Route 50 operational cases against Ledgerly's runbooks: automate the routine, escalate with grounded reasons, and leave a reconcilable audit trail.",
    dataDir: "workshop/data/use_case_3_operations_automation",
    goodRun:
      "All 50 cases routed with a defensible automation rate, every escalation carrying a specific grounded reason, an audit log that reconciles against expectations.",
    prompt: `You are a Ledgerly ops agent. Use only workshop/data/use_case_3_operations_automation/
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
Mock downstream only — no hosted MCP, no live ticketing, no writes to the Ledgerly database.`,
  },
  {
    n: 4,
    slug: "uc4",
    title: "Research synthesis",
    short: "Research",
    blurb:
      "Synthesize 16 vendored market sources on the collections-automation space into an attributed claim ledger and a leadership memo — conflicts kept visible.",
    dataDir: "workshop/data/use_case_4_research_synthesis",
    goodRun:
      "Every claim attributed to specific sources with a confidence level, verified fact separated from inference, disagreements between sources surfaced instead of smoothed over.",
    prompt: `You are a Ledgerly market researcher. Use only workshop/data/use_case_4_research_synthesis/
(16 sources, sources_metadata.csv, claim_ledger.csv, fact_check_cases.json,
research_scope.json). Work offline — every source is a local file; do not fetch the web.
Build a claim ledger: every claim attributed to specific sources (SRC-*), verified fact
separated from inference, each claim carrying a confidence level. Where sources disagree,
flag the conflict explicitly and keep both sides visible — do not smooth it over.
Quote corpus prices as cited evidence only; never import them into lib/plans.ts.
Write workshop/runs/uc4/<your-run-name>/report.json per workshop/REPORT_CONTRACT.md —
include the claim ledger as a table, a callout for any unresolved contradiction, and a
recommendation with an explicit confidence level. Save your full memo as decision-memo.md
in the run folder.`,
  },
  {
    n: 5,
    slug: "uc5",
    title: "Decision support",
    short: "Decision",
    blurb:
      "Combine the Collections 4.2 financial model with qualitative evidence into a three-scenario EU launch brief: reproducible numbers, a risk register, and a human decision gate.",
    dataDir: "workshop/data/use_case_5_decision_support",
    goodRun:
      "Scenario numbers recomputed by inspectable code and checked against the expected calculations, a cited risk register, and a decision panel that reflects the record as written.",
    prompt: `You are a Ledgerly decision analyst. Use only workshop/data/use_case_5_decision_support/.
Recompute the three scenarios (broad_launch, phased_rollout, delay) from
artifacts/collections_42_financial_model.xlsx and scenario_inputs_and_outputs.csv using
code you save in your run folder so a reviewer can rerun it — no prose-only math. Check
your numbers against expected_calculation_checks.json and report any deviation.
Extract the risk register with likelihood and impact from the corpus, citing evidence
(EVD-*) and source documents. Write workshop/runs/uc5/<your-run-name>/report.json per
workshop/REPORT_CONTRACT.md — include a scenario-comparison chart, a "risks" section, and
a "decision" section reflecting decision_record.json exactly as recorded. The final call
belongs to the named human owner; your brief supports that review — it does not make the
decision. Do not change Ledgerly catalog prices.`,
  },
];

export function getUseCase(slug: string): UcMeta | undefined {
  return USE_CASES.find((uc) => uc.slug === slug);
}
