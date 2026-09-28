import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CHAT } from "./config";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : undefined;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(CHAT.rateLimit.requests, CHAT.rateLimit.window),
      prefix: "chat:rl",
    })
  : undefined;

// without Upstash (local dev) limits live in this process; fine for one machine, not for production
const memoryHits = new Map<string, number[]>();
let memorySpend = { day: "", units: 0 };
if (!redis && process.env.NODE_ENV === "production") {
  console.warn("[chat] UPSTASH_REDIS_REST_* not set: rate limit and budget are per instance only");
}

const today = () => new Date().toISOString().slice(0, 10);
const budgetKey = () => `chat:budget:${today()}`;

export async function allowRequest(ip: string) {
  if (ratelimit) return (await ratelimit.limit(ip)).success;
  const now = Date.now();
  const hits = (memoryHits.get(ip) ?? []).filter((t) => now - t < CHAT.rateLimit.windowMs);
  if (hits.length >= CHAT.rateLimit.requests) return false;
  memoryHits.set(ip, [...hits, now]);
  return true;
}

export async function budgetLeft() {
  const spent = redis
    ? Number((await redis.get<number>(budgetKey())) ?? 0)
    : memorySpend.day === today()
      ? memorySpend.units
      : 0;
  return spent < CHAT.dailyBudget;
}

type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
};

// spend in input-token equivalents, so one number covers every kind of token
export async function recordSpend(usage: Usage) {
  const units = Math.round(
    usage.input_tokens +
      usage.output_tokens * 5 +
      (usage.cache_creation_input_tokens ?? 0) * 1.25 +
      (usage.cache_read_input_tokens ?? 0) * 0.1,
  );
  if (redis) {
    const key = budgetKey();
    await redis.incrby(key, units);
    await redis.expire(key, 2 * 24 * 60 * 60);
    return;
  }
  memorySpend = {
    day: today(),
    units: (memorySpend.day === today() ? memorySpend.units : 0) + units,
  };
}
