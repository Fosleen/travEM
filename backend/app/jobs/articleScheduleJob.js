import db from "../models/index.js";
import { Op } from "sequelize";
import {
  clearCache,
  clearCacheByPattern,
} from "../middleware/redis.js";
import subscriberService from "../services/subscriberService.js";

const DEFAULT_INTERVAL_MS = 10 * 60 * 1000;

const mapArticleForNewsletter = (article) => ({
  id: article.id,
  article_title: article.title,
  article_subtitle: article.subtitle,
  article_description: article.description,
  mainArticleImage: article.main_image_url,
  article_type_id: article.articleTypeId,
});

const clearPublishedArticleCaches = async (article) => {
  await Promise.all([
    clearCache(`article:${article.id}`),
    clearCache(`article:${article.id}:admin`),
    clearCache("homepage-articles"),
    clearCache("homepage-articles:admin"),
    clearCache("homepage-stats"),
    article.countryId
      ? clearCache(`country:${article.countryId}`)
      : Promise.resolve(),
    article.countryId
      ? clearCache(`top-country-article:${article.countryId}`)
      : Promise.resolve(),
    clearCacheByPattern("countries-page:*"),
    clearCacheByPattern("country-name:*"),
  ]);
};

const processSchedule = async (schedule) => {
  const article = schedule.article;

  if (!article) {
    await schedule.update({
      publish_process_error: "Article not found for schedule.",
    });
    return;
  }

  await clearPublishedArticleCaches(article);

  const shouldSendNewsletter =
    schedule.notify_subscribers_on_publish && !schedule.newsletter_sent_at;

  if (shouldSendNewsletter) {
    await schedule.update({
      newsletter_send_started_at: new Date(),
      newsletter_send_error: null,
    });

    try {
      const subscribers = await db.models.Subscriber.findAll({});

      if (subscribers.length > 0) {
        await subscriberService.sendNewsletter(
          subscribers,
          mapArticleForNewsletter(article)
        );
      }

      await schedule.update({
        newsletter_sent_at: new Date(),
        newsletter_send_error: null,
      });
    } catch (error) {
      await schedule.update({
        newsletter_send_error: error.message,
      });
    }
  }

  await schedule.update({
    publish_processed_at: new Date(),
    publish_process_error: null,
  });
};

export const processDueArticleSchedules = async () => {
  const dueSchedules = await db.models.ArticleSchedule.findAll({
    where: {
      publish_at: {
        [Op.ne]: null,
        [Op.lte]: new Date(),
      },
      [Op.or]: [
        { publish_processed_at: null },
        {
          notify_subscribers_on_publish: true,
          newsletter_sent_at: null,
          newsletter_send_started_at: null,
        },
      ],
    },
    include: [
      {
        model: db.models.Article,
      },
    ],
    limit: 10,
    order: [["publish_at", "ASC"]],
  });

  for (const schedule of dueSchedules) {
    await processSchedule(schedule);
  }
};

export const startArticleScheduleJob = () => {
  const intervalMs = Number(
    process.env.ARTICLE_SCHEDULE_JOB_INTERVAL_MS || DEFAULT_INTERVAL_MS
  );

  setInterval(() => {
    processDueArticleSchedules().catch((error) => {
      console.error("Article schedule job failed:", error);
    });
  }, intervalMs);

  processDueArticleSchedules().catch((error) => {
    console.error("Initial article schedule job failed:", error);
  });
};
