import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { validateReport, type Report } from "@/lib/analysis/report-schema";

/**
 * Runs live on disk at workshop/runs/uc<N>/<run-name>/report.json.
 * Read at request time — a finishing agent run appears on refresh,
 * no server restart, no database writes.
 */

const RUNS_ROOT = join(process.cwd(), "workshop", "runs");

export type RunSummary = {
  ucSlug: string;
  name: string;
  modifiedMs: number;
  valid: boolean;
  title: string | null;
  summary: string | null;
  artifacts: string[];
};

export type LoadedRun = RunSummary & {
  report: Report | null;
  errors: string[];
};

function safeName(name: string) {
  return /^[\w][\w.-]*$/.test(name);
}

export function listRuns(ucSlug: string): RunSummary[] {
  const dir = join(RUNS_ROOT, ucSlug);
  if (!existsSync(dir)) return [];
  const runs: RunSummary[] = [];
  for (const name of readdirSync(dir)) {
    if (!safeName(name)) continue;
    const runDir = join(dir, name);
    if (!statSync(runDir).isDirectory()) continue;
    const reportPath = join(runDir, "report.json");
    if (!existsSync(reportPath)) continue;
    const loaded = loadRun(ucSlug, name);
    runs.push({
      ucSlug,
      name,
      modifiedMs: statSync(reportPath).mtimeMs,
      valid: loaded.valid,
      title: loaded.report?.title ?? null,
      summary: loaded.report?.summary ?? null,
      artifacts: loaded.artifacts,
    });
  }
  return runs.sort((a, b) => b.modifiedMs - a.modifiedMs);
}

export function loadRun(ucSlug: string, name: string): LoadedRun {
  const base = {
    ucSlug,
    name,
    modifiedMs: 0,
    valid: false,
    title: null,
    summary: null,
    artifacts: [] as string[],
    report: null as Report | null,
    errors: [] as string[],
  };
  if (!safeName(name) || !/^uc[1-5]$/.test(ucSlug)) {
    return { ...base, errors: ["invalid run reference"] };
  }
  const runDir = join(RUNS_ROOT, ucSlug, name);
  const reportPath = join(runDir, "report.json");
  if (!existsSync(reportPath)) return { ...base, errors: ["report.json not found"] };

  const artifacts = readdirSync(runDir).filter(
    (file) => file !== "report.json" && statSync(join(runDir, file)).isFile(),
  );
  const modifiedMs = statSync(reportPath).mtimeMs;

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch (error) {
    return {
      ...base,
      modifiedMs,
      artifacts,
      errors: [`report.json is not valid JSON: ${(error as Error).message}`],
    };
  }

  const errors = validateReport(raw);
  const expectedUc = Number(ucSlug.slice(2));
  if (errors.length === 0 && (raw as Report).useCase !== expectedUc) {
    errors.push(
      `"useCase" is ${(raw as Report).useCase} but this run sits under ${ucSlug}/ — move the folder or fix the field`,
    );
  }
  if (errors.length > 0) {
    const partial = raw as Partial<Report>;
    return {
      ...base,
      modifiedMs,
      artifacts,
      errors,
      title: typeof partial.title === "string" ? partial.title : null,
      summary: typeof partial.summary === "string" ? partial.summary : null,
    };
  }

  const report = raw as Report;
  return {
    ucSlug,
    name,
    modifiedMs,
    valid: true,
    title: report.title,
    summary: report.summary,
    artifacts,
    report,
    errors: [],
  };
}

/** Markdown artifact preview, so run pages can show the memo/PRD next to the brief. */
export function readRunArtifact(ucSlug: string, name: string, file: string): string | null {
  if (!safeName(name) || !/^uc[1-5]$/.test(ucSlug) || !safeName(file)) return null;
  if (!/\.(md|txt|csv|jsonl|json|mjs|py)$/.test(file)) return null;
  const path = join(RUNS_ROOT, ucSlug, name, file);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf8");
  return raw.length > 40000 ? `${raw.slice(0, 40000)}\n… (truncated)` : raw;
}
