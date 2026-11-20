import nodemailer from 'nodemailer';
import { newsletterTemplate } from './template.js';

export function createNewsletterSmtp(config, createTransport = nodemailer.createTransport) {
  let transporter;
  return async (email, article) => {
    if (!config.password || !config.jwtSecret) throw Object.assign(new Error('Newsletter SMTP ili JWT konfiguracija nedostaje.'), { code: 'EAUTH' });
    transporter ||= createTransport({
      host: config.host, port: config.port, secure: true, pool: true,
      maxConnections: 1, maxMessages: 1000,
      connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 30000,
      auth: { user: config.user, pass: config.password },
    });
    const content = newsletterTemplate(article, email, config.jwtSecret);
    const info = await transporter.sendMail({
      from: { name: 'putujEM s travEM', address: config.user },
      to: email, subject: `Novi članak: ${article.article_title}`, ...content,
      // Deliberately no Reply-To: hello@... . A mailbox called noreply still accepts replies.
    });
    if (info.rejected?.length || !info.accepted?.length) {
      throw Object.assign(new Error('SMTP nije prihvatio primatelja.'), { code: 'EENVELOPE', responseCode: 550 });
    }
    return info;
  };
}
