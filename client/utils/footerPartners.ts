import { FooterPartnerData } from "@/common/types";
import { apiUrl } from "./api";

const authHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const parseResponse = async (response: Response) => {
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
};

export async function getFooterPartners(): Promise<FooterPartnerData[]> {
  return parseResponse(await fetch(`${apiUrl}/footer-partners`, { cache: "no-store" }));
}

export async function getFooterPartnersAdmin(): Promise<FooterPartnerData[]> {
  return parseResponse(await fetch(`${apiUrl}/footer-partners/admin`, {
    cache: "no-store",
    headers: authHeaders(),
  }));
}

export async function createFooterPartner(
  partner: Pick<
    FooterPartnerData,
    "name" | "image_url" | "showcase_image_url" | "target_url" | "is_active"
  >
): Promise<FooterPartnerData> {
  return parseResponse(await fetch(`${apiUrl}/footer-partners`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(partner),
  }));
}

export async function updateFooterPartner(
  id: number,
  partner: Partial<FooterPartnerData>
): Promise<FooterPartnerData> {
  return parseResponse(await fetch(`${apiUrl}/footer-partners/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(partner),
  }));
}

export async function deleteFooterPartner(id: number) {
  return parseResponse(await fetch(`${apiUrl}/footer-partners/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }));
}

export async function reorderFooterPartners(ids: number[]): Promise<FooterPartnerData[]> {
  return parseResponse(await fetch(`${apiUrl}/footer-partners/reorder`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ ids }),
  }));
}
