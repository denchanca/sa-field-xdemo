import { CheckCircle2, CircleAlert, CircleMinus, Info, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CiteChip, CiteList } from "@/components/analysis/cite-chip";
import { ReportChart } from "@/components/analysis/report-charts";
import { CITATION_SHAPE } from "@/lib/analysis/corpus";
import type { Report, Section } from "@/lib/analysis/report-schema";
import { cn } from "@/lib/utils";

/** Renders a contract-valid report as a designed brief — not a markdown dump. */
export function ReportView({ report }: { report: Report }) {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{report.title}</h2>
            {report.generatedBy ? (
              <Badge variant="secondary" className="font-normal">
                {report.generatedBy}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
          {report.citations?.length ? (
            <p className="text-xs text-muted-foreground">
              Sources: <CiteList ids={report.citations} />
            </p>
          ) : null}
        </CardContent>
      </Card>
      {report.sections.map((section, i) => (
        <SectionView key={i} section={section} />
      ))}
    </div>
  );
}

function SectionCard({
  heading,
  cite,
  children,
}: {
  heading?: string;
  cite?: string[];
  children: React.ReactNode;
}) {
  return (
    <Card>
      {heading ? (
        <CardHeader className="pb-0">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            {heading}
            <CiteList ids={cite} />
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={cn(heading ? "pt-3" : undefined)}>{children}</CardContent>
    </Card>
  );
}

function CellValue({ value }: { value: string | number }) {
  if (typeof value === "string" && CITATION_SHAPE.test(value)) return <CiteChip id={value} />;
  return <>{String(value)}</>;
}

const METRIC_TONES = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

const CALLOUT_STYLES = {
  info: { box: "border-indigo-soft bg-indigo-soft/50 text-indigo", Icon: Info },
  success: { box: "border-success-soft bg-success-soft/60 text-success", Icon: CheckCircle2 },
  warning: { box: "border-warning-soft bg-warning-soft/60 text-warning", Icon: TriangleAlert },
  danger: { box: "border-danger-soft bg-danger-soft/60 text-danger", Icon: CircleAlert },
} as const;

const VERDICT = {
  pass: { label: "pass", className: "bg-success-soft text-success", Icon: CheckCircle2 },
  fail: { label: "fail", className: "bg-danger-soft text-danger", Icon: CircleAlert },
  abstain: { label: "abstain", className: "bg-warning-soft text-warning", Icon: CircleMinus },
} as const;

const LEVEL_BADGE = {
  low: "bg-success-soft text-success",
  medium: "bg-warning-soft text-warning",
  high: "bg-danger-soft text-danger",
} as const;

function SectionView({ section }: { section: Section }) {
  switch (section.kind) {
    case "prose":
      return (
        <SectionCard heading={section.heading}>
          <div className="space-y-3">
            {section.body.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">
                {para}
              </p>
            ))}
          </div>
        </SectionCard>
      );

    case "metrics":
      return (
        <SectionCard heading={section.heading}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-semibold tracking-tight",
                    METRIC_TONES[item.tone ?? "default"],
                  )}
                >
                  {item.value}
                </p>
                {item.hint ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>
                ) : null}
              </div>
            ))}
          </div>
        </SectionCard>
      );

    case "table":
      return (
        <SectionCard heading={section.heading} cite={section.cite}>
          <Table>
            <TableHeader>
              <TableRow>
                {section.columns.map((column, i) => (
                  <TableHead key={i}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j} className="align-top">
                      <CellValue value={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      );

    case "chart":
      return (
        <SectionCard heading={section.heading}>
          <ReportChart spec={section.chart} />
        </SectionCard>
      );

    case "callout": {
      const { box, Icon } = CALLOUT_STYLES[section.tone];
      return (
        <div className={cn("flex gap-3 rounded-[var(--radius-lg)] border px-4 py-3.5", box)}>
          <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            {section.heading ? <p className="text-sm font-semibold">{section.heading}</p> : null}
            <p className="text-sm leading-relaxed text-foreground/85">{section.body}</p>
            <CiteList ids={section.cite} />
          </div>
        </div>
      );
    }

    case "qa":
      return (
        <SectionCard heading={section.heading}>
          <div className="divide-y divide-border">
            {section.items.map((item, i) => {
              const verdict = item.verdict ? VERDICT[item.verdict] : null;
              return (
                <div key={i} className="space-y-1.5 py-3.5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.id ? (
                      <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
                    ) : null}
                    <p className="text-sm font-medium">{item.question}</p>
                    {verdict ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          verdict.className,
                        )}
                      >
                        <verdict.Icon className="size-3" /> {verdict.label}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85">{item.answer}</p>
                  <CiteList ids={item.cite} />
                </div>
              );
            })}
          </div>
        </SectionCard>
      );

    case "risks":
      return (
        <SectionCard heading={section.heading ?? "Risk register"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Mitigation</TableHead>
                <TableHead>Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.items.map((risk, i) => (
                <TableRow key={i}>
                  <TableCell className="align-top">
                    <div className="flex flex-col gap-0.5">
                      {risk.id ? (
                        <span className="font-mono text-[11px] text-muted-foreground">{risk.id}</span>
                      ) : null}
                      <span className="text-sm font-medium">{risk.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge className={cn("font-normal capitalize", LEVEL_BADGE[risk.likelihood])}>
                      {risk.likelihood}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge className={cn("font-normal capitalize", LEVEL_BADGE[risk.impact])}>
                      {risk.impact}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-64 align-top text-sm text-muted-foreground">
                    {risk.mitigation ?? "—"}
                  </TableCell>
                  <TableCell className="align-top">
                    <CiteList ids={risk.cite} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      );

    case "decision":
      return (
        <SectionCard heading={section.heading ?? "Decision"} cite={section.cite}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">{section.question}</p>
              <Badge className="bg-warning-soft font-mono text-[11px] text-warning">
                {section.status}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {section.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "rounded-lg border px-4 py-3",
                    option.recommended
                      ? "border-indigo bg-indigo-soft/50"
                      : "border-border bg-background",
                  )}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{option.id}</p>
                  {option.note ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {option.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {section.owner ? (
                <>
                  Decision owner: <span className="font-mono">{section.owner}</span>.{" "}
                </>
              ) : null}
              This panel is display-only — the status above is read from the decision record and
              there is deliberately no approve control here.
            </p>
          </div>
        </SectionCard>
      );
  }
}
