/**
 * ledgerly.report.v1 — types + a hand-rolled validator (no runtime deps).
 * The /analysis page refuses to render invalid reports and lists violations,
 * so a malformed agent run is a visible teaching moment, not a crash.
 */

export type MetricTone = "default" | "success" | "warning" | "danger";
export type CalloutTone = "info" | "success" | "warning" | "danger";
export type Verdict = "pass" | "fail" | "abstain";
export type Level = "low" | "medium" | "high";

export type ChartSpec = {
  type: "bar" | "line" | "pie" | "scatter";
  xKey: string;
  series: string[];
  data: Record<string, string | number>[];
  stacked?: boolean;
  unit?: string;
};

export type Section =
  | { kind: "prose"; heading?: string; body: string }
  | {
      kind: "metrics";
      heading?: string;
      items: { label: string; value: string; hint?: string; tone?: MetricTone }[];
    }
  | {
      kind: "table";
      heading?: string;
      columns: string[];
      rows: (string | number)[][];
      cite?: string[];
    }
  | { kind: "chart"; heading?: string; chart: ChartSpec }
  | { kind: "callout"; tone: CalloutTone; heading?: string; body: string; cite?: string[] }
  | {
      kind: "qa";
      heading?: string;
      items: {
        id?: string;
        question: string;
        answer: string;
        verdict?: Verdict;
        cite?: string[];
      }[];
    }
  | {
      kind: "risks";
      heading?: string;
      items: {
        id?: string;
        title: string;
        likelihood: Level;
        impact: Level;
        mitigation?: string;
        cite?: string[];
      }[];
    }
  | {
      kind: "decision";
      heading?: string;
      question: string;
      status: string;
      owner?: string;
      options: { id: string; label: string; note?: string; recommended?: boolean }[];
      cite?: string[];
    };

export type Report = {
  contract: "ledgerly.report.v1";
  useCase: 1 | 2 | 3 | 4 | 5;
  title: string;
  summary: string;
  generatedBy?: string;
  sections: Section[];
  citations?: string[];
};

const SECTION_KINDS = ["prose", "metrics", "table", "chart", "callout", "qa", "risks", "decision"];
const CHART_TYPES = ["bar", "line", "pie", "scatter"];
const LEVELS = ["low", "medium", "high"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Returns [] when the report is contract-valid. */
export function validateReport(raw: unknown): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(msg);

  if (!isRecord(raw)) return ["report.json is not a JSON object"];
  if (raw.contract !== "ledgerly.report.v1")
    err(`"contract" must be "ledgerly.report.v1" (got ${JSON.stringify(raw.contract)})`);
  if (typeof raw.useCase !== "number" || raw.useCase < 1 || raw.useCase > 5)
    err(`"useCase" must be 1..5 (got ${JSON.stringify(raw.useCase)})`);
  if (typeof raw.title !== "string" || !raw.title.trim()) err(`"title" must be a non-empty string`);
  if (typeof raw.summary !== "string" || !raw.summary.trim())
    err(`"summary" must be a non-empty string`);
  if (raw.citations !== undefined && !Array.isArray(raw.citations))
    err(`"citations" must be an array of ID strings`);

  if (!Array.isArray(raw.sections) || raw.sections.length === 0) {
    err(`"sections" must be a non-empty array`);
    return errors;
  }

  raw.sections.forEach((section, i) => {
    const at = `sections[${i}]`;
    if (!isRecord(section)) return err(`${at} is not an object`);
    const kind = section.kind as string;
    if (!SECTION_KINDS.includes(kind))
      return err(`${at}.kind must be one of ${SECTION_KINDS.join(", ")} (got ${JSON.stringify(kind)})`);

    if (kind === "prose" && typeof section.body !== "string")
      err(`${at}.body must be a string`);

    if (kind === "metrics" || kind === "qa" || kind === "risks") {
      if (!Array.isArray(section.items) || section.items.length === 0)
        err(`${at}.items must be a non-empty array`);
      else
        section.items.forEach((item: unknown, j: number) => {
          if (!isRecord(item)) return err(`${at}.items[${j}] is not an object`);
          if (kind === "metrics" && (typeof item.label !== "string" || typeof item.value !== "string"))
            err(`${at}.items[${j}] needs string "label" and "value"`);
          if (kind === "qa" && (typeof item.question !== "string" || typeof item.answer !== "string"))
            err(`${at}.items[${j}] needs string "question" and "answer"`);
          if (kind === "risks") {
            if (typeof item.title !== "string") err(`${at}.items[${j}] needs a string "title"`);
            for (const key of ["likelihood", "impact"])
              if (!LEVELS.includes(item[key] as string))
                err(`${at}.items[${j}].${key} must be low | medium | high`);
          }
        });
    }

    if (kind === "table") {
      if (!Array.isArray(section.columns) || section.columns.length === 0)
        err(`${at}.columns must be a non-empty array`);
      if (!Array.isArray(section.rows)) err(`${at}.rows must be an array`);
      else if (Array.isArray(section.columns))
        (section.rows as unknown[]).forEach((row, j) => {
          if (!Array.isArray(row) || row.length !== (section.columns as unknown[]).length)
            err(`${at}.rows[${j}] must have exactly ${(section.columns as unknown[]).length} cells`);
        });
    }

    if (kind === "chart") {
      const chart = section.chart;
      if (!isRecord(chart)) return err(`${at}.chart must be an object`);
      if (!CHART_TYPES.includes(chart.type as string))
        err(`${at}.chart.type must be one of ${CHART_TYPES.join(", ")}`);
      if (typeof chart.xKey !== "string") err(`${at}.chart.xKey must be a string`);
      if (!Array.isArray(chart.series) || chart.series.length === 0)
        err(`${at}.chart.series must be a non-empty array of y keys`);
      if (!Array.isArray(chart.data) || chart.data.length === 0)
        err(`${at}.chart.data must be a non-empty array`);
    }

    if (kind === "callout") {
      if (!["info", "success", "warning", "danger"].includes(section.tone as string))
        err(`${at}.tone must be info | success | warning | danger`);
      if (typeof section.body !== "string") err(`${at}.body must be a string`);
    }

    if (kind === "decision") {
      if (typeof section.question !== "string") err(`${at}.question must be a string`);
      if (typeof section.status !== "string") err(`${at}.status must be a string`);
      if (!Array.isArray(section.options) || section.options.length === 0)
        err(`${at}.options must be a non-empty array`);
      else
        section.options.forEach((option: unknown, j: number) => {
          if (!isRecord(option) || typeof option.id !== "string" || typeof option.label !== "string")
            err(`${at}.options[${j}] needs string "id" and "label"`);
        });
    }
  });

  return errors;
}
