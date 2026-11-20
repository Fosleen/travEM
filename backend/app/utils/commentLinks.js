const linkPattern =
  /(?<![\p{L}\p{N}_@.:/\\-])(?:[a-z][a-z\d+.-]*:\/\/[^\s<>"'`]+|(?:\/\/)?(?:(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?\.)+(?:xn--[a-z0-9-]+|\p{L}{2,})|(?:\d{1,3}\.){3}\d{1,3})(?![\p{L}\p{N}_@-])(?::\d+)?(?:[/?#][^\s<>"'`]*)?)/giu;

export const EXTERNAL_COMMENT_LINK_REASON = "Vanjska poveznica";

const internalHosts = new Set(["putujemstravem.com", "www.putujemstravem.com"]);

const parseLink = (text) => {
  if (/[\\\x00-\x20\x7f]/.test(text)) return null;

  try {
    const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(text);
    const url = new URL(hasScheme ? text : "https://" + text.replace(/^\/\//, ""));
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.username || url.password ? null : url;
  } catch {
    return null;
  }
};

export const getCommentLinks = (body) =>
  Array.from(body.matchAll(linkPattern), (match) => {
    let text = match[0].replace(/[.,!?;:]+$/, "");
    for (const [open, close] of [["(", ")"], ["[", "]"], ["{", "}"]]) {
      const openingCount = text.split(open).length;
      let closingCount = text.split(close).length;
      while (text.endsWith(close) && closingCount > openingCount) {
        text = text.slice(0, -1);
        closingCount--;
      }
    }

    const url = parseLink(text);
    return {
      start: match.index,
      end: match.index + text.length,
      href: url?.href ?? null,
      internal: Boolean(url && !url.port && internalHosts.has(url.hostname)),
    };
  });

export const getPublishedCommentLinks = (comment) =>
  getCommentLinks(comment.body)
    // Published comments with a moderation reason have already passed manual review.
    .filter(({ href, internal }) =>
      href && (internal || comment.is_admin_reply || comment.moderation_reason)
    )
    .map(({ start, end, href }) => ({ start, end, href }));
