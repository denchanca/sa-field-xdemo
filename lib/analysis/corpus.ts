import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "@/lib/analysis/csv";

/**
 * Read-only, request-time access to workshop/data metadata. This is the one
 * sanctioned touchpoint between the app and the corpus: no module imports,
 * no database ingestion — the corpus stays files (see AGENTS.md).
 */

const DATA_ROOT = join(process.cwd(), "workshop", "data");

export type CanonAccount = {
  customerId: string;
  invoiceId: string;
  invoiceNumber: string;
  name: string;
  segment: string;
  plan: string;
  contactName: string;
  email: string;
};

export type Canon = {
  world: {
    company: string;
    workspace: string;
    operator: string;
    release: string;
    planned_release_date: string;
    products: Record<string, string>;
    competitors: string[];
  };
  clocks: { demo_as_of: string; corpus_reference: string };
  catalog_cents: Record<string, number>;
  accounts: Record<string, CanonAccount>;
};

export function getCanon(): Canon {
  return JSON.parse(readFileSync(join(DATA_ROOT, "canon.json"), "utf8")) as Canon;
}

export type CorpusDoc = {
  id: string;
  title: string;
  category: string;
  sourceType: string;
  artifactPath: string;
  authorPersonId: string;
  ownerTeamId: string;
  createdDate: string;
  lastUpdatedDate: string;
  effectiveDate: string;
  version: string;
  status: string;
  supersededBy: string;
  productTags: string;
  systemTags: string;
  region: string;
  accessClassification: string;
  intendedAudience: string;
};

export function getKnowledgeDocs(): CorpusDoc[] {
  const raw = readFileSync(
    join(DATA_ROOT, "use_case_1_enterprise_knowledge", "documents_metadata.csv"),
    "utf8",
  );
  return parseCsv(raw).map((row) => ({
    id: row.document_id,
    title: row.title,
    category: row.category,
    sourceType: row.source_type,
    artifactPath: `use_case_1_enterprise_knowledge/${row.artifact_path}`,
    authorPersonId: row.author_person_id,
    ownerTeamId: row.owner_team_id,
    createdDate: row.created_date,
    lastUpdatedDate: row.last_updated_date,
    effectiveDate: row.effective_date,
    version: row.version,
    status: row.status,
    supersededBy: row.superseded_by,
    productTags: row.product_tags,
    systemTags: row.system_tags,
    region: row.region,
    accessClassification: row.access_classification,
    intendedAudience: row.intended_audience,
  }));
}

export type CorpusSource = {
  id: string;
  title: string;
  sourceType: string;
  publisher: string;
  publishedDate: string;
  retrievedDate: string;
  artifactPath: string;
  reliability: string;
  accessClassification: string;
};

export function getResearchSources(): CorpusSource[] {
  const raw = readFileSync(
    join(DATA_ROOT, "use_case_4_research_synthesis", "sources_metadata.csv"),
    "utf8",
  );
  return parseCsv(raw).map((row) => ({
    id: row.source_id,
    title: row.title,
    sourceType: row.source_type,
    publisher: row.publisher,
    publishedDate: row.published_date,
    retrievedDate: row.retrieved_date,
    artifactPath: `use_case_4_research_synthesis/${row.artifact_path}`,
    reliability: row.reliability,
    accessClassification: row.access_classification,
  }));
}

export function findCorpusEntry(id: string) {
  if (/^DOC-\d{4}$/.test(id)) {
    const doc = getKnowledgeDocs().find((d) => d.id === id);
    return doc ? { kind: "doc" as const, doc } : null;
  }
  if (/^SRC-\d{3}$/.test(id)) {
    const source = getResearchSources().find((s) => s.id === id);
    return source ? { kind: "source" as const, source } : null;
  }
  return null;
}

/** Resolve a citation ID to a live app link, when one exists. */
export function resolveCitation(id: string): { href: string | null; label: string; hint?: string } {
  if (/^DOC-\d{4}$/.test(id) || /^SRC-\d{3}$/.test(id))
    return { href: `/analysis/corpus/${id}`, label: id };
  if (/^CUST-\d{3}$/.test(id)) {
    const account = getCanon().accounts[id];
    if (account)
      return { href: `/invoices/${account.invoiceId}`, label: id, hint: account.name };
    return { href: null, label: id };
  }
  if (/^inv_/.test(id)) return { href: `/invoices/${id}`, label: id };
  if (/^INV-\d+$/.test(id)) {
    const account = Object.values(getCanon().accounts).find((a) => a.invoiceNumber === id);
    return { href: account ? `/invoices/${account.invoiceId}` : null, label: id };
  }
  if (/^dsp_/.test(id)) return { href: `/disputes/${id}`, label: id };
  return { href: null, label: id };
}

/** Cell values in report tables that should render as citation chips. */
export const CITATION_SHAPE =
  /^(DOC-\d{4}|SRC-\d{3}|CUST-\d{3}|TKT-\d{5}|FBK-\d{4}|CLM-\d{4}|EVD-\d{4}|RSK-\d{3}|SCN-\d{3}|THM-\d{3}|POL-\d{3}|DEC-\d{3}|Q-\d{3}|inv_\w+|INV-\d+|dsp_\w+)$/;

export function corpusFileExists(relPath: string): boolean {
  return existsSync(join(DATA_ROOT, relPath));
}
