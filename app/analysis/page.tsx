import Link from "next/link";
import { ArrowRight, BookOpenText, FileJson } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCanon } from "@/lib/analysis/corpus";
import { listRuns } from "@/lib/analysis/runs";
import { USE_CASES } from "@/lib/analysis/uc-meta";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export const metadata = { title: "Analysis" };

export default function AnalysisPage() {
  const canon = getCanon();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workshop"
        title="Analysis"
        description={`Five ${canon.world.release} use cases, one motion: paste a prompt into Cursor, let the agent work the corpus under workshop/data, and read the resulting brief here. Reports land in workshop/runs and render as briefs with charts — citations link to live Ledgerly rows.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/analysis/corpus">
                <BookOpenText className="size-4" /> Corpus browser
              </Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FileJson className="size-4 text-indigo" />
            Contract: <code className="rounded bg-muted px-1 py-0.5 text-xs">workshop/REPORT_CONTRACT.md</code>
          </span>
          <span>
            Runs directory: <code className="rounded bg-muted px-1 py-0.5 text-xs">workshop/runs/uc1..uc5</code>
          </span>
          <span>The page picks up new runs automatically — no restart.</span>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {USE_CASES.map((uc) => {
          const runs = listRuns(uc.slug);
          const latest = runs[0];
          return (
            <Card key={uc.slug} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium tracking-[0.14em] text-indigo uppercase">
                      Use case {uc.n}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight">{uc.title}</h2>
                  </div>
                  <Badge variant="secondary" className="shrink-0 font-normal">
                    {runs.length} {runs.length === 1 ? "run" : "runs"}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{uc.blurb}</p>
                {latest ? (
                  <div className="rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{latest.title ?? latest.name}</span>
                      {!latest.valid ? (
                        <Badge className="bg-danger-soft font-normal text-danger">contract errors</Badge>
                      ) : null}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {latest.summary ?? "—"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {latest.name} · {formatDate(new Date(latest.modifiedMs))}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border px-3.5 py-2.5 text-xs text-muted-foreground">
                    No runs yet — paste the prompt from the use-case page (or the README) into
                    Cursor and let the agent write the first report.
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between pt-1">
                  <p className="font-mono text-[11px] text-muted-foreground">{uc.dataDir}</p>
                  <Button asChild size="sm" variant="ghost" className="text-indigo">
                    <Link href={`/analysis/${uc.slug}`}>
                      Open <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
