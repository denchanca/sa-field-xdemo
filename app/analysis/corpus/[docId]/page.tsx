import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileWarning } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CiteChip } from "@/components/analysis/cite-chip";
import { findCorpusEntry, corpusFileExists } from "@/lib/analysis/corpus";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params;
  return { title: docId };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm">{children}</div>
    </div>
  );
}

export default async function CorpusEntryPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params;
  const entry = findCorpusEntry(docId);
  if (!entry) notFound();

  if (entry.kind === "doc") {
    const doc = entry.doc;
    const superseded = doc.status === "superseded";
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow={doc.id}
          title={doc.title}
          description={`${doc.category} · ${doc.sourceType.toUpperCase()} · version ${doc.version}`}
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/analysis/corpus">
                <ChevronLeft className="size-4" /> Corpus
              </Link>
            </Button>
          }
        />
        {superseded ? (
          <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-danger-soft bg-danger-soft/40 px-4 py-3.5">
            <FileWarning className="mt-0.5 size-4 shrink-0 text-danger" />
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-danger">Superseded.</span> This document has been
              replaced by <CiteChip id={doc.supersededBy} /> — answers grounded here without
              checking the successor are stale by design.
            </p>
          </div>
        ) : null}
        <Card>
          <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Status">
              <Badge
                className={cn(
                  "font-normal",
                  superseded
                    ? "bg-danger-soft text-danger"
                    : doc.status === "authoritative"
                      ? "bg-success-soft text-success"
                      : "bg-indigo-soft text-indigo",
                )}
              >
                {doc.status}
              </Badge>
            </Field>
            <Field label="Access classification">{doc.accessClassification}</Field>
            <Field label="Intended audience">{doc.intendedAudience}</Field>
            <Field label="Region">{doc.region}</Field>
            <Field label="Author / owner">
              <span className="font-mono text-xs">
                {doc.authorPersonId} · {doc.ownerTeamId}
              </span>
            </Field>
            <Field label="Product / system tags">
              <span className="font-mono text-xs">
                {doc.productTags} · {doc.systemTags}
              </span>
            </Field>
            <Field label="Created">{doc.createdDate}</Field>
            <Field label="Last updated">{doc.lastUpdatedDate}</Field>
            <Field label="Effective">{doc.effectiveDate}</Field>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Native artifact</p>
            <p className="font-mono text-sm break-all">workshop/data/{doc.artifactPath}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {corpusFileExists(doc.artifactPath)
                ? "The file is in the repo — open or parse it from Cursor. This viewer intentionally shows metadata only: extracting and grounding the content is the use-case exercise."
                : "File missing on disk — the corpus may have been modified."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const source = entry.source;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={source.id}
        title={source.title}
        description={`${source.sourceType} · ${source.publisher}`}
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/analysis/corpus">
              <ChevronLeft className="size-4" /> Corpus
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Reliability">
            <Badge
              className={cn(
                "font-normal",
                source.reliability === "high"
                  ? "bg-success-soft text-success"
                  : source.reliability === "medium"
                    ? "bg-warning-soft text-warning"
                    : "bg-danger-soft text-danger",
              )}
            >
              {source.reliability}
            </Badge>
          </Field>
          <Field label="Access classification">{source.accessClassification}</Field>
          <Field label="Published">{source.publishedDate}</Field>
          <Field label="Retrieved">{source.retrievedDate}</Field>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Native artifact</p>
          <p className="font-mono text-sm break-all">workshop/data/{source.artifactPath}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {corpusFileExists(source.artifactPath)
              ? "The file is in the repo — open or parse it from Cursor. All sixteen sources are vendored files; nothing in use case 4 requires the network."
              : "File missing on disk — the corpus may have been modified."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
