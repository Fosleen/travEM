const nodemailer = require("nodemailer");
const { createEmailTemplate } = require("./emailTemplate");
const {
  createReplyNotificationTemplate,
} = require("./commentReplyNotificationTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD_USER,
  },
  debug: false,
  logger: false,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection failed:", error);
    console.log("Error code:", error.code);
    console.log("Error command:", error.command);
  } else {
    console.log("SMTP Server is ready to take messages!");
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: "Putujem s travEM",
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendNewsletterToSubscribers = async (subscribers, article) => {
  const batchSize = 10;
  const batchDelay = 2000;
  let failedEmails = [];

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    const batchPromises = batch.map(async (subscriber) => {
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
        return { success: false, email: subscriber.email, error };
      }
    });

    const results = await Promise.all(batchPromises);
    failedEmails = [...failedEmails, ...results.filter((r) => !r.success)];

    if (i + batchSize < subscribers.length) {
      await new Promise((resolve) => setTimeout(resolve, batchDelay));
    }
  }

  return {
    totalProcessed: subscribers.length,
    successful: subscribers.length - failedEmails.length,
    failed: failedEmails,
  };
};

const sendNewsletter = async (req, res) => {
  try {
    const { subscribers, article } = req.body;
    const result = await sendNewsletterToSubscribers(subscribers, article);
    res.status(200).json({
      message: "Newsletter sent successfully",
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
