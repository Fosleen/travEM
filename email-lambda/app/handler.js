const nodemailer = require("nodemailer");

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

const createEmailTemplate = (article) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${article.article_title}</title>
    <style type="text/css">
      /* Reset styles */
      #outlook a {
        padding: 0;
      }
      body {
        width: 100% !important;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
      }
      .ReadMsgBody {
        width: 100%;
      }
      .ExternalClass {
        width: 100%;
      }
      .backgroundTable {
        margin: 0;
        padding: 0;
        width: 100% !important;
        line-height: 100% !important;
      }
      table td {
        border-collapse: collapse;
      }
      .ExternalClass * {
        line-height: 115%;
      }

      /* Main styles */
      body,
      table,
      td,
      p,
      a,
      li,
      blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }

      table {
        border-collapse: collapse !important;
      }

      body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
      }

      /* Responsive styles */
      @media screen and (max-width: 600px) {
        .mobile-padding {
          padding: 25px 20px !important;
        }

        .mobile-title {
          font-size: 20px !important;
          line-height: 26px !important;
        }

        .mobile-text {
          font-size: 14px !important;
        }

        .mobile-button {
          padding: 12px 24px !important;
          font-size: 14px !important;
        }

        .social-table {
          width: 100% !important;
        }

        .social-cell {
          padding: 5px !important;
        }
      }
    </style>
  </head>

  <body style="background-color: #f5f5f5; margin: 0; padding: 0; width: 100%">
    <!-- Outer wrapper table -->
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #f5f5f5"
    >
      <tr>
        <td align="center" style="padding: 30px 15px">
          <!-- Main container table -->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="background-color: #ffffff; max-width: 600px"
          >
            <!-- Header Section -->
            <tr>
              <td
                style="
                  padding: 40px 40px 30px 40px;
                  text-align: center;
                  border-bottom: 3px solid #2bac82;
                "
                class="mobile-padding"
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <h1
                        style="
                          color: #333333;
                          font-size: 32px;
                          font-weight: bold;
                          margin: 0 0 8px 0;
                          letter-spacing: 1px;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        PUTUJEM S TRAVEM
                      </h1>
                      <p
                        style="
                          color: #666666;
                          font-size: 16px;
                          margin: 0 0 20px 0;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Najnoviji članak je stigao na naš blog
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 40px" class="mobile-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- Article Image -->
                  <tr>
                    <td style="padding-bottom: 25px">
                      <img
                        src="${article.mainArticleImage}"
                        alt="${article.article_title}"
                        width="520"
                        style="
                          width: 100%;
                          max-width: 520px;
                          height: auto;
                          display: block;
                        "
                      />
                    </td>
                  </tr>

                  <!-- Article Title -->
                  <tr>
                    <td style="padding-bottom: 20px">
                      <h2
                        style="
                          color: #333333;
                          font-size: 24px;
                          font-weight: 600;
                          margin: 0;
                          line-height: 1.3;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                        class="mobile-title"
                      >
                        ${article.article_title}
                      </h2>
                    </td>
                  </tr>

                  <!-- Article Description -->
                  <tr>
                    <td style="padding-bottom: 30px">
                      <p
                        style="
                          color: #555555;
                          font-size: 16px;
                          line-height: 1.6;
                          margin: 0;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                        class="mobile-text"
                      >
                        ${article.article_description}
                      </p>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td align="center" style="padding: 10px 0 30px 0">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td
                            align="center"
                            style="
                              background-color: #2bac82;
                              border-radius: 6px;
                            "
                          >
                            <a
                              href="https://putujemstravem.com/clanak/${
                                article.id
                              }"
                              target="_blank"
                              style="
                                display: inline-block;
                                padding: 16px 32px;
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 16px;
                                font-weight: 600;
                                color: #ffffff;
                                text-decoration: none;
                              "
                              class="mobile-button"
                            >
                              Pročitaj cijeli članak
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- About Section -->
            <tr>
              <td
                style="
                  background-color: #f9f9f9;
                  padding: 35px 40px;
                  border-top: 1px solid #e0e0e0;
                "
                class="mobile-padding"
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 20px">
                      <h3
                        style="
                          color: #333333;
                          font-size: 20px;
                          font-weight: 600;
                          margin: 0;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        O nama
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style="
                          color: #555555;
                          font-size: 15px;
                          line-height: 1.6;
                          margin: 0;
                          text-align: center;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                        class="mobile-text"
                      >
                        Mi smo Ema i Matija, mladi par iz Hrvatske koji putuje
                        od 2020. godine. Kao studenti, naučili smo putovati s
                        ograničenim budžetom – svaki novčić ulažemo u nova
                        iskustva. Dijelimo naša putovanja putem bloga i YouTube
                        kanala.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Social Section -->
            <tr>
              <td
                style="padding: 35px 40px; text-align: center"
                class="mobile-padding"
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- Social Title -->
                  <tr>
                    <td align="center" style="padding-bottom: 25px">
                      <h3
                        style="
                          color: #333333;
                          font-size: 18px;
                          font-weight: 600;
                          margin: 0;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Pratite nas
                      </h3>
                    </td>
                  </tr>

                  <!-- Social Links -->
                  <tr>
                    <td align="center">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="display: inline-table"
                        class="social-table"
                      >
                        <tr>
                          <td
                            align="center"
                            style="padding: 0 12px"
                            class="social-cell"
                          >
                            <a
                              href="https://putujemstravem.com/"
                              target="_blank"
                              style="display: inline-block"
                            >
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
                                alt="Website"
                                width="32"
                                height="32"
                                style="width: 32px; height: 32px; border: 0"
                              />
                            </a>
                          </td>
                          <td
                            align="center"
                            style="padding: 0 12px"
                            class="social-cell"
                          >
                            <a
                              href="https://www.instagram.com/travel_paradox"
                              target="_blank"
                              style="display: inline-block"
                            >
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                                alt="Instagram Travel Paradox"
                                width="32"
                                height="32"
                                style="width: 32px; height: 32px; border: 0"
                              />
                            </a>
                          </td>
                          <td
                            align="center"
                            style="padding: 0 12px"
                            class="social-cell"
                          >
                            <a
                              href="https://www.instagram.com/ema_only_/"
                              target="_blank"
                              style="display: inline-block"
                            >
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                                alt="Instagram Ema"
                                width="32"
                                height="32"
                                style="width: 32px; height: 32px; border: 0"
                              />
                            </a>
                          </td>
                          <td
                            align="center"
                            style="padding: 0 12px"
                            class="social-cell"
                          >
                            <a
                              href="https://www.youtube.com/@travem?sub_confirmation=1"
                              target="_blank"
                              style="display: inline-block"
                            >
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                                alt="YouTube"
                                width="32"
                                height="32"
                                style="width: 32px; height: 32px; border: 0"
                              />
                            </a>
                          </td>
                          <td
                            align="center"
                            style="padding: 0 12px"
                            class="social-cell"
                          >
                            <a
                              href="https://www.facebook.com/putujemstravem"
                              target="_blank"
                              style="display: inline-block"
                            >
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                                alt="Facebook"
                                width="32"
                                height="32"
                                style="width: 32px; height: 32px; border: 0"
                              />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer Section -->
            <tr>
              <td
                style="
                  background-color: #333333;
                  padding: 30px 40px;
                  text-align: center;
                "
                class="mobile-padding"
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <p
                        style="
                          color: #cccccc;
                          font-size: 13px;
                          margin: 0 0 8px 0;
                          line-height: 1.4;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Hvala što čitate naš newsletter!
                      </p>
                      <p
                        style="
                          color: #cccccc;
                          font-size: 13px;
                          margin: 0 0 8px 0;
                          line-height: 1.4;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Primili ste ovaj email jer ste pretplaćeni na naš
                        newsletter.
                      </p>
                      <p
                        style="
                          color: #cccccc;
                          font-size: 13px;
                          margin: 0 0 15px 0;
                          line-height: 1.4;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Za odjavu kontaktirajte nas na
                        <a
                          href="mailto:travem.hr@gmail.com"
                          style="color: #2bac82; text-decoration: none"
                          >travem.hr@gmail.com</a
                        >
                      </p>
                      <p
                        style="
                          color: #999999;
                          font-size: 12px;
                          margin: 0;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        © ${new Date().getFullYear()} Putujem s travEM. Sva prava
                        pridržana.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

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
  const emailTemplate = createEmailTemplate(article);
  const batchSize = 10;
  const batchDelay = 2000;
  let failedEmails = [];

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    const batchPromises = batch.map(async (subscriber) => {
      try {
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

module.exports = {
  sendNewsletter,
};
