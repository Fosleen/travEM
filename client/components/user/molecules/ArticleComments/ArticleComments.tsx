// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addAdminCommentReply,
  addArticleComment,
  addArticleCommentReply,
  ArticleComment,
  deleteComment,
  getArticleComments,
  likeComment,
  unlikeComment,
  unsubscribeCommentNotifications,
} from "@/utils/articleComments";
import { ThumbsUp, Trash } from "@phosphor-icons/react";
import "./ArticleComments.scss";

interface ArticleCommentsProps {
  articleId: number;
}

interface CommentFormState {
  username: string;
  email: string;
  body: string;
  notifyOnReply: boolean;
}

const emptyForm = {
  username: "",
  email: "",
  body: "",
  notifyOnReply: false,
};

const getVisitorId = () => {
  const storageKey = "travem_comment_visitor_id";
  const existingId = localStorage.getItem(storageKey);

  if (existingId) {
    return existingId;
  }

  const visitorId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(storageKey, visitorId);
  return visitorId;
};

const isTokenExpired = (token: string | null) => {
  if (!token) return true;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= decodedToken.exp * 1000;
  } catch {
    return true;
  }
};

const formatCommentDate = (value: string) => {
  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const getLikedCommentIds = () => {
  try {
    return JSON.parse(localStorage.getItem("travem_liked_comments") || "[]");
  } catch {
    return [];
  }
};

const saveLikedCommentIds = (ids: number[]) => {
  localStorage.setItem("travem_liked_comments", JSON.stringify(ids));
};

const CommentForm = ({
  id,
  form,
  submitLabel,
  isSubmitting,
  isAdminForm,
  onChange,
  onSubmit,
  onCancel,
}) => (
  <form className="article-comments-form" onSubmit={onSubmit} noValidate>
    {!isAdminForm && (
      <div className="article-comments-form-grid">
        <label htmlFor={`${id}-username`}>
          Nadimak ili ime
          <input
            id={`${id}-username`}
            name="username"
            value={form.username}
            onChange={onChange}
            maxLength={80}
            required
          />
          <span className="article-comments-field-help">
            Možete koristiti nadimak. Ako ćete češće komentirati, probajte ga
            koristiti dosljedno.
          </span>
        </label>
        <label htmlFor={`${id}-email`}>
          Email (opcionalno)
          <input
            id={`${id}-email`}
            name="email"
            type="text"
            inputMode="email"
            value={form.email}
            onChange={onChange}
            maxLength={200}
          />
          <span className="article-comments-field-help">
            Email neće biti javno prikazan.
          </span>
        </label>
      </div>
    )}

    <label htmlFor={`${id}-body`}>
      Komentar
      <textarea
        id={`${id}-body`}
        name="body"
        value={form.body}
        onChange={onChange}
        maxLength={3000}
        rows={isAdminForm ? 3 : 5}
        required
      />
    </label>

    {!isAdminForm && (
      <label className="article-comments-checkbox">
        <input
          type="checkbox"
          name="notifyOnReply"
          checked={form.notifyOnReply}
          onChange={onChange}
        />
        Želim email obavijest kada netko odgovori na moj komentar
      </label>
    )}

    <div className="article-comments-form-actions">
      {onCancel && (
        <button type="button" className="article-comments-secondary-button" onClick={onCancel}>
          Odustani
        </button>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Slanje..." : submitLabel}
      </button>
    </div>
  </form>
);

const ArticleComments = ({ articleId }: ArticleCommentsProps) => {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [mainForm, setMainForm] = useState<CommentFormState>(emptyForm);
  const [replyForms, setReplyForms] = useState<Record<number, CommentFormState>>({});
  const [adminReplyForms, setAdminReplyForms] = useState<Record<number, string>>({});
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);
  const [openAdminReplyId, setOpenAdminReplyId] = useState<number | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<number[]>([]);
  const [animatingLikeId, setAnimatingLikeId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const totalComments = useMemo(() => {
    return comments.reduce(
      (total, comment) => total + 1 + (comment.replies?.length || 0),
      0
    );
  }, [comments]);

  const loadComments = useCallback(async () => {
    const data = await getArticleComments(articleId);
    setComments(data);
  }, [articleId]);

  useEffect(() => {
    loadComments().catch(() => {
      setError("Komentare trenutno nije moguće učitati.");
    });

    setLikedCommentIds(getLikedCommentIds());

    const token = localStorage.getItem("jwt");
    setIsAdmin(!isTokenExpired(token));

    const urlParams = new URLSearchParams(window.location.search);
    const unsubscribeToken = urlParams.get("commentUnsubscribe");

    if (unsubscribeToken) {
      unsubscribeCommentNotifications(unsubscribeToken)
        .then(() => setMessage("Obavijesti za komentar su isključene."))
        .catch(() => setError("Odjava od obavijesti nije uspjela."));
    }
  }, [articleId, loadComments]);

  const updateMainForm = (event) => {
    const { name, value, type, checked } = event.target;
    setMainForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "email" && value.trim() ? { notifyOnReply: true } : {}),
    }));
  };

  const updateReplyForm = (commentId: number, event) => {
    const { name, value, type, checked } = event.target;
    setReplyForms((current) => ({
      ...current,
      [commentId]: {
        ...(current[commentId] || emptyForm),
        [name]: type === "checkbox" ? checked : value,
        ...(name === "email" && value.trim() ? { notifyOnReply: true } : {}),
      },
    }));
  };

  const handleMainSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const result = await addArticleComment(articleId, mainForm);
      setMainForm(emptyForm);

      if (result.moderation?.status === "pending") {
        setMessage("Komentar je zaprimljen i bit će objavljen nakon pregleda.");
      } else {
        setMessage("Komentar je objavljen.");
        await loadComments();
      }
    } catch (submitError) {
      setError(submitError.message || "Komentar nije moguće poslati.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId: number, event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const result = await addArticleCommentReply(
        articleId,
        commentId,
        replyForms[commentId] || emptyForm
      );
      setReplyForms((current) => ({ ...current, [commentId]: emptyForm }));
      setOpenReplyId(null);

      if (result.moderation?.status === "pending") {
        setMessage("Odgovor je zaprimljen i bit će objavljen nakon pregleda.");
      } else {
        setMessage("Odgovor je objavljen.");
        await loadComments();
      }
    } catch (submitError) {
      setError(submitError.message || "Odgovor nije moguće poslati.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminReplySubmit = async (commentId: number, event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await addAdminCommentReply(articleId, commentId, adminReplyForms[commentId] || "");
      setAdminReplyForms((current) => ({ ...current, [commentId]: "" }));
      setOpenAdminReplyId(null);
      setMessage("Admin odgovor je objavljen.");
      await loadComments();
    } catch (submitError) {
      setError(submitError.message || "Admin odgovor nije moguće poslati.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (comment: ArticleComment) => {
    const visitorId = getVisitorId();
    const isLiked = likedCommentIds.includes(comment.id);
    const result = isLiked
      ? await unlikeComment(comment.id, visitorId)
      : await likeComment(comment.id, visitorId);
    const nextLikedIds = isLiked
      ? likedCommentIds.filter((id) => id !== comment.id)
      : [...likedCommentIds, comment.id];

    saveLikedCommentIds(nextLikedIds);
    setLikedCommentIds(nextLikedIds);
    setComments((current) => updateCommentLikeCount(current, comment.id, result.likeCount));

    if (!isLiked) {
      setAnimatingLikeId(comment.id);
      window.setTimeout(() => setAnimatingLikeId(null), 450);
    }
  };

  const handleDelete = async (commentId: number) => {
    const confirmed = window.confirm(
      "Želite li obrisati ovaj komentar i njegove odgovore?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deleteComment(commentId);
      setMessage("Komentar je obrisan.");
      await loadComments();
    } catch (deleteError) {
      setError(deleteError.message || "Komentar nije moguće obrisati.");
    }
  };

  const updateCommentLikeCount = (
    currentComments: ArticleComment[],
    commentId: number,
    likeCount: number
  ) =>
    currentComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, likeCount };
      }

      return {
        ...comment,
        replies: updateCommentLikeCount(comment.replies || [], commentId, likeCount),
      };
    });

  const renderComment = (comment: ArticleComment, isReply = false) => {
    const replyForm = replyForms[comment.id] || emptyForm;
    const liked = likedCommentIds.includes(comment.id);

    return (
      <div
        key={comment.id}
        className={`article-comment-item ${isReply ? "article-comment-reply" : ""}`}
      >
        <div className="article-comment-header">
          <div>
            <strong>{comment.username}</strong>
            {comment.isAdminReply && <span>Admin</span>}
          </div>
          <time>{formatCommentDate(comment.created_at)}</time>
        </div>
        <p>{comment.body}</p>

        <div className="article-comment-actions">
          <button
            type="button"
            className={`article-comment-like-button ${
              liked ? "article-comment-liked" : ""
            } ${
              animatingLikeId === comment.id ? "article-comment-like-pop" : ""
            }`}
            onClick={() => handleLike(comment)}
            aria-label={liked ? "Ukloni oznaku sviđa mi se" : "Sviđa mi se"}
          >
            <ThumbsUp size={18} weight={liked ? "fill" : "regular"} />
            <span>{comment.likeCount || 0}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenReplyId(openReplyId === comment.id ? null : comment.id);
              setOpenAdminReplyId(null);
            }}
          >
            Odgovori
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setOpenAdminReplyId(
                  openAdminReplyId === comment.id ? null : comment.id
                );
                setOpenReplyId(null);
              }}
            >
              Odgovori kao admin
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              className="article-comment-delete-button"
              onClick={() => handleDelete(comment.id)}
              aria-label="Obriši komentar"
            >
              <Trash size={17} />
              Obriši
            </button>
          )}
        </div>

        {openReplyId === comment.id && (
          <CommentForm
            id={`reply-${comment.id}`}
            form={replyForm}
            submitLabel="Objavi odgovor"
            isSubmitting={isSubmitting}
            onChange={(event) => updateReplyForm(comment.id, event)}
            onSubmit={(event) => handleReplySubmit(comment.id, event)}
            onCancel={() => setOpenReplyId(null)}
          />
        )}

        {openAdminReplyId === comment.id && (
          <CommentForm
            id={`admin-reply-${comment.id}`}
            form={{ body: adminReplyForms[comment.id] || "" }}
            submitLabel="Objavi admin odgovor"
            isSubmitting={isSubmitting}
            isAdminForm
            onChange={(event) =>
              setAdminReplyForms((current) => ({
                ...current,
                [comment.id]: event.target.value,
              }))
            }
            onSubmit={(event) => handleAdminReplySubmit(comment.id, event)}
            onCancel={() => setOpenAdminReplyId(null)}
          />
        )}

        {comment.replies?.length > 0 && (
          <div className="article-comment-replies">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="article-comments">
      <div className="article-comments-heading">
        <div className="article-comments-title-row">
          <h3>Komentari i pitanja</h3>
          <span>{totalComments}</span>
        </div>
        {comments.length === 0 && (
          <p className="article-comments-empty">
            Još nema komentara. Budite prvi koji će komentirati.
          </p>
        )}
      </div>

      {message && <div className="article-comments-message">{message}</div>}
      {error && <div className="article-comments-error">{error}</div>}

      <CommentForm
        id="main-comment"
        form={mainForm}
        submitLabel="Objavi komentar"
        isSubmitting={isSubmitting}
        onChange={updateMainForm}
        onSubmit={handleMainSubmit}
      />

      <div className="article-comments-list">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </section>
  );
};

export default ArticleComments;
