import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter: IP → { count, resetAt }
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 100;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Basic validation — require schemaId and coreVersion
  if (
    typeof body.schemaId !== "string" ||
    typeof body.coreVersion !== "string" ||
    !body.schemaId ||
    !body.coreVersion
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // Forward to Google Sheets webhook (non-blocking)
  const webhookUrl = process.env.TELEMETRY_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      // Fire and forget — don't block the response
    });
  }

  return NextResponse.json({ ok: true });
}
