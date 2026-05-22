import type { Cart, PriceResult } from "@/lib/types";

/**
 * Calculate the full price breakdown for a cart.
 *
 * Implement the rules in README.md, section "Pricing rules", applied IN ORDER.
 *
 * Requirements:
 *  - This must be a PURE function: same input -> same output, no side effects,
 *    and it must not mutate the `cart` argument.
 *  - All money in the returned object is in dollars (e.g. 12.34).
 *  - Read the "Decisions you must make" section of the README before you start.
 *
 * TODO: Implement this. Then make the tests in lib/pricing.test.ts pass and
 *       add your own tests for the edge cases.
 */
export function calculatePrice(_cart: Cart): PriceResult {
  throw new Error("calculatePrice is not implemented yet");
}
