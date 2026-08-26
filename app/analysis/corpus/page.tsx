import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCanon, getKnowledgeDocs, getResearchSources } from "@/lib/analysis/corpus";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Corpus browser" };

const STATUS_TONE: Record<string, string> = {
  authoritative: "bg-success-soft text-success",
  reviewed: "bg-indigo-soft text-indigo",
  superseded: "bg-danger-soft text-danger",
  draft: "bg-warning-soft text-warning",
};

export default function CorpusPage() {
  const docs = getKnowledgeDocs();
  const sources = getResearchSources();
  const canon = getCanon();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workshop"
        title="Corpus browser"
        description={`Metadata index of the ${canon.world.release} release packet (use case 1) and the market research sources (use case 4). Read-only: the native files stay under workshop/data — parsing them is the exercise.`}
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/analysis">
              <ChevronLeft className="size-4" /> Analysis
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            Release packet — {docs.length} documents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Link
                      href={`/analysis/corpus/${doc.id}`}
                      className="font-mono text-xs text-indigo hover:underline"
                    >
                      {doc.id}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-72">
                    <Link href={`/analysis/corpus/${doc.id}`} className="text-sm hover:underline">
                      {doc.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {doc.category} · {doc.sourceType}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-normal", STATUS_TONE[doc.status] ?? "bg-muted text-muted-foreground")}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {doc.accessClassification}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.region}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {doc.lastUpdatedDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Research sources — {sources.length}</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reliability</TableHead>
                <TableHead>Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>
                    <Link
                      href={`/analysis/corpus/${source.id}`}
                      className="font-mono text-xs text-indigo hover:underline"
                    >
                      {source.id}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-80">
                    <Link href={`/analysis/corpus/${source.id}`} className="text-sm hover:underline">
                      {source.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{source.sourceType}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{source.publishedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
