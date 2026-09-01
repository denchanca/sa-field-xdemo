/**
 * Cursor workflows as they appear on /workflows and in the README.
 * Prompts are the source of truth — the README test requires them verbatim.
 */

export type DemoTrack = "201" | "advanced";

export type WorkflowMeta = {
  slug: "multitask" | "loop" | "autopilot" | "goal" | "orchestrate";
  command: string;
  title: string;
  handsOver: string;
  when: string;
  blurb: string;
  tracks: DemoTrack[];
  setup?: string;
  demoPrompt: string;
  prompt: string;
};

export const DEMO_TRACKS = [
  {
    id: "201" as const,
    title: "201",
    description:
      "Deck-aligned: orient, customize the agent, choose models, show Cloud Agents and Automations, then breadth, time, PR ownership, planning, and verification.",
    workflowSlugs: ["multitask", "loop", "autopilot", "orchestrate"] as const,
  },
  {
    id: "advanced" as const,
    title: "Advanced",
    description:
      "Deeper Ledgerly scenarios: Cursor CLI primer, durable goals, parallel workers, scheduled checking, PR supervision, planner trees, and verifier evidence.",
    workflowSlugs: ["goal", "multitask", "loop", "autopilot", "orchestrate"] as const,
  },
] as const;

export const DECK_BEATS = [
  {
    id: "orient",
    title: "Getting oriented",
    detail: "Ask traces prices, overdue invoices, and the intentionally unfinished dispute path.",
    example:
      "What are Ledgerly's only plan prices, and which seeded invoices are overdue? Cite lib/plans.ts, prisma/seed.ts, and prisma/extra-accounts.ts.\n\nExplain the dispute flow end to end. What is intentionally unfinished? Cite the resolve helper, the resolve API route, and the dispute page. Do not edit any files.",
  },
  {
    id: "customize",
    title: "Rules, skills, subagents",
    detail: "Open the Ledgerly rule, choose-cursor-workflow skill, and one focused worker.",
    example:
      "Open .cursor/rules/ledgerly.mdc, .cursor/skills/choose-cursor-workflow/SKILL.md, and .cursor/agents/api-instrumenter.md. Explain how rules, skills, and subagents differ in this repo. Do not edit them.",
  },
  {
    id: "models",
    title: "Model selection",
    detail:
      "Open a new Agent chat so the picker is visible. Match model to task shape: the parent plans and coordinates; each api-instrumenter worker touches one route.",
    example:
      "Look at the models available in this Cursor session (the chat picker, and cursor.com/docs/models if you need current labels). Then recommend a concrete split for Ledgerly /multitask:\n\n1. Parent — one current high-reasoning / thinking model from the picker. It has to decompose four API surfaces, write a dispatch that names files + helper + constraints, and launch ledgerly-reviewer after the diffs.\n2. Each api-instrumenter worker — one current faster focused model from the picker. One named route, a small helper under lib/, no catalog, seed, or dispute-credit test edits.\n\nName the exact picker labels you would select today and why each fits. If a label is missing on this account, say so and pick the next best available option. Do not invent a model. Do not write model slugs into the repo — this is a picker recommendation only. Say where to set them: the parent chat picker, and the model on each Task / api-instrumenter launch (or inherit if the worker should match the parent).",
  },
  {
    id: "cloud",
    title: "Cloud Agents",
    detail:
      "Draft the Cloud Agent brief. Do not launch unless you confirm the environment is ready.",
    example:
      "Use the hand-to-cloud-agent skill. Explain how to hand this Ledgerly repo to a Cloud Agent. Cite .cursor/environment.json (install, seed, port 43173). Draft the exact objective you would send: /autopilot if there is an open PR, otherwise a bounded /goal or /orchestrate that finishes dsp_1043 with suggested credit at or below $249 and npm test green. Do not launch a Cloud Agent unless I confirm the environment is ready. Do not invent a fourth price.",
  },
  {
    id: "automations",
    title: "Automations",
    detail:
      "Open the Automations editor with /automate. Draft only — do not save or enable. Not a local loop.",
    example:
      "/automate Create a PR-triggered Cursor Automation that reviews Ledgerly guardrails and leaves an evidence-backed comment. Review only; do not modify code, tests, seed, or CI. Use the automate skill. Draft only — do not save or enable the automation. Do not add a GitHub Actions file. If the Automations editor is not available, say so and stop.",
  },
  {
    id: "trust",
    title: "Trust and verification",
    detail:
      "Run the shipped suite. One failed test on a clean tree is expected. Do not fix the planted credit cap.",
    example:
      "Run npm test and report which tests passed and which failed. Do not edit any files.\n\nOn a clean tree, npm test is 1 failed / 9 passed. The red test is the planted credit cap. Do not change lib/dispute-credit.ts, tests/dispute-credit.test.ts, or the seed.",
  },
] as const;

/** Advanced-only Cursor CLI primer. Run these in a terminal at the repo root. */
export const CLI_BEATS = [
  {
    id: "cli-setup",
    title: "Check the CLI",
    detail:
      "Cursor CLI is the same agent in the terminal. Confirm it is installed and signed in before the Ask pass. First run in a new clone needs --trust. The app does not need to be running.",
    label: "Run in the terminal",
    example: "agent --version\nagent status",
  },
  {
    id: "cli-ask",
    title: "Ask mode",
    detail:
      "Ask is read-only. --trust is required until this directory is trusted; it is not --force. This pass explains why dsp_1043 suggests $400 on a $249 Scale invoice. Nothing should change.",
    label: "Run in the terminal",
    example:
      'agent --trust --mode=ask "Explain why dsp_1043 shows a $400 suggested credit on a $249 invoice. Cite the source files and do not edit anything."',
  },
  {
    id: "cli-session",
    title: "While the session is open",
    detail:
      "/model makes model choice explicit. Then ask which files would change to cap the credit — do not edit them. Ctrl-C leaves the session. Reserve --force; use agent -p only for scripts.",
    label: "Paste in the CLI session",
    example:
      "Which files would need to change to cap the credit and finish dispute resolution? Do not edit them.",
  },
] as const;

export const WORKFLOWS: WorkflowMeta[] = [
  {
    slug: "multitask",
    command: "/multitask",
    title: "Hands over breadth",
    handsOver: "breadth",
    when: "Many independent pieces of one request.",
    blurb:
      "Four API surfaces, four workers, one finish line. Independent steps run at once; you review one diff per task.",
    tracks: ["201", "advanced"],
    demoPrompt:
      "/multitask Read the multitask entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
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
    tracks: ["201", "advanced"],
    setup: "Dev server on 43173 (`npm run dev`). The invoice backfill is idle → running → complete over about 45 seconds.",
    demoPrompt:
      "/loop Read the loop entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/loop 10s Start the invoice backfill if it is idle (POST http://127.0.0.1:43173/api/demo/job), then GET that URL until status is complete, or until I stop the loop.

Do not add GitHub Actions. Do not write to the Ledgerly database. I still review the result.`,
  },
  {
    slug: "autopilot",
    command: "/autopilot",
    title: "Hands over the pull request",
    handsOver: "the pull request",
    when: "An open pull request must become merge-ready.",
    blurb:
      "Current name for the deck's /babysit workflow. It triages comments, resolves clear conflicts, and fixes scoped CI failures. You still merge.",
    tracks: ["201", "advanced"],
    setup:
      "Prepare an open pull request for the current feature branch with one actionable review comment or a scoped failing check.",
    demoPrompt:
      "/autopilot Read the autopilot entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/autopilot Keep the pull request for the current branch merge-ready.

If this branch has no open pull request, stop and say so. Do not open a PR or merge.

Refresh the live PR state before every pass. Work in this order: merge conflicts, active unresolved review comments (including Bugbot), then failing required checks. Validate each finding before acting. Fix only issues caused by this PR and keep every change inside its scope.

Never change CI checks, workflows, the Ledgerly catalog, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts to get green. Stop and ask if branch intent is ambiguous or a billing, security, privacy, migration, or concurrency comment needs judgment. Report ready only when the PR is mergeable, required checks are green, and every active comment is triaged. Do not merge or enable auto-merge; I still review and merge.`,
  },
  {
    slug: "goal",
    command: "/goal",
    title: "Hands over the objective",
    handsOver: "the objective",
    when: "One objective with a clear finish, and you are still steering.",
    blurb:
      "Pin dispute resolution as one long-lived objective. The agent keeps going across turns until the checks pass. You review the result.",
    tracks: ["advanced"],
    demoPrompt:
      "/goal Read the goal entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
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
    tracks: ["201", "advanced"],
    setup: "Install the /orchestrate plugin; put bun on PATH and provide a CURSOR_API_KEY.",
    demoPrompt:
      "/orchestrate Read the orchestrate entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
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
    when: "Pick the 201 or Advanced track, then choose the command from the shape of the work.",
  },
  {
    name: "dispatch-subagents",
    path: ".cursor/skills/dispatch-subagents/SKILL.md",
    when: "Many independent pieces. Launch Task subagents in one parallel turn.",
  },
  {
    name: "hand-to-cloud-agent",
    path: ".cursor/skills/hand-to-cloud-agent/SKILL.md",
    when: "Cloud /goal, /autopilot PR supervision, or an /orchestrate planner tree.",
  },
  {
    name: "autopilot",
    path: "~/.cursor/skills-cursor/autopilot/SKILL.md",
    when: "Current built-in skill for the deck's former /babysit PR workflow.",
  },
  {
    name: "automate",
    path: "~/.cursor/skills-cursor/automate/SKILL.md",
    when: "Open the Cursor Automations editor with a reviewed event- or schedule-driven draft.",
  },
] as const;

export function getWorkflow(slug: string): WorkflowMeta | undefined {
  return WORKFLOWS.find((workflow) => workflow.slug === slug);
}
