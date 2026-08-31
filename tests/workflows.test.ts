import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WORKFLOWS } from "@/lib/workflows/meta";

const root = process.cwd();

describe("prompt sync", () => {
  it("README carries every workflow prompt verbatim", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    for (const workflow of WORKFLOWS) {
      expect(
        readme,
        `README is missing the ${workflow.slug} prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.prompt);
    }
  });
});
