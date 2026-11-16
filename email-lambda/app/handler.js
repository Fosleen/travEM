const nodemailer = require("nodemailer");
const { createEmailTemplate } = require("./emailTemplate");
const {
  createReplyNotificationTemplate,
} = require("./commentReplyNotificationTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  pool: true,
  maxConnections: 2,
  maxMessages: 1000,
  rateDelta: 1000,
  rateLimit: 5,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD_USER,
  },
  debug: false,
  logger: false,
});

// Connections authenticate on demand; verify() would add another SMTP login.

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: "Putujem s travEM",
      to,
      subject,
      html,
    });
    if (info.rejected?.length) {
      const error = new Error("SMTP rejected recipient");
      error.code = "EENVELOPE";
      throw error;
    }
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendNewsletterToSubscribers = async (subscribers, article) => {
  const batchSize = 2;
  let failedEmails = [];
  let successful = 0;
  // Shared budget prevents a blocked account from sleeping/retrying per recipient.
  const authRetryDelays = [15000, 30000];
  let authRetries = 0;
  const isAuthFailure = (error) => error.code === "EAUTH";
  const isTemporaryAuthFailure = (error) =>
    isAuthFailure(error) && Number(error.responseCode) === 454;
  const summarizeError = (error) => ({
    message: error.message,
    code: error.code,
    responseCode: error.responseCode,
    command: error.command,
  });

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    const sendToSubscriber = async (subscriber) => {
      try {
        const emailTemplate = createEmailTemplate(article, subscriber.email);
        await sendEmail(
          subscriber.email,
          `Novi članak: ${article.article_title}`,
          emailTemplate
        );
        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error: summarizeError(error) };
      }
    };

    let results = await Promise.all(batch.map(sendToSubscriber));
    while (
      results.some((result) => !result.success && isTemporaryAuthFailure(result.error)) &&
      authRetries < authRetryDelays.length
    ) {
      const delay = authRetryDelays[authRetries++];
      console.warn("Newsletter SMTP authentication cooldown", { delay, authRetries });
      await new Promise((resolve) => setTimeout(resolve, delay));
      // AUTH failed before delivery, so retrying only these recipients is safe.
      results = await Promise.all(results.map((result) =>
        !result.success && isTemporaryAuthFailure(result.error)
          ? sendToSubscriber({ email: result.email })
          : result
      ));
    }
    successful += results.filter((result) => result.success).length;
    failedEmails = [...failedEmails, ...results.filter((r) => !r.success)];

    if (results.some((result) => !result.success && isAuthFailure(result.error))) {
      // Stop hammering Gmail once authentication remains blocked.
      const remaining = subscribers.slice(i + batchSize);
      failedEmails.push(...remaining.map((subscriber) => ({
        success: false,
        email: subscriber.email,
        attempted: false,
        error: { code: "SMTP_AUTH_BLOCKED", message: "Not attempted because SMTP authentication failed" },
      })));
      console.error("Newsletter stopped: SMTP authentication blocked", { remaining: remaining.length });
      break;
    }

  }

  const result = {
    totalProcessed: subscribers.length,
    successful,
    failed: failedEmails,
  };
  console.log("Newsletter delivery summary", JSON.stringify({
    articleId: article.id,
    total: subscribers.length,
    successful,
    failed: failedEmails.length,
    failedRecipients: failedEmails,
  }));
  return result;
};

const sendNewsletter = async (req, res) => {
  try {
    const { subscribers, article } = req.body;
    const result = await sendNewsletterToSubscribers(subscribers, article);
    res.status(result.failed.length ? 502 : 200).json({
      message: result.failed.length ? "Newsletter delivery incomplete" : "Newsletter sent successfully",
      result,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    res.status(500).json({ error: "Failed to send newsletter" });
  }
};

const sendCommentReplyNotification = async (req, res) => {
  try {
    const { parentComment, reply, article } = req.body;

    if (
      !parentComment?.email ||
      !parentComment?.unsubscribe_token ||
      !reply ||
      !article?.id
    ) {
      return res.status(400).json({ error: "Invalid comment notification payload" });
    }

    const html = createReplyNotificationTemplate({
      parentComment,
      reply,
      article,
    });

    const info = await sendEmail(
      parentComment.email,
      "Netko ti je odgovorio na komentar na blogu putujEM s travEM.",
      html
    );

    res.status(200).json({
      message: "Comment reply notification sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending comment reply notification:", error);
    res.status(500).json({ error: "Failed to send comment reply notification" });
  }
};

module.exports = {
  sendNewsletter,
  sendCommentReplyNotification,
};
