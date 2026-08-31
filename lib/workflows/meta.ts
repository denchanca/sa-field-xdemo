/**
 * Advanced Cursor workflows as they appear on /workflows and in the README.
 * Prompts are the source of truth — the README test requires them verbatim.
 */

export type WorkflowMeta = {
  slug: "multitask" | "loop" | "goal" | "orchestrate";
  command: string;
  title: string;
  handsOver: string;
  when: string;
  blurb: string;
  prompt: string;
};

export const WORKFLOWS: WorkflowMeta[] = [
  {
    slug: "multitask",
    command: "/multitask",
    title: "Hands over breadth",
    handsOver: "breadth",
    when: "Many independent pieces of one request.",
    blurb:
      "Four API surfaces, four workers, one finish line. Independent steps run at once; you review one diff per task.",
    prompt: `/multitask Add the same small request-log helper to Ledgerly's four independent API surfaces: invoices, disputes, Nudge, and Pulse.

Use the dispatch-subagents skill. Launch four api-instrumenter subagents in one parallel turn — one route each:
- app/api/invoices/route.ts and app/api/invoices/[id]/route.ts
- app/api/disputes/route.ts and app/api/disputes/[id]/route.ts
- app/api/mock/nudge/route.ts
- app/api/mock/pulse/route.ts

A shared helper may live under lib/. Each worker starts with clean context; the dispatch prompt must name the files, the helper, and the constraint. After the diffs land, launch the ledgerly-reviewer subagent. Do not touch prices, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. I will review one diff per task.`,
  },
  {
    slug: "loop",
    command: "/loop",
    title: "Hands over time",
    handsOver: "time",
    when: "You would otherwise sit and watch a job finish.",
    blurb:
      "Start the local invoice backfill, then let the agent check it on a schedule until it completes — or until you stop the loop.",
    prompt: `Start the local demo job, then hand over the checking.

1. POST http://127.0.0.1:43173/api/demo/job to start the invoice backfill (idle → running → complete over about 45 seconds).
2. /loop 10s Check GET http://127.0.0.1:43173/api/demo/job until status is complete, or until I stop the loop.

Do not add GitHub Actions. Do not write to the Ledgerly database. You still stop the loop; I still review the result.`,
  },
  {
    slug: "goal",
    command: "/goal",
    title: "Hands over the objective",
    handsOver: "the objective",
    when: "One objective with a clear finish, and you are still steering.",
    blurb:
      "Pin dispute resolution as one long-lived objective. The agent keeps going across turns until the checks pass. You review the result.",
    prompt: `/goal Make Ledgerly demo-complete for dispute resolution.

1. Cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price from lib/plans.ts.
2. Implement resolveDispute in lib/disputes/resolve.ts.
3. Make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note.
4. Enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx.
5. Keep going across turns until npm test is fully green and http://127.0.0.1:43173/disputes/dsp_1043 shows suggested credit at or below the Scale catalog price of $249.

Do not change prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. Do not invent a fourth price. When the checks pass, launch the dispute-verifier subagent to report evidence. I still review the result.`,
  },
  {
    slug: "orchestrate",
    command: "/orchestrate",
    title: "Hands over the plan itself",
    handsOver: "the plan itself",
    when: "One objective that first needs its own plan, staffed across agents.",
    blurb:
      "A root planner decomposes dispute resolution and staffs isolated workers. Verifiers check the work. This one is a plugin.",
    prompt: `/orchestrate Make Ledgerly demo-complete for dispute resolution. This is a plugin workflow — you need bun on PATH and a CURSOR_API_KEY (personal key or team service account, not a team admin key). Slack is optional.

Decompose the work. The root planner writes no code. Workers are isolated; every handoff points up. Staff at least:

- Worker: cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price. Do not touch tests/dispute-credit.test.ts or the seed.
- Worker: implement resolveDispute and POST /api/disputes/[id]/resolve.
- Worker: enable Accept / Decline on app/disputes/[id]/page.tsx.

Launch the dispute-verifier subagent as the verifier: it checks tests/dispute-credit.test.ts (or npm test), POSTs accept/decline against dsp_1043, and loads http://127.0.0.1:43173/disputes/dsp_1043. Republish a task if a verifier fails. I still review and merge. Do not invent a fourth price.`,
  },
];

export const PROJECT_AGENTS = [
  {
    name: "ledgerly-reviewer",
    path: ".cursor/agents/ledgerly-reviewer.md",
    when: "After any code change. Diff-only review against catalog prices, seed names, and planted seams.",
  },
  {
    name: "api-instrumenter",
    path: ".cursor/agents/api-instrumenter.md",
    when: "/multitask worker. Add the request-log helper to one named API route and nothing else.",
  },
  {
    name: "dispute-verifier",
    path: ".cursor/agents/dispute-verifier.md",
    when: "/goal and /orchestrate finish line. Report pass/fail evidence; write no product code.",
  },
] as const;

export const PROJECT_SKILLS = [
  {
    name: "choose-cursor-workflow",
    path: ".cursor/skills/choose-cursor-workflow/SKILL.md",
    when: "Pick /multitask, /loop, /goal, or /orchestrate from the shape of the work.",
  },
  {
    name: "dispatch-subagents",
    path: ".cursor/skills/dispatch-subagents/SKILL.md",
    when: "Many independent pieces. Launch Task subagents in one parallel turn.",
  },
  {
    name: "hand-to-cloud-agent",
    path: ".cursor/skills/hand-to-cloud-agent/SKILL.md",
    when: "The objective must survive closing the laptop, or needs a planner/worker/verifier tree.",
  },
] as const;

export function getWorkflow(slug: string): WorkflowMeta | undefined {
  return WORKFLOWS.find((workflow) => workflow.slug === slug);
}
