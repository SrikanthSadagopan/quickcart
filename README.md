# QuickCart — Pricing Engine Assignment

**Time budget: 3–4 hours.** Using an LLM is allowed, but read the warning at the
bottom before you lean on one — we evaluate your reasoning, not your ability to
paste.

You are building the pricing logic for a small online store. The UI and the API
route are already wired up. **Your job is the logic**: implement one pure
function so the rules below are computed correctly.

---

## What you'll build

Implement `calculatePrice(cart)` in **`lib/pricing.ts`**. It takes a `Cart` and
returns a `PriceResult` (both defined in `lib/types.ts`). When it's correct, the
provided page at `/` will show a correct price breakdown for each sample cart,
and the starter tests will pass.

You do **not** need to build new UI, add a database, add auth, or install extra
libraries. Keep it simple.

## Getting started

```bash
npm install
npm run dev      # open http://localhost:3000
npm test         # runs the test suite (Vitest)
```

The page calls `POST /api/price`, which calls your `calculatePrice`. Right now it
throws "not implemented" — that's your starting point.

---

## Pricing rules

All money inputs are in dollars (e.g. `19.99`). Apply these steps **in this exact
order** — the order changes the result.

1. **Line subtotal.** For each item, `unitPrice × quantity`.
2. **Bulk discount (per line).** If a single line's `quantity` is **10 or more**,
   subtract **10%** of that line's subtotal. `itemSubtotal` is the sum of every
   line's `(subtotal − its bulk discount)`.
3. **Bundle discount.** If the cart contains **at least one `device` AND at least
   one `accessory`**, subtract a flat **$15.00** from the running total (once).
4. **Coupon** (at most one `couponCode`):
   - `SAVE20` → **20% off** the current running total, but the discount is
     **capped at $50.00**.
   - `FREESHIP` → does not change the total, but makes shipping free (see rule 7).
   - Any other non-empty code → **ignore it** and add a warning string:
     `Unknown coupon code: <CODE>`.
5. **Loyalty discount** on the current running total: `gold` = **5%**,
   `silver` = **2%**, `none` = **0%**.
6. The running total can **never go below $0** — clamp it. (See decisions below.)
7. **Shipping.** Free if `FREESHIP` was applied **OR** the running total (after
   discounts, before tax) is **≥ $100.00**. Otherwise a flat **$9.99**.
8. **Tax.** **8.5%** of the running total after discounts. **Shipping is not taxed.**
9. **Total** = running total + shipping + tax.

Each discount you apply (bundle, coupon, loyalty) should appear in
`result.discounts` in the order it was applied.

---

## Worked example

Cart: `Wireless Mouse` (accessory, $25.00 ×2) + `Laptop` (device, $800.00 ×1),
tier `none`, no coupon.

| Step | Result |
|------|--------|
| Item subtotal | $850.00 |
| Bundle discount (device + accessory) | −$15.00 |
| Subtotal after discounts | $835.00 |
| Shipping (≥ $100 → free) | $0.00 |
| Tax (8.5% of $835.00) | $70.98 |
| **Total** | **$905.98** |

---

## Self-check scenarios

These are the sample carts in the dropdown. Your output should match (minor
rounding differences are discussed below).

| Cart | Subtotal after discounts | Shipping | Tax | Total | Notes |
|------|--------------------------|----------|-----|-------|-------|
| Worked example | $835.00 | $0.00 | $70.98 | **$905.98** | bundle, free ship |
| A — USB Cable $12 ×10, gold | $102.60 | $0.00 | $8.72 | **$111.32** | bulk + gold + free-ship threshold |
| B — OLED TV $1200, SAVE20 | $1150.00 | $0.00 | $97.75 | **$1247.75** | SAVE20 hits the $50 cap |
| C — Phone $40 + Case $10, silver, FREESHIP | $34.30 | $0.00 | $2.92 | **$37.22** | bundle + silver + freeship |
| D — Notebook $5 ×3, coupon `BOGUS50` | $15.00 | $9.99 | $1.28 | **$26.27** | unknown coupon → warning |

---

## Decisions you must make

These are intentional. There is no single "right" answer — make a sensible choice
and **write it down in `DECISIONS.md`**. We care more about your reasoning here
than the specific choice.

1. **Money precision.** Prices arrive as decimals like `19.99`. Naive
   floating-point math will give you wrong cents. Decide how you handle this and
   how/when you round to whole cents. State your rounding rule. If your rule
   differs from ours, totals may be off by a cent on some inputs — that's fine
   **if it's consistent and documented**.
2. **Clamping (rule 6).** Confirm what happens when discounts exceed the subtotal,
   and make sure tax/shipping behave sanely in that case.
3. **Ordering (rules 2→5).** Briefly explain *why* the order matters. (Hint: think
   about how stacked percentages compound.)

---

## Deliverables

- A working `calculatePrice` in `lib/pricing.ts`.
- The starter tests pass, **plus tests you add** for the edge cases (bulk
  boundary, each loyalty tier, unknown coupon, FREESHIP, clamping, …). We look at
  your test coverage.
- A completed **`DECISIONS.md`** (template included).
- **Real commit history.** Commit as you go. Do **not** squash everything into one
  commit — we want to see how you worked.

## How we evaluate

| Area | Weight |
|------|--------|
| Correctness of the logic, including edge cases | 45% |
| TypeScript rigor (real types, no `any` escape hatches) | 20% |
| Code structure & readability | 15% |
| `DECISIONS.md` quality | 20% |

After submission there is a short (~15–20 min) call where you'll walk us through
your code and make one small live change. Be ready to explain *why*, not just
*what*.

---

## A note on LLMs

You can use an LLM. But this task is designed so that a blind copy-paste tends to
get the rule ordering, the cap, the rounding, or the clamping subtly wrong — and
in the call you'll be asked to explain and extend your own code. The fastest path
to passing is to actually understand what you wrote. Spend your time there.
