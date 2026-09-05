const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 6;
const submissionsByIp = new Map();

export const commentRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket?.remoteAddress || "unknown";
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
