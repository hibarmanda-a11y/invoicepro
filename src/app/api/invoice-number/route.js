import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  try {
    const year = new Date().getFullYear();
    const count = await redis.incr(`invoice-counter:${year}`);
    const invoiceNumber = `INV-${year}-${String(count).padStart(4, "0")}`;
    return NextResponse.json({ invoiceNumber });
  } catch (err) {
    console.error("Redis error:", err);
    // fallback if redis fails
    const fallback = `INV-${Date.now()}`;
    return NextResponse.json({ invoiceNumber: fallback });
  }
}