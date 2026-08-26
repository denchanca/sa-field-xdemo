"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Refreshes server data every few seconds so a finishing agent run appears without a manual reload. Pauses when the tab is hidden. */
export function AutoRefresh({ intervalMs = 6000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) router.refresh();
    };
    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);
  return null;
}
