# Report contract — `ledgerly.report.v1`

The `/analysis` page renders agent-written reports. A **run** is a directory:

```
workshop/runs/uc<1-5>/<run-name>/
  report.json      ← required, this contract
  *.md, *.csv, …   ← optional supporting artifacts, listed on the run page
```

`<run-name>` is yours to choose (kebab-case, e.g. `team-3-first-pass`). The page
picks up new runs automatically while the dev server is running.

## `report.json`

```jsonc
{
  "contract": "ledgerly.report.v1",   // required, exactly this string
  "useCase": 1,                        // 1..5, must match the ucN folder
  "title": "Collections 4.2 knowledge check",
  "summary": "One to three sentences. What did you find? Lead with the outcome.",
  "generatedBy": "optional free text (model / team name)",
  "sections": [ /* array of section blocks, rendered in order */ ],
  "citations": ["DOC-0001", "CUST-005"] // optional report-level citations
}
```

## Section blocks

Every block may carry `"heading"` (string) and most carry `"cite"`
(array of citation IDs — see Citations below).

### `prose`

```jsonc
{ "kind": "prose", "heading": "Method", "body": "Plain paragraphs. Blank line = new paragraph." }
```

### `metrics` — headline numbers

```jsonc
{ "kind": "metrics", "items": [
  { "label": "Questions passed", "value": "12 / 12", "hint": "self-assessed", "tone": "success" }
]}
```

`tone`: `default` | `success` | `warning` | `danger`.

### `table`

```jsonc
{ "kind": "table", "heading": "Ranked backlog",
  "columns": ["Rank", "Candidate", "RICE"],
  "rows": [[1, "Bulk dispute actions", 448], [2, "…", 300]],
  "cite": ["FBK-0007"] }
```

Cell values that look like citation IDs (`DOC-0003`, `CUST-005`, `TKT-00001`,
`SRC-006`, `inv_2003`, `dsp_1043`, …) render as links automatically.

### `chart`

```jsonc
{ "kind": "chart", "heading": "Scenario comparison", "chart": {
  "type": "bar",                    // bar | line | pie | scatter
  "xKey": "scenario",
  "series": ["revenue", "cost"],   // y keys; pie uses series[0] as the value key
  "unit": "$",                     // optional: "$" | "%" | ""
  "stacked": false,
  "data": [
    { "scenario": "broad_launch", "revenue": 2995200, "cost": 820320 },
    { "scenario": "phased_rollout", "revenue": 2380800, "cost": 501120 }
  ]
}}
```

For `scatter`, provide `series` as exactly `[yKey]` and numeric `xKey` values.
With `unit: "$"`, numbers are **dollars** (not cents).

### `callout`

```jsonc
{ "kind": "callout", "tone": "warning", "heading": "Unresolved contradiction",
  "body": "Two sources disagree about …", "cite": ["SRC-006", "SRC-007"] }
```

`tone`: `info` | `success` | `warning` | `danger`.

### `qa` — question / answer pairs (UC1)

```jsonc
{ "kind": "qa", "items": [
  { "id": "Q-001", "question": "…", "answer": "…", "verdict": "pass", "cite": ["DOC-0001"] }
]}
```

`verdict`: `pass` | `fail` | `abstain` (self-assessed).

### `risks` — risk register (UC5)

```jsonc
{ "kind": "risks", "items": [
  { "id": "RSK-001", "title": "…", "likelihood": "medium", "impact": "high",
    "mitigation": "…", "cite": ["EVD-0002"] }
]}
```

### `decision` — decision panel (UC5)

```jsonc
{ "kind": "decision", "question": "…", "status": "pending_human_review",
  "owner": "PER-034",
  "options": [
    { "id": "broad_launch", "label": "Broad launch", "note": "…" },
    { "id": "phased_rollout", "label": "Phased rollout", "note": "…" },
    { "id": "delay", "label": "Delay", "note": "…" }
  ],
  "cite": ["DEC-001"] }
```

The page renders `status` as a badge, verbatim. It is display-only — there is no
approve control, by design.

## Citations

Citation IDs resolve to live pages where one exists:

| ID shape | Links to |
| --- | --- |
| `DOC-####` | corpus viewer (`/analysis/corpus/DOC-####`) |
| `SRC-###` | corpus viewer |
| `CUST-###` | the account's live Ledgerly invoice (via `workshop/data/canon.json`) |
| `inv_*` / `INV-####` | `/invoices/...` |
| `dsp_*` | `/disputes/...` |
| anything else (`TKT-*`, `EVD-*`, `FBK-*`, `POL-*`, …) | rendered as a labeled chip |

## Validation

The page validates every `report.json` and lists contract violations instead of
rendering a broken brief. Fix the JSON and refresh — no server restart needed.
