const escapeHtml = (value = "") =>
  value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const truncateText = (value = "", maxLength = 250) => {
  const normalizedValue = value.toString().replace(/\s+/g, " ").trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 3)}...`;
};

const getArticleUrl = (articleId) =>
  `${process.env.API_URL || "https://putujemstravem.com"}/clanak/${articleId}`;

const createReplyNotificationTemplate = ({ parentComment, reply, article }) => {
  const articleUrl = getArticleUrl(article.id);
  const unsubscribeUrl = `${articleUrl}?commentUnsubscribe=${parentComment.unsubscribe_token}`;
  const originalCommentPreview = escapeHtml(truncateText(parentComment.body));
  const replyPreview = escapeHtml(truncateText(reply.body));
  const commenterName = escapeHtml(parentComment.username || "");
  const articleTitle = escapeHtml(article.title || "");

  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background: #f8f8f8; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 640px; margin: 0 auto; padding: 28px 16px;">
          <div style="background: #ffffff; border: 1px solid #dfdfdf; border-radius: 8px; padding: 24px;">
            <p style="margin: 0 0 8px; color: #2BAC82; font-size: 13px; font-weight: 700;">
              putujEM s travEM
            </p>
            <h1 style="margin: 0 0 18px; color: #333333; font-size: 24px; line-height: 1.25;">
              Netko ti je odgovorio na komentar
            </h1>
            <p style="margin: 0 0 16px; line-height: 1.6;">
              Bok ${commenterName},
            </p>
            <p style="margin: 0 0 18px; line-height: 1.6;">
              netko je odgovorio na tvoj komentar ispod članka:
              <br />
              <strong>${articleTitle}</strong>
            </p>

            <p style="margin: 0 0 6px; color: #515151; font-size: 13px; font-weight: 700;">
              Tvoj komentar:
            </p>
            <blockquote style="margin: 0 0 18px; border-left: 4px solid #d2eb64; padding: 10px 0 10px 14px; color: #515151; line-height: 1.55;">
              ${originalCommentPreview}
            </blockquote>

            <p style="margin: 0 0 6px; color: #515151; font-size: 13px; font-weight: 700;">
              Odgovor:
            </p>
            <blockquote style="margin: 0 0 22px; border-left: 4px solid #2BAC82; padding: 10px 0 10px 14px; color: #333333; line-height: 1.55;">
              ${replyPreview}
            </blockquote>

            <p style="margin: 0 0 22px;">
              <a href="${articleUrl}" style="display: inline-block; padding: 11px 18px; background: #2BAC82; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700;">
                Pogledaj odgovor
              </a>
            </p>

            <p style="margin: 0; padding-top: 16px; border-top: 1px solid #dfdfdf; color: #666666; font-size: 12px; line-height: 1.5;">
              Ako više ne želiš primati obavijesti za ovaj komentar, otvori:
              <br />
              <a href="${unsubscribeUrl}" style="color: #218161;">${unsubscribeUrl}</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = {
  createReplyNotificationTemplate,
};
