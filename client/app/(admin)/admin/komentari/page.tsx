"use client";

import { useEffect, useState } from "react";
import {
  addAdminCommentReply,
  AdminArticleComment,
  getAdminComments,
  updateCommentStatus,
} from "@/utils/articleComments";
import "./CommentsReview.scss";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const CommentsReviewPage = () => {
  const [comments, setComments] = useState<AdminArticleComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionCommentId, setActionCommentId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [replyBodies, setReplyBodies] = useState<Record<number, string>>({});

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
  }, []);

  const handleStatusChange = async (
    commentId: number,
    status: "published" | "rejected"
  ) => {
    setActionCommentId(commentId);
    setError("");

    try {
      await updateCommentStatus(commentId, status);
      setComments((current) => current.map((comment) =>
        comment.id === commentId ? { ...comment, status } : comment
      ));
    } catch (statusError: any) {
      setError(statusError.message || "Status komentara nije moguće promijeniti.");
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
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default CommentsReviewPage;
