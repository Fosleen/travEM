import { verifyToken } from "./jwt_verify.js";
import { requireAdmin } from "./articleAccess.js";

// Public reading/subscription/comment routes remain public. Every other write
// requires an administrator, except content operations checked for ownership.
export function dashboardAccess(req, res, next) {
  const path = req.path;
  const read = req.method === "GET" || req.method === "HEAD";
  const publicWrite = req.method === "POST" && (
    path === "/login" || path === "/subscribers" || path === "/subscribers/" ||
    /^\/articles\/\d+\/comments(?:\/\d+\/replies)?\/?$/.test(path) ||
    /^\/comments\/\d+\/like\/?$/.test(path) || path === "/honeymoon/inquiries"
  );
  const publicUnlike = req.method === "DELETE" && /^\/comments\/\d+\/like\/?$/.test(path);
  const privateRead = /\/(admin|pending)(\/|$)/.test(path) ||
    /^\/subscribers(?:\/?$|\/(?:no-pagination|new-subscribers-previous-period))/.test(path);
  if (publicWrite || publicUnlike || (read && !privateRead)) return next();
  const authorContent = /^\/(articles|sections|section-images|gallery-images|videos)(?:\/\d+)?\/?$/.test(path) || /^\/articles\/\d+\/submit-review\/?$/.test(path);
  verifyToken(req, res, () => authorContent ? next() : requireAdmin(req, res, next));
}
