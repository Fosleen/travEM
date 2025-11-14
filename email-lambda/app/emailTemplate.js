const { generateUnsubscribeToken, getArticleTypeBadge } = require("./utils");

const createEmailTemplate = (article, userEmail) => {
  const badge = getArticleTypeBadge(article.article_type_id);
  const unsubscribeToken = generateUnsubscribeToken(userEmail);
  const unsubscribeUrl = `https://putujemstravem.com/otkazi-pretplatu?userToken=${unsubscribeToken}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
      }

      /* Responsive styles */
      @media screen and (max-width: 600px) {
        .mobile-padding {
          padding: 32px !important;
        }
        .unsubscribe-button-text {
            padding: 20px 40px !important;
            font-size: 18px !important;
        }
        .header-padding{
          padding: 96px 40px !important;
        }
        .mobile-title {
          font-size: 22px !important;
          line-height: 28px !important;
        }
        .mobile-text {
          font-size: 18px !important;
        }
        .mobile-button {
          padding: 32px 64px !important;
          font-size: 15px !important;
        }
        .mobile-header {
          font-size: 28px !important;
        }
        .mobile-hide {
          display: none !important;
        }
        .badge {
          font-size: 13px !important;
          padding: 14px 22px !important;
        }
        .social-icon {
          width: 40px !important;
          height: 40px !important;
          padding: 6px !important;
        }
        .social-icon img {
          width: 28px !important;
          height: 28px !important;
        }
      }

      /* Force light mode appearance in dark mode */
      @media (prefers-color-scheme: dark) {
        /* Prevent email clients from inverting colors */
        body,
        table,
        td,
        div,
        p,
        span,
        a,
        h1,
        h2,
        h3 {
          color-scheme: light !important;
        }
        
        /* Force light backgrounds */
        body,
        .backgroundTable {
          background-color: #f5f5f5 !important;
        }
        
        /* Keep white container */
        .main-container {
          background-color: #ffffff !important;
        }
        
        /* Force specific colors that shouldn't change */
        .header-bg {
          background-color: #2f2936 !important;
        }
        
        .announcement-bg {
          background-color: #b3c952 !important;
        }
        
        .footer-bg {
          background-color: #2f2936 !important;
        }
        
        .about-bg {
          background-color: #fafafa !important;
        }
        
        /* Preserve button colors */
        .cta-button {
          background-color: #2bac82 !important;
        }
        
        /* Social media icons - keep original colors */
        .social-youtube {
          background-color: #b3c952 !important;
          border-color: #2f2936 !important;
        }
        
        .social-blue {
          background-color: #78a4d7 !important;
        }
        
        /* Preserve text colors */
        .text-dark {
          color: #2f2936 !important;
        }

        /* Force announcement text to stay dark */
        .announcement-text {
          color: #2f2936 !important;
        }

        /* Force announcement text to stay dark - more specific */
        .announcement-bg .announcement-text,
        p.announcement-text {
          color: #2f2936 !important;
        }
        
        .text-gray {
          color: #515151 !important;
        }
        
        .text-white {
          color: #ffffff !important;
        }
        
        .text-light-gray {
          color: #b3b3b3 !important;
        }
        
        .text-medium-gray {
          color: #888888 !important;
        }
        
        .text-footer {
          color: #cccccc !important;
        }
        
        /* Preserve badge colors */
        .badge {
          background-color: #dfdfdf !important;
          color: #515151 !important;
        }
        
        /* Prevent image inversion */
        img {
          opacity: 1 !important;
          filter: none !important;
        }
        
        /* Preserve divider color */
        .divider {
          border-color: #f0f0f0 !important;
        }
        
        /* Preserve border colors */
        .unsubscribe-button {
          border-color: #666666 !important;
        }
        
        .footer-divider {
          border-color: #444444 !important;
        }
      }
    </style>
  </head>

  <body style="background-color: #f5f5f5; margin: 0; padding: 0; width: 100%">
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      class="backgroundTable"
      style="background-color: #f5f5f5"
    >
      <tr>
        <td align="center" style="padding: 40px 15px">
          <!-- Main container -->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            class="main-container"
            style="
              background-color: #ffffff;
              max-width: 600px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <!-- Header with logo -->
            <tr>
              <td
                class="header-bg header-padding"
                style="
                  background-color: #2f2936;
                  padding: 40px 20px;
                  text-align: center;
                "
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <img
                        src="https://putujemstravem.com/assets/travem-logo-hero-VznSZ7GH.png"
                        alt="Putujem s travEM"
                        width="280"
                        style="
                          width: 100%;
                          max-width: 280px;
                          height: auto;
                          display: block;
                          margin: 0 auto;
                        "
                        class="mobile-header"
                      />
                      <div
                        style="
                          width: 60px;
                          height: 3px;
                          background-color: #87c4ff;
                          margin: 24px auto 18px auto;
                          border-radius: 2px;
                        "
                      ></div>
                      <p
                        class="text-white"
                        style="
                          color: #ffffff;
                          font-size: 16px;
                          margin: 0;
                          font-weight: 400;
                          opacity: 0.9;
                          line-height: 1.5;
                        "
                      >
                        Otkrijte nove informacije o putovanjima iz prve ruke
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Announcement bar -->
            <tr>
              <td
                class="announcement-bg mobile-padding"
                style="
                  background-color: #b3c952;
                  padding: 18px 40px;
                  text-align: center;
                "
              >
                <p
                  class="announcement-text"
                  style="
                    color: #2f2936 !important;
                    font-size: 15px;
                    margin: 0;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                  "
                >
                  📍 NOVI ČLANAK NA BLOGU
                </p>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding: 50px 40px" class="mobile-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- Featured image -->
                  <tr>
                    <td align="center" style="padding-bottom: 35px">
                      <img
                        src="${article.mainArticleImage}"
                        alt="${article.article_title}"
                        width="520"
                        style="
                          width: 100%;
                          max-width: 520px;
                          height: auto;
                          display: block;
                          border-radius: 8px;
                          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                        "
                      />
                    </td>
                  </tr>

                  <!-- Article title -->
                  <tr>
                    <td style="padding-bottom: 20px">
                      <h2
                        class="mobile-title text-dark"
                        style="
                          color: #2f2936;
                          font-size: 28px;
                          font-weight: 700;
                          margin: 0;
                          line-height: 1.3;
                          letter-spacing: -0.3px;
                        "
                      >
                        ${article.article_title}
                      </h2>
                    </td>
                  </tr>

                  <!-- Meta info -->
                  <tr>
                    <td style="padding-bottom: 25px">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <span
                              class="badge"
                              style="
                                display: inline-flex;
                                align-items: center;
                                background-color: #dfdfdf;
                                color: #515151;
                                font-size: 11px;
                                font-weight: 600;
                                padding: 8px 16px;
                                border-radius: 64px;
                                letter-spacing: 0.5px;
                              "
                              >${badge.icon}&nbsp;${badge.text}</span
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Article description -->
                  <tr>
                    <td style="padding-bottom: 35px">
                      <p
                        class="mobile-text text-gray"
                        style="
                          color: #515151;
                          line-height: 1.7;
                          margin: 0;
                        "
                      >
                        ${article.article_description}
                      </p>
                    </td>
                  </tr>

                <!-- CTA Button - "Pročitaj članak" -->
                <tr>
                  <td align="center" style="padding-bottom: 64px">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          align="center"
                          class="cta-button"
                          style="
                            background-color: #2bac82;
                            border-radius: 64px;
                            box-shadow: 0 4px 12px rgba(43, 172, 130, 0.25);
                          "
                        >
                            <a
                            href="https://putujemstravem.com/clanak/${
                              article.id
                            }"
                            target="_blank"
                            class="mobile-button text-white"
                            style="
                                display: inline-block;
                                padding: 16px 32px;  
                                font-size: 24px !important;
                                font-weight: 700;
                                color: #ffffff !important;
                                text-decoration: none;
                                letter-spacing: 0.5px;
                                line-height: 1.2;
                            "
                            >
                            Pročitaj članak
                            </a>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px">
                <div class="divider" style="border-top: 2px solid #f0f0f0"></div>
              </td>
            </tr>

            <!-- About section -->
            <tr>
              <td
                class="about-bg mobile-padding"
                style="padding: 45px 40px; background-color: #fafafa"
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 25px">
                      <h3
                        class="text-dark"
                        style="
                          color: #2f2936;
                          font-size: 22px;
                          font-weight: 700;
                          margin: 0;
                          letter-spacing: -0.2px;
                        "
                      >
                        Tko smo mi?
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        class="text-gray"
                        style="
                          color: #515151;
                          font-size: 16px;
                          line-height: 1.7;
                          margin: 0;
                          text-align: center;
                        "
                      >
                        Mi smo <strong>Ema i Matija</strong>, mladi par iz
                        Hrvatske koji putuje od 2020. godine. Kao studenti,
                        naučili smo putovati s ograničenim budžetom – svaki
                        novčić ulažemo u nova iskustva. Pratite naša putovanja
                        na blogu i YouTube kanalu!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Social section -->
            <tr>
              <td
                style="
                  padding: 45px 40px;
                  text-align: center;
                  background-color: #ffffff;
                "
                class="mobile-padding"
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 28px">
                      <h3
                        class="text-dark"
                        style="
                          color: #2f2936;
                          font-size: 22px;
                          font-weight: 700;
                          margin: 0;
                        "
                      >
                        Pratite nas
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="display: inline-table"
                      >
                        <tr>
                          <!-- YouTube - Green with border -->
                          <td align="center" style="padding: 0 6px">
                            <a
                              href="https://www.youtube.com/@travem?sub_confirmation=1"
                              target="_blank"
                              class="social-icon social-youtube"
                              style="
                                display: inline-block;
                                width: 48px;
                                height: 48px;
                                background-color: #b3c952;
                                border: 3px solid #2f2936;
                                border-radius: 50%;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/youtube-play.png"
                                alt="YouTube"
                                width="24"
                                height="24"
                                style="
                                  width: 24px;
                                  height: 24px;
                                  display: block;
                                  margin: 6px auto;
                                "
                              />
                            </a>
                          </td>

                          <!-- Facebook - Blue -->
                          <td align="center" style="padding: 0 6px">
                            <a
                              href="https://www.facebook.com/putujemstravem"
                              target="_blank"
                              class="social-icon social-blue"
                              style="
                                display: inline-block;
                                width: 48px;
                                height: 48px;
                                background-color: #78a4d7;
                                border-radius: 50%;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png"
                                alt="Facebook"
                                width="24"
                                height="24"
                                style="
                                  width: 24px;
                                  height: 24px;
                                  display: block;
                                  margin: 6px auto;
                                "
                              />
                            </a>
                          </td>

                          <!-- Instagram 1 - Blue -->
                          <td align="center" style="padding: 0 6px">
                            <a
                              href="https://www.instagram.com/putujuci_paradoks/"
                              target="_blank"
                              class="social-icon social-blue"
                              style="
                                display: inline-block;
                                width: 48px;
                                height: 48px;
                                background-color: #78a4d7;
                                border-radius: 50%;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png"
                                alt="Instagram"
                                width="24"
                                height="24"
                                style="
                                  width: 24px;
                                  height: 24px;
                                  display: block;
                                  margin: 6px auto;
                                "
                              />
                            </a>
                          </td>

                          <!-- Instagram 2 - Blue -->
                          <td align="center" style="padding: 0 6px">
                            <a
                              href="https://www.instagram.com/ema_only_/"
                              target="_blank"
                              class="social-icon social-blue"
                              style="
                                display: inline-block;
                                width: 48px;
                                height: 48px;
                                background-color: #78a4d7;
                                border-radius: 50%;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png"
                                alt="Instagram"
                                width="24"
                                height="24"
                                style="
                                  width: 24px;
                                  height: 24px;
                                  display: block;
                                  margin: 6px auto;
                                "
                              />
                            </a>
                          </td>

                          <!-- TikTok - Blue -->
                          <td align="center" style="padding: 0 6px">
                            <a
                              href="https://www.tiktok.com/@ema_only_"
                              target="_blank"
                              class="social-icon social-blue"
                              style="
                                display: inline-block;
                                width: 48px;
                                height: 48px;
                                background-color: #78a4d7;
                                border-radius: 50%;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/ffffff/tiktok.png"
                                alt="TikTok"
                                width="24"
                                height="24"
                                style="
                                  width: 24px;
                                  height: 24px;
                                  display: block;
                                  margin: 6px auto;
                                "
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

            <!-- Footer -->
            <tr>
              <td
                class="footer-bg mobile-padding"
                style="
                  background-color: #2f2936;
                  padding: 40px 40px;
                  text-align: center;
                "
              >
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <p
                        class="text-white"
                        style="
                          color: #ffffff;
                          font-size: 15px;
                          margin: 0 0 12px 0;
                          line-height: 1.6;
                          font-weight: 500;
                        "
                      >
                        Hvala što čitate naš newsletter! 💚
                      </p>
                      <p
                        class="text-light-gray"
                        style="
                          color: #b3b3b3;
                          font-size: 13px;
                          margin: 0 0 24px 0;
                          line-height: 1.5;
                        "
                      >
                        Primili ste ovaj email jer ste pretplaćeni na newsletter
                        od Putujem s travEM
                      </p>

                      <!-- Unsubscribe button -->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="display: inline-table; margin-bottom: 24px"
                      >
                        <tr>
                          <td
                            align="center"
                            class="unsubscribe-button"
                            style="
                              background-color: transparent;
                              border: 2px solid #666666;
                              border-radius: 25px;
                            "
                          >
                         <a
                              href="${unsubscribeUrl}"                              
                                target="_blank"
                                class="text-footer unsubscribe-button-text"
                                style="
                                    display: inline-block;
                                    padding: 12px 24px;
                                    font-size: 14px;
                                    font-weight: 600;
                                    color: #cccccc;
                                    text-decoration: none;
                                    letter-spacing: 0.3px;
                                "
                                >
                              Odjavi se s newslettera
                            </a>
                          </td>
                        </tr>
                      </table>

                      <div
                        class="footer-divider"
                        style="
                          border-top: 1px solid #444444;
                          padding-top: 24px;
                          margin-top: 24px;
                        "
                      >
                        <p
                          class="text-medium-gray"
                          style="
                            color: #888888;
                            font-size: 13px;
                            margin: 0 0 10px 0;
                          "
                        >
                          Kontakt:
                          <a
                            href="mailto:travem.hr@gmail.com"
                            style="color: #78a4d7; text-decoration: none"
                            >travem.hr@gmail.com</a
                          >
                        </p>
                        <p
                          class="text-medium-gray"
                          style="color: #888888; font-size: 12px; margin: 0"
                        >
                          © ${new Date().getFullYear()} Putujem s travEM. Sva prava
                          pridržana.
                        </p>
                      </div>
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

module.exports = {
  createEmailTemplate,
};
