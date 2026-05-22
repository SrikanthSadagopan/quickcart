import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing";
import type { Cart } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const cart = (await request.json()) as Cart;
    const result = calculatePrice(cart);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 },
    );
  }
}
