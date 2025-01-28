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

const createEmailTemplate = (article) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
            }
            .article-image {
              width: 100%;
              max-height: 300px;
              object-fit: cover;
            }
            .article-title {
              color: #2BAC82;
              font-size: 24px;
              margin: 20px 0;
            }
            .article-description {
              color: #333;
              line-height: 1.6;
            }
            .read-more-btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #2BAC82;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <img src="${article.mainArticleImage}" alt="Article Image" class="article-image">
            <h1 class="article-title">${article.article_title}</h1>
            <p class="article-description">${article.article_description}</p>
            <a href="https://putujemstravem.com/clanak/${article.id}" class="read-more-btn">
              Pročitaj više
            </a>
            <div class="footer">
              <p>Primili ste ovaj email jer ste pretplaćeni na naš newsletter.</p>
              <p>Za odjavu nam se javite na mail travem.hr@gmail.com</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

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

export const sendNewsletterToSubscribers = async (subscribers, article) => {
  const emailTemplate = createEmailTemplate(article);

  const emailPromises = [];
  const batchSize = 50;

  // Process in batches to avoid overwhelming the email server
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    const batchPromises = batch.map((subscriber) => {
      return sendEmail(
        subscriber.email,
        `Novi članak: ${article.article_title}`,
        emailTemplate
      ).catch((error) => {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        throw error;
      });
    });

    emailPromises.push(
      Promise.all(batchPromises)
        .then(() => {
          return new Promise((resolve) => setTimeout(resolve, 1000));
        })
        .catch((error) => {
          console.error(
            `Batch ${Math.floor(i / batchSize) + 1} failed:`,
            error
          );
          throw error;
        })
    );
  }

  console.log(`Created ${emailPromises.length} batch promises in total`);

  try {
    await Promise.all(emailPromises);
    console.log("All newsletters sent successfully");
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    throw error;
  }
};
