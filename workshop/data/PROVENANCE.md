# workshop/data provenance

Vendored **generated artifacts only** from the private syn-data fork. Not a submodule. The Ledgerly app must not import this tree.

| Field | Value |
| --- | --- |
| Fork | [denchanca/syn-data](https://github.com/denchanca/syn-data) (private) |
| Upstream | private syn-data generator (not vendored into this tree) |
| Commit | `e3bc02508218fb320da3221816bbef84b2d85637` |
| Tree | `fa9ef3239815df4cded9ae35ab10ac9a107a12cd` |
| Generated at | 2026-09-14T00:00:00Z (corpus clock) |
| Company | Ledgerly |
| Products | Collections (releasing 4.2), Nudge, Pulse |
| Seed | 42042 |
| Reference date | 2026-09-14 |
| Planned release | 2026-10-26 |

Copied from `synthetic-enterprise-sample/` at that commit. Generator (`scripts/`), pytest, and `pyproject.toml` were **not** copied — this directory is UC input, not a Python project.

Directory names are the real tree names. Do not invent `uc1/` aliases.

| Path | Locked count (verified) |
| --- | --- |
| `use_case_1_enterprise_knowledge/documents/` | 60 native docs (23 docx / 18 pdf / 19 pptx) |
| `use_case_1_enterprise_knowledge/evaluation_questions.json` | 12 questions |
| `use_case_2_product_management_copilot/feedback.csv` | 120 rows |
| `use_case_3_operations_automation/cases.csv` | 50 cases (35 `automate` / 15 `escalate`) |
| `use_case_4_research_synthesis/sources/` | 16 sources |
| `use_case_5_decision_support/scenario_inputs_and_outputs.csv` | 3 scenarios (`broad_launch`, `phased_rollout`, `delay`) |

SHA-256 checksums for every vendored file: `generation_manifest.json`.

**Remap:** applied at import into this repo. The corpus was generated for a different fictional company and mechanically renamed into the Ledgerly world — company, product, and competitor names in file contents **and** file names. Every ID (`DOC-`, `SRC-`, `CLM-`, `TKT-`, `CUST-`, `DEC-` …), every count, every planted evaluation behavior, and all internal cross-references are unchanged. `generation_manifest.json` hashes are post-remap.

**Hand-edits:** only the remap described above, plus this file. Apparent typos may be planted — leave them. Content fixes still go upstream to syn-data, then re-copy and re-remap.

**Catalog vs corpus:** Ledgerly UI/code prices remain $49 / $99 / $249. Corpus numbers (including the UC4 CON-001 pricing contradiction) are evidence to quote and cite, not to import into the app.
