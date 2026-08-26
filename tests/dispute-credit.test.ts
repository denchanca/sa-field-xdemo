/**
 * INTENTIONAL FAIL — Cloud Agent target
 *
 * This test is supposed to fail on main. Do not "clean it up" in a local
 * lint pass unless asked to cap suggested credit at the catalog plan price.
 *
 * Expected: min(disputedAmountCents, planPriceCents)
 * Actual today: suggestDisputeCredit returns the disputed amount uncapped.
 */
import { describe, expect, it } from "vitest";
import { suggestDisputeCredit } from "@/lib/dispute-credit";
import { PLAN_PRICE_CENTS } from "@/lib/plans";

describe("suggestDisputeCredit", () => {
  it("never suggests more credit than the invoice plan price", () => {
    const suggested = suggestDisputeCredit({
      disputedAmountCents: 40_000,
      planPriceCents: PLAN_PRICE_CENTS.SCALE,
    });

    expect(suggested).toBe(PLAN_PRICE_CENTS.SCALE);
  });
});
