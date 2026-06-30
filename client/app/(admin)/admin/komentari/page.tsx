"use client";

import { useEffect, useState } from "react";
import {
  getPendingComments,
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
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionCommentId, setActionCommentId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadPendingComments = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getPendingComments();
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
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId)
      );
    } catch (statusError: any) {
      setError(statusError.message || "Status komentara nije moguće promijeniti.");
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
        <p className="comments-review-empty">Nema komentara na čekanju.</p>
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
                {comment.moderation_reason && (
                  <span>Razlog: {comment.moderation_reason}</span>
                )}
              </div>

              <div className="comments-review-actions">
                <button
                  type="button"
                  onClick={() => handleStatusChange(comment.id, "published")}
                  disabled={actionCommentId === comment.id}
                >
                  Odobri
                </button>
                <button
                  type="button"
                  className="comments-review-reject"
                  onClick={() => handleStatusChange(comment.id, "rejected")}
                  disabled={actionCommentId === comment.id}
                >
                  Odbij
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default CommentsReviewPage;
