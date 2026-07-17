import service from "../services/articleCommentService.js";

class ArticleCommentController {
  async getArticleComments(req, res) {
    try {
      const comments = await service.getPublishedComments(req.params.articleId);
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addComment(req, res) {
    try {
      const result = await service.addPublicComment(req.params.articleId, req.body);

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addReply(req, res) {
    try {
      const result = await service.addPublicComment(
        req.params.articleId,
        req.body,
        req.params.commentId
      );

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addAdminReply(req, res) {
    try {
      const result = await service.addAdminReply(
        req.params.articleId,
        req.params.commentId,
        req.body.body,
        req.user?.id
      );

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding admin reply:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPendingComments(req, res) {
    try {
      const comments = await service.getPendingComments(req.user?.id);

      if (comments.error) {
        return res.status(comments.statusCode || 400).json({ error: comments.error });
      }

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching pending comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAdminComments(req, res) {
    try {
      const comments = await service.getAdminComments(req.user?.id);

      if (comments.error) {
        return res.status(comments.statusCode || 400).json({ error: comments.error });
      }

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching admin comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async setCommentStatus(req, res) {
    try {
      const result = await service.setCommentStatus(
        req.params.commentId,
        req.body.status,
        req.user?.id
      );

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating comment status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteComment(req, res) {
    try {
      const result = await service.deleteComment(req.params.commentId, req.user?.id);

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async likeComment(req, res) {
    try {
      const result = await service.likeComment(
        req.params.commentId,
        req.body.visitorId
      );

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unlikeComment(req, res) {
    try {
      const result = await service.unlikeComment(
        req.params.commentId,
        req.body.visitorId
      );

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error unliking comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unsubscribe(req, res) {
    try {
      const result = await service.unsubscribe(req.query.token);

      if (result.error) {
        return res.status(result.statusCode || 400).json({ error: result.error });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error unsubscribing comment notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ArticleCommentController();
