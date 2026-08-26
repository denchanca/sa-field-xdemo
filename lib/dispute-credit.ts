/**
 * Suggested credit for a dispute.
 *
 * INTENTIONAL BUG. Do not change unless asked to cap suggested credit.
 *
 * Correct behavior: never suggest more credit than the catalog plan price
 * ($49 / $99 / $249 in cents). Do not invent a price.
 */
export function suggestDisputeCredit(input: {
  disputedAmountCents: number;
  planPriceCents: number;
}): number {
  if (input.disputedAmountCents < 0 || input.planPriceCents < 0) {
    throw new Error("Credit inputs must be non-negative cents.");
  }

  // BUG: ignores the catalog cap. Seeded dispute dsp_1043 claims $400 against a
  // $249 Scale invoice, so the dispute page renders a $400 suggestion — money
  // Ledgerly never charged.
  return input.disputedAmountCents;
}
