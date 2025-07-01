import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD_USER,
  },
});

export const sendEmail = async (to, subject, html) => {
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

const syncSubscribersToMailerLite = async (subscribers) => {
  try {
    const batches = chunkArray(subscribers, 1000);

    for (const batch of batches) {
      const subscribersData = batch.map((subscriber) => ({
        email: subscriber.email,
        groups: [process.env.MAILERLITE_GROUP_ID],
      }));

      await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ subscribers: subscribersData }),
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error("Sync error:", error);
    throw error;
  }
};

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const sendNewsletterToSubscribers = async (subscribers, articleData) => {
  try {
    console.log("Starting newsletter send for:", articleData.article_title);
    console.log("Subscribers count:", subscribers.length);

    console.log("Syncing subscribers to MailerLite...");
    await syncSubscribersToMailerLite(subscribers);

    console.log("Creating campaign...");
    const campaignResponse = await fetch(
      "https://connect.mailerlite.com/api/campaigns",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: `Newsletter: ${articleData.article_title}`,
          type: "regular",
          emails: [
            {
              subject: articleData.article_title,
              from_name: process.env.FROM_NAME || "putujemstravem",
              from: process.env.FROM_EMAIL,
            },
          ],
          filter: [
            [
              {
                operator: "in_any",
                args: ["groups", [process.env.MAILERLITE_GROUP_ID]],
              },
            ],
          ],
        }),
      }
    );

    const campaign = await campaignResponse.json();
    console.log("Campaign response:", campaign);

    if (!campaignResponse.ok) {
      throw new Error(`Campaign creation failed: ${JSON.stringify(campaign)}`);
    }

    console.log("Scheduling campaign...");
    const scheduleResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaign.data.id}/schedule`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery: "instant",
        }),
      }
    );

    if (!scheduleResponse.ok) {
      const scheduleError = await scheduleResponse.json();
      throw new Error(
        `Campaign scheduling failed: ${JSON.stringify(scheduleError)}`
      );
    }

    console.log("Newsletter sent successfully!");
    return { success: true };
  } catch (error) {
    console.error("Newsletter sending error:", error);
    throw new Error(`Newsletter sending failed: ${error.message}`);
  }
};
