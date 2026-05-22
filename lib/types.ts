// Types for the QuickCart pricing engine.
// These are provided for you. You may add helper types, but do not change
// the shape of `Cart` or `PriceResult` — the API route and the UI depend on them.

export type Category = "device" | "accessory" | "other";

export type CustomerTier = "none" | "silver" | "gold";

export interface CartItem {
  id: string;
  name: string;
  category: Category;
  /** Unit price in dollars, e.g. 19.99 */
  unitPrice: number;
  /** Whole positive number of units */
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  customerTier: CustomerTier;
  /** At most one coupon code. May be missing or an unknown string. */
  couponCode?: string;
}

export interface AppliedDiscount {
  /** Human-readable label, e.g. "SAVE20" or "gold loyalty" */
  label: string;
  /** Positive dollar amount that was subtracted */
  amount: number;
}

export interface LineBreakdown {
  id: string;
  /** unitPrice * quantity, in dollars, before any discount */
  lineSubtotal: number;
  /** Bulk discount applied to this line, in dollars (0 if none) */
  bulkDiscount: number;
}

export interface PriceResult {
  lineItems: LineBreakdown[];
  /** Sum of all line subtotals after per-line bulk discounts */
  itemSubtotal: number;
  /** Bundle, coupon, and loyalty discounts, in the order they were applied */
  discounts: AppliedDiscount[];
  /** Running total after all discounts, before shipping and tax */
  subtotalAfterDiscounts: number;
  shipping: number;
  tax: number;
  total: number;
  /** Non-fatal notices, e.g. an unknown coupon code */
  warnings: string[];
}
