import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsv } from "@/lib/analysis/csv";
import { validateReport } from "@/lib/analysis/report-schema";
import { USE_CASES } from "@/lib/analysis/uc-meta";

const root = process.cwd();

describe("report contract", () => {
  it("accepts every committed run", () => {
    for (const uc of ["uc1", "uc2", "uc3", "uc4", "uc5"]) {
      const dir = join(root, "workshop", "runs", uc);
      for (const name of readdirSync(dir)) {
        const reportPath = join(dir, name, "report.json");
        if (!existsSync(reportPath)) continue;
        const raw = JSON.parse(readFileSync(reportPath, "utf8"));
        expect(validateReport(raw), `${uc}/${name}`).toEqual([]);
      }
    }
  });

  it("rejects a report that misses the contract", () => {
    const errors = validateReport({
      contract: "ledgerly.report.v1",
      useCase: 9,
      title: "",
      summary: "x",
      sections: [{ kind: "chart", chart: { type: "sankey" } }],
    });
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe("prompt sync", () => {
  it("README carries every use-case prompt verbatim", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    for (const uc of USE_CASES) {
      expect(readme, `README is missing the ${uc.slug} fence from lib/analysis/uc-meta.ts`).toContain(
        uc.prompt,
      );
    }
  });
});

describe("canon join", () => {
  it("every corpus customer is a seeded Ledgerly account with the same name", () => {
    const canon = JSON.parse(
      readFileSync(join(root, "workshop", "data", "canon.json"), "utf8"),
    ) as { accounts: Record<string, { name: string; plan: string }> };
    const corpus = parseCsv(
      readFileSync(join(root, "workshop", "data", "shared", "customers.csv"), "utf8"),
    );
    expect(corpus).toHaveLength(14);
    for (const row of corpus) {
      const account = canon.accounts[row.customer_id];
      expect(account, `${row.customer_id} missing from canon.json`).toBeDefined();
      expect(account.name).toBe(row.name);
      expect(["STARTER", "GROWTH", "SCALE"]).toContain(account.plan);
    }
  });
});

describe("csv parser", () => {
  it("handles quoted commas and escaped quotes", () => {
    const rows = parseCsv('a,b\n"1,5","say ""hi"""\nplain,2\n');
    expect(rows).toEqual([
      { a: "1,5", b: 'say "hi"' },
      { a: "plain", b: "2" },
    ]);
  });
});
