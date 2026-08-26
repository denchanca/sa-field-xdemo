# Ledgerly data dictionary

All dates use ISO 8601. Canonical timestamps use UTC with a `Z` suffix. Pipe-delimited CSV values represent small lists. Native Office and PDF artifacts are indexed by their associated metadata files.

## Identifier conventions

- People: `PER-###`
- Teams: `TEAM-###`
- Products: `PRD-###`
- Components: `CMP-###`
- Systems: `SYS-###`
- Customers: `CUST-###`
- Policies: `POL-###`
- Tickets: `TKT-#####`
- Events: `EVT-######`
- Documents: `DOC-####`
- Feedback: `FBK-####`
- Themes: `THM-###`
- Research sources: `SRC-###`
- Claims: `CLM-####`
- Evidence: `EVD-####`
- Risks: `RSK-###`
- Scenarios: `SCN-###`
- Decisions: `DEC-###`
- Approvals: `APR-####`
- Metrics: `MET-###`

Machine-readable regular expressions are in `shared/identifier_patterns.json`.

## Shared data

### `shared/employees.csv`

Each employee has a canonical person ID, fictional name and `example.com` email, title, team, region, access level, and optional manager.

### `shared/teams.csv`

Each team has a team ID, name, business function, and lead person ID.

### `shared/products.csv` and `shared/components.csv`

Products reference pipe-delimited component IDs. Components identify their product and owning team.

### `shared/systems.csv`

Systems include product, owner, reliability tier, and operating region.

### `shared/customers.csv`

Customers include fictional name, commercial region, country, segment, products, and renewal date.

### `shared/policies.csv`

Policies include version, effective date, owning team, required approval, and the governing knowledge document ID.

### `shared/timeline.jsonl`

Each timeline record includes a date, owner, event, and related entity. The records cover the 90 days around the workshop reference date and release decision.

## Use Case 1: Enterprise knowledge

### `documents_metadata.csv`

Fields:

- `document_id`, `title`, and `category`
- `source_type` and relative `artifact_path`
- author and owner IDs
- creation, update, and effective dates
- version, status, and optional `superseded_by`
- product and system tags
- region, access classification, and intended audience

The `documents/` directory contains the separate `.docx`, `.pdf`, and `.pptx` source artifacts. `corpus_catalog.xlsx` is a facilitator-friendly native index.

### `evaluation_questions.json`

Each question records its type, requester, expected behavior, required source IDs, and acceptable answer. Empty required sources mean the correct behavior is to abstain for insufficient evidence.

## Use Case 2: Product management copilot

### `feedback.csv`

Fields include feedback ID, source type, source artifact, timestamp, customer, segment, region, product, feedback text, expected theme, duplicate link, urgency, and human-review status.

The source artifacts are:

- `source_artifacts/support_feedback_export.xlsx`
- `source_artifacts/customer_survey_responses.xlsx`
- `source_artifacts/sales_calls/*.docx`

### `backlog_candidates.csv`

Each candidate contains Reach, Impact, Confidence, Effort, calculated RICE score, scoring rationale, product-owner status, and optional override reason.

### Supporting files

- `themes.json`: explicit taxonomy and definitions
- `prioritization_rubric.json`: scoring and override rules
- `evaluation_cases.json`: expected theme and duplicate behavior
- `product_owner_reviews.json`: human review records
- `templates/`: native PRD, roadmap, and stakeholder-update templates

## Use Case 3: Operations automation

### `cases.csv`

Each case has type, source document, customer, system, owner, policy, related records, approval requirement, expected disposition, and expected escalation reason.

Exactly 35 records have `expected_disposition=automate`; 15 have `expected_disposition=escalate`.

### `events.jsonl`

Every case has `created`, `validated`, `enriched`, and `routed` events with a shared trace ID, timestamp, actor, and details.

### Supporting files

- `mock_system_responses.jsonl`: successful and malformed deterministic tool responses
- `expected_outcomes.json`: disposition, escalation reason, and required audit fields
- `audit_expectations.csv`: per-case logging, checkpoint, and redaction requirements
- `intake_documents/`: native intake batches
- `runbooks/`: current and deliberately stale PDF procedures
- `operations_queue.xlsx`: native review queue

## Use Case 4: Research synthesis

### `sources_metadata.csv`

Each source has an ID, title, type, fictional publisher, publication and retrieval dates, artifact path, reliability, access classification, and synthetic-data flag.

The `sources/` directory contains separate `.pdf`, `.docx`, and `.pptx` artifacts.

### `claim_ledger.csv`

Fields include claim text, source IDs, verified-fact or inference label, confidence, optional contradiction group, status, and review note.

`CON-001` deliberately preserves an unresolved conflict between a public pricing statement and a partner briefing.

### Supporting files

- `fact_check_cases.json`: expected sources, claim type, and contradiction behavior
- `research_scope.json`: question, cutoff, time budget, and output rules
- `research_tracker.xlsx`: native source and claim tracker
- `templates/leadership_decision_memo_template.pptx`: presentation template

## Use Case 5: Decision support

### `scenario_inputs_and_outputs.csv`

Each scenario stores eligible accounts, adoption rate, annual contract value, support cost, remediation cost, risk probability and impact, and the resulting adopters, revenue, costs, and risk-adjusted value.

### `evidence.csv`

Evidence includes category, claim, supported option, strength, source IDs, date, owner, region, and limitation.

### `risk_register.csv`

Risks include likelihood, impact, owner, evidence IDs, direct source IDs, and mitigation.

### Supporting files

- `assumptions.json`: owner and validation status
- `expected_calculation_checks.json`: expected numeric values and tolerance
- `decision_record.json`: pending human decision and required approvers
- `artifacts/collections_42_financial_model.xlsx`: inspectable native model formulas
- `artifacts/`: contract, market report, and stakeholder note sources
- `templates/decision_brief_template.pptx`: leadership brief template

## Manifest

`generation_manifest.json` records configuration, counts, synthetic-data confirmation, generation and validation commands, artifact classification, and SHA-256 checksum for every generated file.

