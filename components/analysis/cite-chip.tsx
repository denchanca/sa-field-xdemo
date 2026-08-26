import Link from "next/link";
import { resolveCitation } from "@/lib/analysis/corpus";
import { cn } from "@/lib/utils";

/** A citation ID chip. Links to a live page when one exists. */
export function CiteChip({ id, className }: { id: string; className?: string }) {
  const { href, label, hint } = resolveCitation(id);
  const chip = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px] leading-4",
        href
          ? "border-indigo-soft bg-indigo-soft/60 text-indigo hover:bg-indigo-soft"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
      title={hint}
    >
      {label}
      {hint ? <span className="hidden font-sans text-[10px] opacity-70 sm:inline">{hint}</span> : null}
    </span>
  );
  return href ? <Link href={href}>{chip}</Link> : chip;
}

export function CiteList({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-middle">
      {ids.map((id) => (
        <CiteChip key={id} id={id} />
      ))}
    </span>
  );
}
