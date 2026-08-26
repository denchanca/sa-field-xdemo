#!/usr/bin/env node
/**
 * Assert vendored syn-data counts and the Ledgerly-world remap.
 * Does not import into the Ledgerly app. Run: node workshop/verify-corpus.mjs
 *
 * Checks:
 *   1. locked corpus counts (docs, feedback rows, cases, sources, scenarios)
 *   2. planted evaluation facts survived the remap
 *   3. sha-256 pins on two sentinel files
 *   4. zero-leak: no retired pre-remap name appears anywhere in the corpus —
 *      raw bytes, file names, or inside OOXML zip parts.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "data");

function countFiles(dir) {
  return readdirSync(dir).filter((name) => !name.startsWith(".")).length;
}

function sha256(rel) {
  return createHash("sha256").update(readFileSync(join(root, rel))).digest("hex");
}

const checks = [];
function check(label, ok, detail) {
  checks.push({ label, ok, detail });
  if (!ok) console.error(`FAIL ${label}: ${detail}`);
  else console.log(`ok   ${label}: ${detail}`);
}

// 1 — locked counts -----------------------------------------------------------
const uc1 = countFiles(join(root, "use_case_1_enterprise_knowledge/documents"));
check("UC1 docs", uc1 === 60, String(uc1));

const feedback = readFileSync(join(root, "use_case_2_product_management_copilot/feedback.csv"), "utf8")
  .trim()
  .split("\n").length - 1;
check("UC2 feedback", feedback === 120, String(feedback));

const caseLines = readFileSync(join(root, "use_case_3_operations_automation/cases.csv"), "utf8")
  .trim()
  .split("\n")
  .slice(1);
const automate = caseLines.filter((line) => /,automate,,new$/.test(line)).length;
const escalate = caseLines.filter((line) => /,escalate,[a-z_]+,new$/.test(line)).length;
check("UC3 cases", caseLines.length === 50, String(caseLines.length));
check("UC3 automate", automate === 35, String(automate));
check("UC3 escalate", escalate === 15, String(escalate));

const uc4 = countFiles(join(root, "use_case_4_research_synthesis/sources"));
check("UC4 sources", uc4 === 16, String(uc4));

const scenarios = readFileSync(
  join(root, "use_case_5_decision_support/scenario_inputs_and_outputs.csv"),
  "utf8",
)
  .trim()
  .split("\n").length - 1;
check("UC5 scenarios", scenarios === 3, String(scenarios));

// 2 — planted facts survived the remap ---------------------------------------
const docsMeta = readFileSync(join(root, "use_case_1_enterprise_knowledge/documents_metadata.csv"), "utf8");
check(
  "UC1 DOC-0004 superseded by DOC-0003",
  /DOC-0004,[^\n]*,superseded,DOC-0003,/.test(docsMeta),
  "supersession row present",
);

const claims = readFileSync(join(root, "use_case_4_research_synthesis/claim_ledger.csv"), "utf8");
const con001 = (claims.match(/CON-001/g) ?? []).length;
check("UC4 CON-001 contradiction pair", con001 === 2, `${con001} claims in group`);

const decision = JSON.parse(
  readFileSync(join(root, "use_case_5_decision_support/decision_record.json"), "utf8"),
);
check(
  "UC5 DEC-001 pending_human_review",
  decision.decision_id === "DEC-001" &&
    decision.status === "pending_human_review" &&
    decision.recommended_option === null,
  decision.status,
);

const evalQuestions = JSON.parse(
  readFileSync(join(root, "use_case_1_enterprise_knowledge/evaluation_questions.json"), "utf8"),
);
check("UC1 eval questions", evalQuestions.length === 12, String(evalQuestions.length));

// 3 — sentinel hashes (post-remap) --------------------------------------------
const known = [
  [
    "use_case_1_enterprise_knowledge/documents/DOC-0001_production_change_approval.pdf",
    "7496b103f53c25c5de2cb91e00951ad5e97ad74309702bd3d29d69dbf80f6d34",
  ],
  [
    "shared/products.csv",
    "71649fb0f45aca1f8482b8547cd95f9851dced9c1b5c9fe7bd19940544cdb62a",
  ],
];
for (const [rel, expected] of known) {
  const got = sha256(rel);
  check(`sha ${rel}`, got === expected, got);
}

// 4 — zero-leak gate -----------------------------------------------------------
// Retired pre-remap names. Split so this scanner never matches itself when the
// packaged tree is grepped for the same strings.
const RETIRED = ["at" + "las", "orion" + "works", "re" + "lay", "bea" + "con", "nova" + "flow", "orbit" + "ops"];
const RETIRED_RE = new RegExp("(" + RETIRED.join("|") + ")", "i");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

async function scanLeaks() {
  let leaks = 0;
  let JSZip = null;
  try {
    ({ default: JSZip } = await import("jszip"));
  } catch {
    console.warn("warn: jszip unavailable (run npm i) — OOXML interiors not scanned this run");
  }
  for (const path of walk(root)) {
    const rel = relative(root, path);
    if (RETIRED_RE.test(rel)) {
      console.error(`LEAK in file name: ${rel}`);
      leaks++;
    }
    const ext = path.split(".").pop().toLowerCase();
    if (["docx", "pptx", "xlsx"].includes(ext)) {
      if (!JSZip) continue;
      const zip = await JSZip.loadAsync(readFileSync(path));
      for (const name of Object.keys(zip.files)) {
        if (!/\.(xml|rels)$/.test(name)) continue;
        const txt = await zip.files[name].async("string");
        if (RETIRED_RE.test(txt) || RETIRED_RE.test(txt.replace(/<[^>]+>/g, ""))) {
          console.error(`LEAK inside ${rel} (${name})`);
          leaks++;
        }
      }
    } else if (RETIRED_RE.test(readFileSync(path).toString("latin1"))) {
      console.error(`LEAK in bytes: ${rel}`);
      leaks++;
    }
  }
  return leaks;
}

const leaks = await scanLeaks();
check("zero-leak (retired names)", leaks === 0, `${leaks} leak(s)`);

// ------------------------------------------------------------------------------
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed`);
  process.exit(1);
}
console.log(`\n${checks.length} checks passed (syn-data e3bc025, remapped to the Ledgerly world)`);
