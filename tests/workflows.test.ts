import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CLI_BEATS, DECK_BEATS, DEMO_TRACKS, WORKFLOWS } from "@/lib/workflows/meta";

const root = process.cwd();

describe("prompt sync", () => {
  it("keeps README prompts and howto demo prompts in sync with metadata", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    const howto = readFileSync(join(root, "demo-howto.md"), "utf8");
    for (const workflow of WORKFLOWS) {
      expect(
        readme,
        `README is missing the ${workflow.slug} prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.prompt);
      expect(
        howto,
        `demo-howto.md is missing the ${workflow.slug} demo prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.demoPrompt);
      expect(workflow.demoPrompt).toContain("lib/workflows/meta.ts");
      expect(workflow.demoPrompt).toContain(workflow.slug);
    }

    const track201 = DEMO_TRACKS.find((track) => track.id === "201");
    const advanced = DEMO_TRACKS.find((track) => track.id === "advanced");

    expect(track201?.workflowSlugs).toEqual(["multitask", "loop", "autopilot", "orchestrate"]);
    expect(advanced?.workflowSlugs).toContain("goal");
    expect(track201?.workflowSlugs).not.toContain("goal");

    for (const workflow of WORKFLOWS) {
      const expectedTracks = DEMO_TRACKS.filter((track) =>
        track.workflowSlugs.some((slug) => slug === workflow.slug),
      ).map((track) => track.id);
      expect(workflow.tracks).toEqual(expectedTracks);
    }

    const autopilot = WORKFLOWS.find((workflow) => workflow.slug === "autopilot");

    expect(autopilot?.command).toBe("/autopilot");
    expect(autopilot?.prompt.startsWith("/autopilot")).toBe(true);
    expect(autopilot?.prompt).not.toContain("/goal");
    expect(autopilot?.blurb).toContain("/babysit");

    expect(CLI_BEATS.map((beat) => beat.id)).toEqual(["cli-setup", "cli-ask", "cli-session"]);
    expect(CLI_BEATS[1]?.example).toContain("agent --trust --mode=ask");
    expect(CLI_BEATS[1]?.example).toContain("dsp_1043");

    const cloud = DECK_BEATS.find((beat) => beat.id === "cloud");
    const automations = DECK_BEATS.find((beat) => beat.id === "automations");
    const trust = DECK_BEATS.find((beat) => beat.id === "trust");
    const loop = WORKFLOWS.find((workflow) => workflow.slug === "loop");

    expect(cloud?.example).toContain("Do not launch a Cloud Agent");
    expect(cloud?.example).not.toMatch(/^Hand this repo to a Cloud Agent/);
    expect(automations?.example.startsWith("/automate")).toBe(true);
    expect(automations?.example).toContain("Draft only");
    expect(automations?.example).toContain("Do not add a GitHub Actions file");
    expect(trust?.example).toContain("npm test");
    expect(trust?.example).toContain("Do not change lib/dispute-credit.ts");
    expect(trust?.example).not.toMatch(/^npx vitest run/);
    expect(loop?.prompt.startsWith("/loop")).toBe(true);
    expect(loop?.prompt).toContain("POST http://127.0.0.1:43173/api/demo/job");
    expect(autopilot?.prompt).toContain("no open pull request");
  });
});
