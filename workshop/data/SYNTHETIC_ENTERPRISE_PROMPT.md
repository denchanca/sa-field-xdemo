# Copy-ready prompt: five-use-case synthetic enterprise data repository

You are a senior synthetic-data architect and Python engineer working in a local coding workspace.

Create a deterministic, runnable, fully fictional enterprise dataset for a two-and-a-half-day advanced Cursor workshop. Build source data, native business artifacts, metadata, evaluation fixtures, documentation, and validation tests. Do not prebuild the participant solutions.

## Workshop use cases

Support these five connected use cases:

1. Enterprise Knowledge and Document Intelligence Hub
2. AI-Augmented Product Management Copilot
3. Intelligent Operations Automation Agent
4. Multi-Source Research and Insights Synthesis Platform
5. Cross-Functional Decision-Support and Risk Advisory System

Use one coherent fictional company so participants can combine evidence across use cases.

## Defaults

- Company: Ledgerly
- Industry: global B2B enterprise software
- Products: Collections, Nudge, and Pulse
- Regions: United States, United Kingdom, and European Union
- Reference date: 2026-09-14
- Planned release date: 2026-10-26
- Random seed: 42042
- Python: 3.11 or later
- Test framework: pytest
- Runtime network access: none

Every company, person, customer, email address, document, metric, incident, claim, and decision must be fictional. Use `example.com` email addresses. Never include real customer data, confidential material, live credentials, secrets, paid APIs, or proprietary content.

## Repository contract

Create:

```text
synthetic-enterprise-sample/
  README.md
  DATA_DICTIONARY.md
  generation_manifest.json
  pyproject.toml
  scripts/
    generate_sample.py
    generator/
  shared/
  tests/
  use_case_1_enterprise_knowledge/
  use_case_2_product_management_copilot/
  use_case_3_operations_automation/
  use_case_4_research_synthesis/
  use_case_5_decision_support/
```

The generator must use fixed dates and seed values. Repeated clean generations must produce byte-for-byte identical output, including native Office and PDF artifacts.

Use `python-docx`, `openpyxl`, `python-pptx`, and `reportlab` for native files. Set fixed document metadata, normalize OOXML ZIP entry timestamps and order, and use invariant PDF output.

## Shared enterprise model

Generate:

- 36 fictional employees
- 12 teams spanning engineering, product, operations, security, support, legal, design, data, finance, sales, strategy, and leadership
- 3 products and 9 components
- At least 12 systems
- 14 customer accounts
- At least 10 policies
- A linked 90-day timeline

Use canonical IDs:

- People `PER-###`
- Teams `TEAM-###`
- Products `PRD-###`
- Components `CMP-###`
- Systems `SYS-###`
- Customers `CUST-###`
- Tickets `TKT-#####`
- Documents `DOC-####`
- Feedback `FBK-####`
- Themes `THM-###`
- Research sources `SRC-###`
- Claims `CLM-####`
- Evidence `EVD-####`
- Risks `RSK-###`
- Scenarios `SCN-###`
- Decisions `DEC-###`
- Events `EVT-######`
- Policies `POL-###`

Store patterns in one machine-readable shared file and validate all cross-file references.

## Use Case 1: Enterprise knowledge

Generate 60 separate source artifacts across `.docx`, `.pdf`, and `.pptx`, plus metadata and a native workbook catalog.

Include policies, architecture documents, runbooks, release notes, meeting notes, support articles, research notes, decision records, playbooks, and FAQs. Include authoritative, reviewed, draft, superseded, restricted, and confidential sources.

Create 12 evaluation questions covering direct retrieval, multi-document synthesis, stale-source rejection, regional rules, access control, conflicting evidence, citation, and insufficient-evidence abstention.

## Use Case 2: Product management copilot

Generate at least 120 feedback records from support tickets, sales-call notes, and surveys. Store support and survey exports as `.xlsx` files and sales-call notes as separate `.docx` files.

Include a six-theme taxonomy, realistic duplicates, RICE inputs and scores, scoring rationale, product-owner review records, and evaluation cases. Add separate native PRD, prioritized-roadmap, and stakeholder-update templates.

## Use Case 3: Operations automation

Generate exactly 50 operational cases. Exactly 35 must be routine automation candidates and 15 must require escalation with a specific reason.

Include incidents, service requests, access requests, change requests, data-quality alerts, policy exceptions, customer escalations, and approval requests. Add deterministic mock downstream responses, events, intake documents, runbook PDFs, audit expectations, and a queue workbook.

Include missing identity, required approval, stale rule conflict, malformed response, similar customer names, redaction, and cross-use-case dependencies. The expected outcome must never fabricate missing data.

## Use Case 4: Research synthesis

Generate 16 fully synthetic source artifacts representing news, filings, call transcripts, analyst notes, and internal notes. Use `.pdf`, `.docx`, and `.pptx`.

Create a claim ledger that distinguishes verified facts from inference, assigns confidence, cites sources, and preserves at least one unresolved contradiction. Add 12 fact-check cases, a research scope, a tracker workbook, and a leadership decision-memo template.

All included sources must be fictional and offline-safe. Treat live public research as an optional participant extension.

## Use Case 5: Decision support

Create three reproducible quantitative scenarios for broad launch, phased rollout, and delay. Store inputs, outputs, and expected calculation checks. Provide a native workbook with inspectable formulas.

Include structured financial and operational data, contracts, market notes, stakeholder notes, evidence, assumptions, and a risk register. Add a pending decision record with named human approvers and a native decision-brief slide template.

Generated analysis must remain visibly separate from human judgment. The dataset must not preselect the final option.

## Cross-use-case links

At minimum:

- One operations case must be cited by decision evidence.
- One decision risk must cite both an operations case and a knowledge policy.
- Product feedback must reference shared customers and products.
- Research claims must inform decision evidence.
- Policies must resolve to knowledge document IDs.
- All use cases must share people, teams, systems, customers, and dates.

## Validation

Test:

- Required paths and exact record counts
- Identifier formats
- ISO dates and timestamps
- Shared and cross-use-case referential integrity
- Access classifications
- The 35/15 operations distribution
- RICE score calculations
- Research contradiction coverage
- Decision scenario calculations
- Valid ZIP-based Office containers and PDF signatures
- Manifest checksums
- `example.com` emails
- Byte-for-byte deterministic clean regeneration

Generation is complete only when:

```bash
python3 scripts/generate_sample.py
python3 -m pytest
```

both succeed and a second clean generation has identical file hashes.

