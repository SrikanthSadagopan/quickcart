# Decisions

Fill this in. Short and specific beats long and vague. 3–8 sentences total is fine.

## 1. Money precision & rounding
- How do I avoid floating-point errors?
To avoid floating-point precision issues in JavaScript, all monetary calculations are rounded to two decimal places using `Math.round(value * 100) / 100`.

- When do I round, and using what rule (e.g. round half up, in cents)?
Rounding is applied after percentage-based calculations such as:
- bulk discounts
- coupon discounts
- loyalty discounts
- tax calculations

This keeps the calculations consistent and prevents floating-point inaccuracies from accumulating across multiple operations.


## 2. Clamping (rule 6)
- What happens when discounts exceed the subtotal?
After all discounts are applied, the running subtotal is clamped to a minimum value of `$0.00`.

This prevents:
- negative subtotals
- negative tax calculations
- invalid final totals

- What do shipping and tax do in that case?
Tax is calculated only after clamping has been applied.

Shipping still follows the normal rules after clamping:
- free if `FREESHIP` is applied
- free if subtotal is at least `$100`
- otherwise `$9.99`


## 3. Discount ordering (rules 2 → 5)
- Why does the order matter?
Discounts are applied in the exact order defined in the specification:

1. Bulk discount
2. Bundle discount
3. Coupon discount
4. Loyalty discount

The order matters because percentage-based discounts compound differently depending on sequence.

For example, applying the loyalty discount before the coupon discount would produce a different final total than applying the coupon first.

## Assumptions & known limitations
- Anything the spec didn't fully pin down that I had to decide.
Coupon codes are treated as case-insensitive by converting them to uppercase before processing.

Shipping is not taxed, based on the specification provided.

- Anything I'd improve with more time.
With more time, I would add:
- additional validation for invalid cart inputs
- more edge-case tests
- support for multiple coupons or configurable tax rates