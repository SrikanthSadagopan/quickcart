import type { Cart, PriceResult, LineBreakdown, AppliedDiscount } from "@/lib/types";

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
export function calculatePrice(cart: Cart): PriceResult {
  const round = (value: number): number =>
  Math.round(value * 100) / 100;

  const lineItems: LineBreakdown[] = [];

  const discounts: AppliedDiscount[] = [];

  const warnings: string[] = [];

  let itemSubtotal = 0;

  let hasDevice = false;
  let hasAccessory = false;

  // STEP 1 + STEP 2
  // Line subtotal + bulk discount
  for (const item of cart.items) {
    const lineSubtotal = round(
      item.unitPrice * item.quantity
    );

    const bulkDiscount =
      item.quantity >= 10
        ? round(lineSubtotal * 0.1)
        : 0;

    const finalLineTotal =
      lineSubtotal - bulkDiscount;

    itemSubtotal += finalLineTotal;

    lineItems.push({
      id: item.id,
      lineSubtotal,
      bulkDiscount,
    });

    if (item.category === "device") {
      hasDevice = true;
    }

    if (item.category === "accessory") {
      hasAccessory = true;
    }
  }
  itemSubtotal = round(itemSubtotal);
  let runningTotal = itemSubtotal;

  // STEP 3
  // Bundle discount
  if (hasDevice && hasAccessory) {
    runningTotal -= 15;

    discounts.push({
      label: "Bundle discount",
      amount: 15,
    });
  }

  // STEP 4
  // Coupon handling
  let freeShipping = false;

  if (cart.couponCode) {
    const coupon =
      cart.couponCode.trim().toUpperCase();

    if (coupon === "SAVE20") {
      const rawDiscount = round(
        runningTotal * 0.2
      );

      const couponDiscount =
        Math.min(rawDiscount, 50);

      runningTotal -= couponDiscount;

      discounts.push({
        label: "SAVE20",
        amount: couponDiscount,
      });
    } else if (coupon === "FREESHIP") {
      freeShipping = true;
    } else {
      warnings.push(
        `Unknown coupon code: ${coupon}`
      );
    }
  }

  // STEP 5
  // Loyalty discount
  let loyaltyRate = 0;

  switch (cart.customerTier) {
    case "gold":
      loyaltyRate = 0.05;
      break;

    case "silver":
      loyaltyRate = 0.02;
      break;

    default:
      loyaltyRate = 0;
  }

  const loyaltyDiscount = round(
    runningTotal * loyaltyRate
  );

  if (loyaltyDiscount > 0) {
    runningTotal -= loyaltyDiscount;

    discounts.push({
      label: `${cart.customerTier} loyalty`,
      amount: loyaltyDiscount,
    });
  }

  // STEP 6
  // Clamp
  runningTotal = Math.max(
    round(runningTotal),
    0
  );

  // STEP 7
  // Shipping
  const shipping =
    freeShipping || runningTotal >= 100
      ? 0
      : 9.99;

  // STEP 8
  // Tax
  const tax = round(
    runningTotal * 0.085
  );

  // STEP 9
  // Total
  const total = round(
    runningTotal + shipping + tax
  );

  return {
    lineItems,
    itemSubtotal,
    discounts,
    subtotalAfterDiscounts: runningTotal,
    shipping,
    tax,
    total,
    warnings,
  };
}  
