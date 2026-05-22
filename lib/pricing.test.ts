import { describe, it, expect } from "vitest";
import { calculatePrice } from "@/lib/pricing";
import type { Cart } from "@/lib/types";

// These two tests come from the README. They will fail until you implement
// calculatePrice. Add MORE tests below for the edge cases you can think of —
// we look closely at your test coverage.

describe("calculatePrice", () => {
  it("worked example: bundle discount + free shipping threshold", () => {
    const cart: Cart = {
      items: [
        { id: "m1", name: "Wireless Mouse", category: "accessory", unitPrice: 25.0, quantity: 2 },
        { id: "l1", name: "Laptop", category: "device", unitPrice: 800.0, quantity: 1 },
      ],
      customerTier: "none",
    };
    const r = calculatePrice(cart);
    expect(r.itemSubtotal).toBeCloseTo(850.0, 2);
    expect(r.subtotalAfterDiscounts).toBeCloseTo(835.0, 2);
    expect(r.shipping).toBeCloseTo(0, 2);
    expect(r.tax).toBeCloseTo(70.98, 2);
    expect(r.total).toBeCloseTo(905.98, 2);
  });

  it("scenario B: SAVE20 is capped at $50", () => {
    const cart: Cart = {
      items: [{ id: "tv", name: "OLED TV", category: "device", unitPrice: 1200.0, quantity: 1 }],
      customerTier: "none",
      couponCode: "SAVE20",
    };
    const r = calculatePrice(cart);
    const save20 = r.discounts.find((d) => d.label.includes("SAVE20"));
    expect(save20?.amount).toBeCloseTo(50.0, 2);
    expect(r.total).toBeCloseTo(1247.75, 2);
  });

  // TODO: add tests for bulk discount, loyalty tiers, unknown coupon warning,
  // FREESHIP, the clamp-to-zero case, and anything else you think matters.
});
