// Lightweight in-memory rate limiting for the chat endpoint.
// On serverless hosts each instance keeps its own counters, so these are
// per-instance floors, not exact global ceilings. Combined with small
// max_tokens and a cheap model they keep worst-case spend tightly bounded.
// For exact global limits, swap in Upstash/Redis with the same interface.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000; // cap memory if someone rotates IPs

function hit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    if (buckets.size >= MAX_KEYS) {
      // Drop expired entries; if still full, fail closed for new keys.
      for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
      if (buckets.size >= MAX_KEYS) return false;
    }
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  b.count++;
  return b.count <= limit;
}

export type RateCheck = { ok: true } | { ok: false; reason: string };

/** Layered limits for one chat message from `ip`. */
export function checkChatLimits(ip: string): RateCheck {
  if (!hit(`m:${ip}`, 8, 60_000)) {
    return { ok: false, reason: "You're sending messages quickly. Give it a minute and try again." };
  }
  if (!hit(`h:${ip}`, 30, 3_600_000)) {
    return { ok: false, reason: "You've reached the hourly chat limit. For anything urgent, use the contact page and we'll reply within a business day." };
  }
  if (!hit(`d:${ip}`, 60, 86_400_000)) {
    return { ok: false, reason: "You've reached today's chat limit. Send us a message through the contact page and a human will take it from here." };
  }
  if (!hit("global:d", 2_000, 86_400_000)) {
    return { ok: false, reason: "Our chat assistant is resting at the moment. Please use the contact page and we'll reply within a business day." };
  }
  return { ok: true };
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
