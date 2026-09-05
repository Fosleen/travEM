"use client";

import { useEffect, useState } from "react";
import {
  addAdminCommentReply,
  AdminArticleComment,
  deleteComment,
  dismissComment,
  getAdminComments,
  likeComment,
  unlikeComment,
  updateCommentStatus,
} from "@/utils/articleComments";
import { ThumbsUp, Trash, X } from "@phosphor-icons/react";
import "./CommentsReview.scss";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const getAdminLikeVisitorId = () => {
  const storageKey = "travem_admin_comment_visitor_id";
  const storedId = localStorage.getItem(storageKey);
  if (storedId) return storedId;

  const visitorId = crypto.randomUUID();
  localStorage.setItem(storageKey, visitorId);
  return visitorId;
};

const CommentsReviewPage = () => {
  const [comments, setComments] = useState<AdminArticleComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionCommentId, setActionCommentId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [replyBodies, setReplyBodies] = useState<Record<number, string>>({});
  const [likedCommentIds, setLikedCommentIds] = useState<number[]>([]);

  const loadPendingComments = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getAdminComments();
      setComments(data);
    } catch (loadError: any) {
      setError(loadError.message || "Komentare nije moguće učitati.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingComments();
    try {
      setLikedCommentIds(JSON.parse(localStorage.getItem("travem_admin_liked_comments") || "[]"));
    } catch {
      setLikedCommentIds([]);
    }
  }, []);

  const handleStatusChange = async (
    commentId: number,
    status: "published" | "rejected"
  ) => {
    setActionCommentId(commentId);
    setError("");

    try {
      await updateCommentStatus(commentId, status);
      setComments((current) =>
        status === "rejected"
          ? current.filter(({ id }) => id !== commentId)
          : current.map((comment) =>
              comment.id === commentId ? { ...comment, status } : comment
            )
      );
    } catch (statusError: any) {
      setError(statusError.message || "Status komentara nije moguće promijeniti.");
    } finally {
      setActionCommentId(null);
    }
  };

  const removeCard = (commentId: number) =>
    setComments((current) => current.filter(({ id }) => id !== commentId));

  const handleDismiss = async (commentId: number) => {
    setActionCommentId(commentId);
    setError("");
    try {
      await dismissComment(commentId);
      removeCard(commentId);
    } catch (dismissError: any) {
      setError(dismissError.message || "Komentar nije moguće maknuti s nadzorne ploče.");
    } finally {
      setActionCommentId(null);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Trajno obrisati ovaj komentar i sve njegove odgovore?")) return;

    setActionCommentId(commentId);
    setError("");
    try {
      await deleteComment(commentId);
      removeCard(commentId);
    } catch (deleteError: any) {
      setError(deleteError.message || "Komentar nije moguće obrisati.");
    } finally {
      setActionCommentId(null);
    }
  };

  const handleLike = async (commentId: number) => {
    setActionCommentId(commentId);
    setError("");
    try {
      const isLiked = likedCommentIds.includes(commentId);
      const result = isLiked
        ? await unlikeComment(commentId, getAdminLikeVisitorId())
        : await likeComment(commentId, getAdminLikeVisitorId());
      const nextLikedIds = isLiked
        ? likedCommentIds.filter((id) => id !== commentId)
        : [...likedCommentIds, commentId];
      setLikedCommentIds(nextLikedIds);
      localStorage.setItem("travem_admin_liked_comments", JSON.stringify(nextLikedIds));
      setComments((current) => current.map((comment) =>
        comment.id === commentId
          ? { ...comment, likeCount: result.likeCount }
          : comment
      ));
    } catch (likeError: any) {
      setError(likeError.message || "Komentar nije moguće označiti sa sviđa mi se.");
    } finally {
      setActionCommentId(null);
    }
  };

  const handleReply = async (comment: AdminArticleComment) => {
    const body = replyBodies[comment.id]?.trim();

    if (!body) {
      setError("Upišite odgovor prije slanja.");
      return;
    }

    setActionCommentId(comment.id);
    setError("");

    try {
      await addAdminCommentReply(comment.articleId, comment.id, body);
      setReplyBodies((current) => ({ ...current, [comment.id]: "" }));
      setComments((current) => current.filter(({ id }) => id !== comment.id));
    } catch (replyError: any) {
      setError(replyError.message || "Odgovor nije moguće poslati.");
    } finally {
      setActionCommentId(null);
    }
  };

  return (
    <main className="comments-review">
      <div className="comments-review-header">
        <h1>Komentari</h1>
        <button type="button" onClick={loadPendingComments} disabled={isLoading}>
          Osvježi
        </button>
      </div>

      {error && <div className="comments-review-error">{error}</div>}

      {isLoading ? (
        <p className="comments-review-empty">Učitavanje...</p>
      ) : comments.length === 0 ? (
        <p className="comments-review-empty">Još nema komentara.</p>
      ) : (
        <div className="comments-review-list">
          {comments.map((comment) => (
            <article key={comment.id} className="comments-review-item">
              {comment.status === "published" && (
                <button
                  type="button"
                  className="comments-review-dismiss"
                  onClick={() => handleDismiss(comment.id)}
                  disabled={actionCommentId === comment.id}
                  aria-label="Makni s nadzorne ploče"
                  title="Pregledano — makni s nadzorne ploče"
                >
                  <X size={20} weight="bold" />
                </button>
              )}
              <div className="comments-review-meta">
                <div>
                  <strong>{comment.username}</strong>
                  <span>{comment.email}</span>
                </div>
                <time>{formatDateTime(comment.created_at)}</time>
              </div>

              <p>{comment.body}</p>

              <div className="comments-review-context">
                <span>{comment.article?.title || "Članak"}</span>
                <span className={`comments-review-status comments-review-status-${comment.status}`}>
                  {comment.status === "published" ? "Objavljeno" : comment.status === "pending" ? "Na čekanju" : "Odbijeno"}
                </span>
                {comment.moderation_reason && (
                  <span>Razlog: {comment.moderation_reason}</span>
                )}
              </div>

              {comment.status === "pending" && (
                <div className="comments-review-actions">
                  <button type="button" onClick={() => handleStatusChange(comment.id, "published")} disabled={actionCommentId === comment.id}>Odobri</button>
                  <button type="button" className="comments-review-reject" onClick={() => handleStatusChange(comment.id, "rejected")} disabled={actionCommentId === comment.id}>Odbij</button>
                </div>
              )}

              {comment.status === "published" && (
                <>
                <div className="comments-review-published-actions">
                  <button type="button" className={likedCommentIds.includes(comment.id) ? "comments-review-liked" : ""} onClick={() => handleLike(comment.id)} disabled={actionCommentId === comment.id}>
                    <ThumbsUp size={18} weight={likedCommentIds.includes(comment.id) ? "fill" : "regular"} /> Sviđa mi se ({comment.likeCount || 0})
                  </button>
                  <button type="button" className="comments-review-delete" onClick={() => handleDelete(comment.id)} disabled={actionCommentId === comment.id}>
                    <Trash size={18} /> Obriši
                  </button>
                </div>
                <div className="comments-review-reply">
                  <textarea
                    aria-label={`Odgovor za ${comment.username}`}
                    placeholder="Napišite odgovor..."
                    value={replyBodies[comment.id] || ""}
                    onChange={(event) => setReplyBodies((current) => ({ ...current, [comment.id]: event.target.value }))}
                    maxLength={3000}
                  />
                  <button type="button" onClick={() => handleReply(comment)} disabled={actionCommentId === comment.id}>
                    {actionCommentId === comment.id ? "Slanje..." : "Odgovori"}
                  </button>
                </div>
                </>
              )}

              {comment.status !== "published" && (
                <button type="button" className="comments-review-delete comments-review-standalone-delete" onClick={() => handleDelete(comment.id)} disabled={actionCommentId === comment.id}>
                  <Trash size={18} /> Obriši
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default CommentsReviewPage;
