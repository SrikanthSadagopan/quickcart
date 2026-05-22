"use client";

import { useState } from "react";
import sampleData from "@/data/sample-carts.json";
import type { Cart, PriceResult } from "@/lib/types";

type Sample = { label: string; cart: Cart };
const samples = sampleData.carts as Sample[];

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Home() {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samples[index].cart),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data as PriceResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>QuickCart Pricing</h1>
      <p className="sub">
        Pick a sample cart and calculate the price. The breakdown comes from your
        <code> calculatePrice </code> function via <code>/api/price</code>.
      </p>

      <div className="row">
        <select value={index} onChange={(e) => setIndex(Number(e.target.value))}>
          {samples.map((s, i) => (
            <option key={i} value={i}>
              {s.label}
            </option>
          ))}
        </select>
        <button onClick={calculate} disabled={loading}>
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </div>

      <div className="panel">
        <strong>Cart input</strong>
        <pre>{JSON.stringify(samples[index].cart, null, 2)}</pre>
      </div>

      {error && (
        <div className="panel">
          <span className="warn">Error: {error}</span>
        </div>
      )}

      {result && (
        <div className="panel">
          <strong>Breakdown</strong>
          <div className="line">
            <span className="muted">Item subtotal</span>
            <span>{money(result.itemSubtotal)}</span>
          </div>
          {result.discounts.map((d, i) => (
            <div className="line" key={i}>
              <span className="muted">{d.label}</span>
              <span>-{money(d.amount)}</span>
            </div>
          ))}
          <div className="line">
            <span className="muted">Subtotal after discounts</span>
            <span>{money(result.subtotalAfterDiscounts)}</span>
          </div>
          <div className="line">
            <span className="muted">Shipping</span>
            <span>{money(result.shipping)}</span>
          </div>
          <div className="line">
            <span className="muted">Tax</span>
            <span>{money(result.tax)}</span>
          </div>
          <div className="line total">
            <span>Total</span>
            <span>{money(result.total)}</span>
          </div>
          {result.warnings.map((w, i) => (
            <div className="warn" key={i}>
              ⚠ {w}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
