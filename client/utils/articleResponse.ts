// Content is saved through several requests. A failed child request must stop
// submission/approval instead of being treated as successfully saved content.
export async function articleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Spremanje sadržaja nije uspjelo.");
  return data;
}
