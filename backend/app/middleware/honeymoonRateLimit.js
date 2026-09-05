const WINDOW_MS = 30 * 60 * 1000;
const MAX_SUBMISSIONS = 3;
const submissionsByIp = new Map();

export const honeymoonRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket?.remoteAddress || "unknown";
  const recent = (submissionsByIp.get(key) || []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_SUBMISSIONS) {
    return res.status(429).json({ error: "Poslali ste previše upita. Pokušajte ponovno kasnije." });
  }

  recent.push(now);
  submissionsByIp.set(key, recent);
  next();
};
