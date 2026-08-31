import Link from "next/link";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DECK_BEATS,
  DEMO_TRACKS,
  PROJECT_AGENTS,
  PROJECT_SKILLS,
  getWorkflow,
  type WorkflowMeta,
} from "@/lib/workflows/meta";

export const metadata = { title: "Workflows" };

function WorkflowCard({ workflow }: { workflow: WorkflowMeta }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.08em] text-indigo uppercase">
              {workflow.command}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{workflow.title}</h3>
          </div>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {workflow.handsOver}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{workflow.blurb}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">When:</span> {workflow.when}
        </p>
        <div className="mt-auto flex items-center justify-end pt-1">
          <Button asChild size="sm" variant="ghost" className="text-indigo">
            <Link href={`/workflows/${workflow.slug}`}>
              Open <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function workflowsFor(slugs: readonly string[]) {
  return slugs.map(getWorkflow).filter((workflow): workflow is WorkflowMeta => workflow !== undefined);
}

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cursor"
        title="Workflows"
        description="Two tracks, independent beats. Start with 201 or jump straight to an advanced workflow."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="#track-201">201 track</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="#track-advanced">Advanced track</Link>
            </Button>
          </div>
        }
      />

      <section id="track-201" className="scroll-mt-6 space-y-4">
        <div>
          <p className="font-mono text-xs font-medium tracking-[0.08em] text-indigo uppercase">
            Track 1
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">201</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {DEMO_TRACKS[0].description}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {DECK_BEATS.map((beat) => (
            <Card key={beat.id}>
              <CardContent className="space-y-1.5">
                <p className="font-medium">{beat.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{beat.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {workflowsFor(DEMO_TRACKS[0].workflowSlugs).map((workflow) => (
            <WorkflowCard key={`201-${workflow.slug}`} workflow={workflow} />
          ))}
        </div>
      </section>

      <section id="track-advanced" className="scroll-mt-6 space-y-4 border-t border-border pt-6">
        <div>
          <p className="font-mono text-xs font-medium tracking-[0.08em] text-indigo uppercase">
            Track 2
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Advanced</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {DEMO_TRACKS[1].description}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {workflowsFor(DEMO_TRACKS[1].workflowSlugs).map((workflow) => (
            <WorkflowCard key={`advanced-${workflow.slug}`} workflow={workflow} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-indigo" />
          <h2 className="text-lg font-semibold tracking-tight">Agents and skills</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Project subagents live in <code className="rounded bg-muted px-1 py-0.5 text-xs">.cursor/agents/</code>.
          Skills pick the command or dispatch workers.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {PROJECT_AGENTS.map((agent) => (
            <Card key={agent.name}>
              <CardContent className="space-y-1">
                <p className="font-mono text-sm font-medium">{agent.name}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{agent.when}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{agent.path}</p>
              </CardContent>
            </Card>
          ))}
          {PROJECT_SKILLS.map((skill) => (
            <Card key={skill.name}>
              <CardContent className="space-y-1">
                <p className="flex items-center gap-1.5 font-mono text-sm font-medium">
                  <Sparkles className="size-3.5 text-indigo" />
                  {skill.name}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">{skill.when}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{skill.path}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
