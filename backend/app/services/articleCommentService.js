import crypto from "crypto";
import axios from "axios";
import db from "../models/index.js";
import { moderateComment } from "../utils/commentModeration.js";

const COMMENT_STATUS = {
  PUBLISHED: "published",
  PENDING: "pending",
  REJECTED: "rejected",
};

const PUBLIC_COMMENT_ATTRIBUTES = [
  "id",
  "articleId",
  "parentCommentId",
  "username",
  "body",
  "status",
  "is_admin_reply",
  "like_count",
  "created_at",
  "updated_at",
];

const ADMIN_USERNAME = "putujEM s travEM";

const normalizeEmail = (email) =>
  email ? email.toString().trim().toLowerCase() : null;

const createUnsubscribeToken = () => crypto.randomBytes(32).toString("hex");

const hashVisitorId = (visitorId) =>
  crypto.createHash("sha256").update(visitorId).digest("hex");

const buildCommentTree = (comments) => {
  const plainComments = comments.map((comment) => ({
    id: comment.id,
    articleId: comment.articleId,
    parentCommentId: comment.parentCommentId,
    username: comment.username,
    body: comment.body,
    status: comment.status,
    isAdminReply: Boolean(comment.is_admin_reply),
    likeCount: comment.like_count || 0,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    replies: [],
  }));
  const commentsById = new Map(
    plainComments.map((comment) => [comment.id, comment])
  );
  const rootComments = [];

  plainComments.forEach((comment) => {
    if (comment.parentCommentId && commentsById.has(comment.parentCommentId)) {
      commentsById.get(comment.parentCommentId).replies.push(comment);
      return;
    }

    rootComments.push(comment);
  });

  return rootComments;
};

const getLambdaEndpoint = (path) => {
  if (!process.env.LAMBDA_URL) {
    throw new Error("LAMBDA_URL is not configured");
  }

  return `${process.env.LAMBDA_URL.replace(/\/$/, "")}${path}`;
};

class ArticleCommentService {
  validatePublicPayload({ username, email, body, notifyOnReply }) {
    const normalizedUsername = username?.toString().trim();
    const normalizedEmail = normalizeEmail(email);
    const normalizedBody = body?.toString().trim();
    const wantsNotifications = Boolean(notifyOnReply);

    if (!normalizedUsername || normalizedUsername.length < 2) {
      return { error: "Nadimak mora sadržavati najmanje 2 znaka" };
    }

    if (normalizedUsername.length > 80) {
      return { error: "Nadimak je predugačak" };
    }

    if (normalizedEmail && normalizedEmail.length > 200) {
      return { error: "Unesite ispravnu email adresu" };
    }

    if (
      wantsNotifications &&
      (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    ) {
      return { error: "Email je obavezan za primanje obavijesti o odgovorima" };
    }

    if (
      normalizedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return { error: "Unesite ispravnu email adresu" };
    }

    if (!normalizedBody || normalizedBody.length < 2) {
      return { error: "Komentar mora sadržavati najmanje 2 znaka" };
    }

    if (normalizedBody.length > 3000) {
      return { error: "Komentar je predugačak" };
    }

    return {
      payload: {
        username: normalizedUsername,
        email: normalizedEmail,
        body: normalizedBody,
      },
    };
  }

  async getPublishedComments(articleId) {
    const comments = await db.models.ArticleComment.findAll({
      attributes: PUBLIC_COMMENT_ATTRIBUTES,
      where: {
        articleId,
        status: COMMENT_STATUS.PUBLISHED,
        deleted_at: null,
      },
      order: [
        ["created_at", "ASC"],
        ["id", "ASC"],
      ],
    });

    return buildCommentTree(comments);
  }

  async isAdminUser(userId) {
    const user = await db.models.User.findByPk(userId);
    return Boolean(user?.is_admin);
  }

  async getPendingComments(userId) {
    if (!(await this.isAdminUser(userId))) {
      return { error: "Potreban je administratorski pristup", statusCode: 403 };
    }

    return await db.models.ArticleComment.findAll({
      where: {
        status: COMMENT_STATUS.PENDING,
        deleted_at: null,
      },
      include: [
        {
          model: db.models.Article,
          attributes: ["id", "title"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  async addPublicComment(articleId, data, parentCommentId = null) {
    const notifyOnReply = Boolean(data.notify_on_reply || data.notifyOnReply);
    const validation = this.validatePublicPayload({
      ...data,
      notifyOnReply,
    });

    if (validation.error) {
      return { error: validation.error, statusCode: 400 };
    }

    const article = await db.models.Article.findByPk(articleId);

    if (!article) {
      return { error: "Članak nije pronađen", statusCode: 404 };
    }

    let parentComment = null;

    if (parentCommentId) {
      parentComment = await db.models.ArticleComment.findOne({
        where: {
          id: parentCommentId,
          articleId,
          status: COMMENT_STATUS.PUBLISHED,
          deleted_at: null,
        },
      });

      if (!parentComment) {
        return { error: "Komentar na koji odgovarate nije pronađen", statusCode: 404 };
      }
    }

    const moderation = moderateComment(validation.payload);
    const comment = await db.models.ArticleComment.create({
      ...validation.payload,
      articleId,
      parentCommentId,
      status: moderation.status,
      moderation_reason: moderation.reason,
      notify_on_reply: notifyOnReply,
      unsubscribe_token: notifyOnReply ? createUnsubscribeToken() : null,
      is_admin_reply: false,
    });

    if (comment.status === COMMENT_STATUS.PUBLISHED && parentComment) {
      await this.sendReplyNotification(parentComment, comment, article);
    }

    return {
      comment,
      moderation: {
        status: comment.status,
        reason: comment.moderation_reason,
      },
    };
  }

  async addAdminReply(articleId, parentCommentId, body, adminUserId) {
    const normalizedBody = body?.toString().trim();

    if (!normalizedBody || normalizedBody.length < 2) {
      return { error: "Odgovor mora sadržavati najmanje 2 znaka", statusCode: 400 };
    }

    if (normalizedBody.length > 3000) {
      return { error: "Odgovor je predugačak", statusCode: 400 };
    }

    if (!(await this.isAdminUser(adminUserId))) {
      return { error: "Potreban je administratorski pristup", statusCode: 403 };
    }

    const parentComment = await db.models.ArticleComment.findOne({
      where: {
        id: parentCommentId,
        articleId,
        status: COMMENT_STATUS.PUBLISHED,
        deleted_at: null,
      },
    });

    if (!parentComment) {
      return { error: "Komentar na koji odgovarate nije pronađen", statusCode: 404 };
    }

    const article = await db.models.Article.findByPk(articleId);

    const comment = await db.models.ArticleComment.create({
      articleId,
      parentCommentId,
      username: ADMIN_USERNAME,
      email: null,
      body: normalizedBody,
      status: COMMENT_STATUS.PUBLISHED,
      notify_on_reply: false,
      is_admin_reply: true,
      adminUserId,
    });

    await this.sendReplyNotification(parentComment, comment, article);

    return { comment };
  }

  async deleteComment(commentId, userId) {
    if (!(await this.isAdminUser(userId))) {
      return { error: "Potreban je administratorski pristup", statusCode: 403 };
    }

    const comment = await db.models.ArticleComment.findByPk(commentId);

    if (!comment) {
      return { error: "Komentar nije pronađen", statusCode: 404 };
    }

    await this.softDeleteCommentTree(commentId);

    return { success: true };
  }

  async softDeleteCommentTree(commentId) {
    const deletedAt = new Date();
    const childComments = await db.models.ArticleComment.findAll({
      where: {
        parentCommentId: commentId,
        deleted_at: null,
      },
    });

    await db.models.ArticleCommentLike.destroy({
      where: {
        articleCommentId: commentId,
      },
    });

    for (const childComment of childComments) {
      await this.softDeleteCommentTree(childComment.id);
    }

    await db.models.ArticleComment.update(
      {
        deleted_at: deletedAt,
        updated_at: deletedAt,
      },
      {
        where: {
          id: commentId,
        },
      }
    );
  }

  async setCommentStatus(commentId, status, userId) {
    if (!(await this.isAdminUser(userId))) {
      return { error: "Potreban je administratorski pristup", statusCode: 403 };
    }

    if (!Object.values(COMMENT_STATUS).includes(status)) {
      return { error: "Neispravan status komentara", statusCode: 400 };
    }

    const comment = await db.models.ArticleComment.findByPk(commentId);

    if (!comment) {
      return { error: "Komentar nije pronađen", statusCode: 404 };
    }

    await comment.update({
      status,
      updated_at: new Date(),
    });

    if (status === COMMENT_STATUS.PUBLISHED && comment.parentCommentId) {
      const parentComment = await db.models.ArticleComment.findByPk(
        comment.parentCommentId
      );
      const article = await db.models.Article.findByPk(comment.articleId);
      await this.sendReplyNotification(parentComment, comment, article);
    }

    return { comment };
  }

  async likeComment(commentId, visitorId) {
    if (!visitorId || visitorId.toString().length < 12) {
      return { error: "Identifikator posjetitelja je obavezan", statusCode: 400 };
    }

    const comment = await db.models.ArticleComment.findOne({
      where: {
        id: commentId,
        status: COMMENT_STATUS.PUBLISHED,
        deleted_at: null,
      },
    });

    if (!comment) {
      return { error: "Komentar nije pronađen", statusCode: 404 };
    }

    const visitorHash = hashVisitorId(visitorId.toString());
    const [like, created] = await db.models.ArticleCommentLike.findOrCreate({
      where: {
        articleCommentId: commentId,
        visitor_hash: visitorHash,
      },
      defaults: {
        articleCommentId: commentId,
        visitor_hash: visitorHash,
      },
    });

    if (created) {
      await comment.increment("like_count");
    }

    await comment.reload();

    return {
      liked: true,
      likeCount: comment.like_count,
      like,
    };
  }

  async unlikeComment(commentId, visitorId) {
    if (!visitorId || visitorId.toString().length < 12) {
      return { error: "Identifikator posjetitelja je obavezan", statusCode: 400 };
    }

    const visitorHash = hashVisitorId(visitorId.toString());
    const deleted = await db.models.ArticleCommentLike.destroy({
      where: {
        articleCommentId: commentId,
        visitor_hash: visitorHash,
      },
    });

    const comment = await db.models.ArticleComment.findByPk(commentId);

    if (!comment) {
      return { error: "Komentar nije pronađen", statusCode: 404 };
    }

    if (deleted && comment.like_count > 0) {
      await comment.decrement("like_count");
      await comment.reload();
    }

    return {
      liked: false,
      likeCount: comment.like_count,
    };
  }

  async unsubscribe(token) {
    if (!token) {
      return { error: "Token je obavezan", statusCode: 400 };
    }

    const [updatedCount] = await db.models.ArticleComment.update(
      {
        notify_on_reply: false,
        unsubscribe_token: null,
        updated_at: new Date(),
      },
      {
        where: {
          unsubscribe_token: token,
        },
      }
    );

    if (!updatedCount) {
      return { error: "Pretplata na obavijesti nije pronađena", statusCode: 404 };
    }

    return { success: true };
  }

  async sendReplyNotification(parentComment, reply, article) {
    if (
      !parentComment ||
      !article ||
      !parentComment.notify_on_reply ||
      !parentComment.email ||
      !parentComment.unsubscribe_token
    ) {
      return;
    }

    try {
      await axios.post(
        getLambdaEndpoint("/comment-reply-notification"),
        {
          parentComment: {
            email: parentComment.email,
            username: parentComment.username,
            body: parentComment.body,
            unsubscribe_token: parentComment.unsubscribe_token,
          },
          reply: {
            body: reply.body,
          },
          article: {
            id: article.id,
            title: article.title,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.X_API_KEY,
          },
        }
      );
    } catch (error) {
      console.error("Error sending comment reply notification:", error);
    }
  }
}

export default new ArticleCommentService();
