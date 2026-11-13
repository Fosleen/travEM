import crypto from "node:crypto";

const secret = () => process.env.COMMENT_FORM_SECRET || process.env.JWT_SECRET_KEY;
const sign = (payload) => crypto.createHmac("sha256", secret()).update(`comment-form:${payload}`).digest("base64url");

export function createCommentFormToken(articleId, now = Date.now()) {
  if (!secret()) throw new Error("Comment form secret is missing");
  const payload = Buffer.from(JSON.stringify({ articleId: String(articleId), issued: now, nonce: crypto.randomBytes(16).toString("hex") })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyCommentFormToken(token, articleId, now = Date.now()) {
  if (!secret() || typeof token !== "string" || token.length > 1024) return null;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra !== undefined) return null;
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    const age = now - data.issued;
    if (data.articleId !== String(articleId) || !Number.isFinite(age) || age < 0 || age > 7200000) return null;
    return { tooFast: age < 2000 };
  } catch { return null; }
}

export function verifyCommentSubmission(data, articleId, now = Date.now()) {
  if (!data || (data.website !== undefined && data.website !== "")) return null;
  return verifyCommentFormToken(data.formToken, articleId, now);
}

export function getCommentFormToken(req, res) {
  res.set("Cache-Control", "no-store");
  try {
    res.json({ token: createCommentFormToken(req.params.articleId) });
  } catch {
    res.status(503).json({ error: "Obrazac trenutno nije dostupan. Pokušajte ponovno kasnije." });
  }
}
