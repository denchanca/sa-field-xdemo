import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkflow } from "@/lib/workflows/meta";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getWorkflow(slug);
  return { title: meta ? `Workflows · ${meta.command}` : "Workflows" };
}

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getWorkflow(slug);
  if (!meta) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={meta.command}
        title={meta.title}
        description={meta.blurb}
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/workflows">
              <ChevronLeft className="size-4" /> All workflows
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-0">
          <CardTitle className="text-base">Prompt</CardTitle>
          <CopyButton text={meta.prompt} />
        </CardHeader>
        <CardContent className="pt-3">
          <pre className="max-h-105 overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {meta.prompt}
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">When:</span> {meta.when} You still review the
            result.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
