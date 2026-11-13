import { apiUrl } from "./api";

export async function articleReviewAction(id: number, action: "submit-review" | "review", body: object = {}) {
  const response = await fetch(`${apiUrl}/articles/${id}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Pregled članka nije spremljen.");
  return result;
}
