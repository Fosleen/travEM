import { apiUrl } from "./api";

export interface ArticleComment {
  id: number;
  articleId: number;
  parentCommentId: number | null;
  username: string;
  body: string;
  status: "published" | "pending" | "rejected";
  isAdminReply: boolean;
  likeCount: number;
  created_at: string;
  replies: ArticleComment[];
}

export interface CommentPayload {
  username: string;
  email: string;
  body: string;
  notifyOnReply: boolean;
}

export interface AdminArticleComment extends Omit<ArticleComment, "isAdminReply" | "replies"> {
  email: string | null;
  moderation_reason: string | null;
  article: {
    id: number;
    title: string;
  };
}

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("jwt");
};

export async function getArticleComments(articleId: number) {
  const response = await fetch(`${apiUrl}/articles/${articleId}/comments`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to fetch comments");
  }

  return (await response.json()) as ArticleComment[];
}

export async function addArticleComment(
  articleId: number,
  payload: CommentPayload
) {
  const response = await fetch(`${apiUrl}/articles/${articleId}/comments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add comment");
  }

  return data;
}

export async function addArticleCommentReply(
  articleId: number,
  commentId: number,
  payload: CommentPayload
) {
  const response = await fetch(
    `${apiUrl}/articles/${articleId}/comments/${commentId}/replies`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add reply");
  }

  return data;
}

export async function addAdminCommentReply(
  articleId: number,
  commentId: number,
  body: string
) {
  const token = getToken();
  const response = await fetch(
    `${apiUrl}/articles/${articleId}/comments/${commentId}/admin-replies`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ body }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add admin reply");
  }

  return data;
}

export async function likeComment(commentId: number, visitorId: string) {
  const response = await fetch(`${apiUrl}/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ visitorId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to like comment");
  }

  return data as { liked: boolean; likeCount: number };
}

export async function unlikeComment(commentId: number, visitorId: string) {
  const response = await fetch(`${apiUrl}/comments/${commentId}/like`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ visitorId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to unlike comment");
  }

  return data as { liked: boolean; likeCount: number };
}

export async function deleteComment(commentId: number) {
  const token = getToken();
  const response = await fetch(`${apiUrl}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete comment");
  }

  return data;
}

export async function unsubscribeCommentNotifications(token: string) {
  const response = await fetch(
    `${apiUrl}/comments/unsubscribe?token=${encodeURIComponent(token)}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to unsubscribe");
  }

  return data;
}

export async function getPendingComments() {
  const token = getToken();
  const response = await fetch(`${apiUrl}/comments/pending`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch pending comments");
  }

  return data;
}

export async function getAdminComments() {
  const token = getToken();
  const response = await fetch(`${apiUrl}/comments/admin`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch comments");
  }

  return data as AdminArticleComment[];
}

export async function updateCommentStatus(
  commentId: number,
  status: "published" | "rejected"
) {
  const token = getToken();
  const response = await fetch(`${apiUrl}/comments/${commentId}/status`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update comment");
  }

  return data;
}
