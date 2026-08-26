import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileText, TriangleAlert } from "lucide-react";
import { AutoRefresh } from "@/components/analysis/auto-refresh";
import { CopyButton } from "@/components/analysis/copy-button";
import { ReportView } from "@/components/analysis/report-view";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listRuns, loadRun, readRunArtifact } from "@/lib/analysis/runs";
import { getUseCase } from "@/lib/analysis/uc-meta";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ uc: string }> }) {
  const { uc } = await params;
  const meta = getUseCase(uc);
  return { title: meta ? `Analysis · ${meta.title}` : "Analysis" };
}

export default async function UseCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ uc: string }>;
  searchParams: Promise<{ run?: string; artifact?: string }>;
}) {
  const { uc } = await params;
  const meta = getUseCase(uc);
  if (!meta) notFound();

  const { run: runParam, artifact: artifactParam } = await searchParams;
  const runs = listRuns(meta.slug);
  const selectedName = runParam && runs.some((r) => r.name === runParam) ? runParam : runs[0]?.name;
  const selected = selectedName ? loadRun(meta.slug, selectedName) : null;
  const artifact =
    selected && artifactParam && selected.artifacts.includes(artifactParam)
      ? { name: artifactParam, body: readRunArtifact(meta.slug, selected.name, artifactParam) }
      : null;

  return (
    <div className="space-y-6">
      <AutoRefresh />
      <PageHeader
        eyebrow={`Use case ${meta.n}`}
        title={meta.title}
        description={meta.blurb}
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/analysis">
              <ChevronLeft className="size-4" /> All use cases
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-0">
              <CardTitle className="text-base">Paste this into Cursor</CardTitle>
              <CopyButton text={meta.prompt} />
            </CardHeader>
            <CardContent className="pt-3">
              <pre className="max-h-105 overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap">
                {meta.prompt}
              </pre>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">A good run:</span> {meta.goodRun}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-base">Runs</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {runs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing here yet. Reports written to{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    workshop/runs/{meta.slug}/&lt;run-name&gt;/report.json
                  </code>{" "}
                  appear automatically.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {runs.map((run) => (
                    <Link
                      key={run.name}
                      href={`/analysis/${meta.slug}?run=${encodeURIComponent(run.name)}`}
                      className={cn(
                        "rounded-lg border px-3 py-2 transition-colors",
                        run.name === selected?.name
                          ? "border-indigo bg-indigo-soft/50"
                          : "border-border hover:bg-muted",
                      )}
                    >
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {run.name}
                        {!run.valid ? (
                          <Badge className="bg-danger-soft font-normal text-danger">invalid</Badge>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {run.title ?? "—"} · {formatDate(new Date(run.modifiedMs))}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selected && selected.artifacts.length > 0 ? (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Run artifacts</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex flex-col gap-1">
                  {selected.artifacts.map((file) => (
                    <Link
                      key={file}
                      href={`/analysis/${meta.slug}?run=${encodeURIComponent(selected.name)}&artifact=${encodeURIComponent(file)}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs",
                        artifact?.name === file
                          ? "bg-indigo-soft text-indigo"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <FileText className="size-3.5" /> {file}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="min-w-0 space-y-5">
          {artifact?.body ? (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="font-mono text-sm">{artifact.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <pre className="max-h-160 overflow-auto rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed whitespace-pre-wrap">
                  {artifact.body}
                </pre>
              </CardContent>
            </Card>
          ) : null}

          {!selected ? (
            <Card>
              <CardContent className="py-14 text-center">
                <p className="text-sm text-muted-foreground">
                  The rendered brief appears here once the first report lands.
                </p>
              </CardContent>
            </Card>
          ) : selected.valid && selected.report ? (
            <ReportView report={selected.report} />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-danger-soft bg-danger-soft/40 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                <TriangleAlert className="size-4" /> {selected.name}/report.json doesn&apos;t meet the
                contract yet
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                {selected.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Fix the JSON per workshop/REPORT_CONTRACT.md and refresh — no restart needed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
