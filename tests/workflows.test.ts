import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEMO_TRACKS, WORKFLOWS } from "@/lib/workflows/meta";

const root = process.cwd();

describe("prompt sync", () => {
  it("README and presenter howto carry every workflow prompt verbatim", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    const howto = readFileSync(join(root, "demo-howto.md"), "utf8");
    for (const workflow of WORKFLOWS) {
      expect(
        readme,
        `README is missing the ${workflow.slug} prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.prompt);
      expect(
        howto,
        `demo-howto.md is missing the ${workflow.slug} prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.prompt);
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
  });
});
