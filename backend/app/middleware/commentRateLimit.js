import crypto from "node:crypto";
import { redisAvailable, redisClient } from "./redis.js";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 6;
const submissionsByIp = new Map();

export const commentRateLimit = async (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket?.remoteAddress || "unknown";
  // Atomic increment and expiry avoid counters without a TTL after a restart.
  if (redisAvailable && redisClient.isReady) {
    try {
      const count = await redisClient.eval(
        "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]); end; return n",
        { keys: [`comment-rate:${crypto.createHash("sha256").update(key).digest("hex")}`], arguments: [String(WINDOW_MS)] }
      );
      if (Number(count) > MAX_SUBMISSIONS) {
        res.set("Retry-After", String(WINDOW_MS / 1000));
        return res.status(429).json({ error: "Poslali ste previše komentara. Pokušajte ponovno za nekoliko minuta." });
      }
      return next();
    } catch {
      // Keep accepting legitimate comments with the local limiter during Redis outages.
    }
  }
  const recentSubmissions = (submissionsByIp.get(key) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return res.status(429).json({
      error: "Poslali ste previše komentara. Pokušajte ponovno za nekoliko minuta.",
    });
  }

  recentSubmissions.push(now);
  submissionsByIp.set(key, recentSubmissions);

  if (submissionsByIp.size > 5000) {
    for (const [ip, timestamps] of submissionsByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < WINDOW_MS)) {
        submissionsByIp.delete(ip);
      }
    }
  }

  next();
};
