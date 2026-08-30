import { apiUrl } from "./api";

export type HoneymoonImage = { id?: number; image_url: string; display_order?: number };
export type HoneymoonProgram = {
  id: number; name: string; description: string; destination?: string | null;
  duration?: string | null; price_from?: string | number | null; display_order: number;
  is_active: boolean; images: HoneymoonImage[];
};
export type HoneymoonInquiry = {
  id: number; first_name: string; last_name: string; email: string; phone?: string;
  approximate_date?: string; traveler_count: number; estimated_budget?: string;
  preferred_destinations?: string; departure_airport?: string; message?: string;
  program_name: string; createdAt: string;
};
export type HoneymoonSettings = { id: number; hero_image_url?: string | null };

async function parse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Došlo je do pogreške.");
  return data;
}
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

export const getHoneymoonPrograms = async (admin = false): Promise<HoneymoonProgram[]> =>
  parse(await fetch(`${apiUrl}/honeymoon/${admin ? "admin/" : ""}programs`, admin ? { headers: authHeaders(), cache: "no-store" } : { cache: "no-store" }));
export const getHoneymoonSettings = async (): Promise<HoneymoonSettings> =>
  parse(await fetch(`${apiUrl}/honeymoon/settings`, { cache: "no-store" }));
export const saveHoneymoonSettings = async (hero_image_url: string): Promise<HoneymoonSettings> =>
  parse(await fetch(`${apiUrl}/honeymoon/admin/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ hero_image_url }) }));
export const saveHoneymoonProgram = async (program: Partial<HoneymoonProgram>) =>
  parse(await fetch(`${apiUrl}/honeymoon/admin/programs${program.id ? `/${program.id}` : ""}`, { method: program.id ? "PUT" : "POST", headers: authHeaders(), body: JSON.stringify(program) }));
export const deleteHoneymoonProgram = async (id: number) =>
  parse(await fetch(`${apiUrl}/honeymoon/admin/programs/${id}`, { method: "DELETE", headers: authHeaders() }));
export const reorderHoneymoonPrograms = async (programs: HoneymoonProgram[]) =>
  Promise.all(programs.map((program, display_order) => saveHoneymoonProgram({ ...program, display_order })));
export const submitHoneymoonInquiry = async (payload: Record<string, unknown>) =>
  parse(await fetch(`${apiUrl}/honeymoon/inquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }));
export const getHoneymoonInquiries = async (): Promise<HoneymoonInquiry[]> =>
  parse(await fetch(`${apiUrl}/honeymoon/admin/inquiries`, { headers: authHeaders(), cache: "no-store" }));
export const dismissHoneymoonInquiry = async (id: number) =>
  parse(await fetch(`${apiUrl}/honeymoon/admin/inquiries/${id}`, { method: "DELETE", headers: authHeaders() }));
