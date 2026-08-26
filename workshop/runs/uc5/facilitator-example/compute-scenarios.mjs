#!/usr/bin/env node
// Recompute the three Collections 4.2 EU scenarios from first principles and
// check them against expected_calculation_checks.json. Rerun me:
//   node workshop/runs/uc5/facilitator-example/compute-scenarios.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "../../../data/use_case_5_decision_support");
const rows = readFileSync(join(dataDir, "scenario_inputs_and_outputs.csv"), "utf8").trim().split("\n");
const header = rows[0].split(",");
const checks = JSON.parse(readFileSync(join(dataDir, "expected_calculation_checks.json"), "utf8"));

let failures = 0;
for (const line of rows.slice(1)) {
  const cells = Object.fromEntries(line.split(",").map((v, i) => [header[i], v]));
  const n = (key) => Number(cells[key]);
  const computed = {
    expected_adopters: n("eligible_accounts") * n("adoption_rate"),
    projected_revenue: n("eligible_accounts") * n("adoption_rate") * n("annual_contract_value"),
    support_cost: n("eligible_accounts") * n("adoption_rate") * n("support_cost_per_adopter"),
    expected_risk_cost: n("risk_probability") * n("risk_impact"),
  };
  computed.risk_adjusted_value =
    computed.projected_revenue - computed.support_cost - computed.expected_risk_cost - n("remediation_cost");
  const check = checks.find((c) => c.scenario_id === cells.scenario_id);
  console.log(`\n${cells.scenario_id} (${cells.name})`);
  for (const key of ["expected_adopters", "projected_revenue", "support_cost", "expected_risk_cost", "risk_adjusted_value"]) {
    const ok = Math.abs(computed[key] - check[key]) <= (check.tolerance ?? 0.01);
    if (!ok) failures++;
    console.log(`  ${key.padEnd(20)} computed=${computed[key].toFixed(2).padStart(12)} expected=${String(check[key]).padStart(12)} ${ok ? "ok" : "MISMATCH"}`);
  }
}
console.log(failures === 0 ? "\nAll scenario calculations verified." : `\n${failures} mismatch(es)`);
process.exit(failures === 0 ? 0 : 1);
