import { apiUrl } from "./api";
import type { DomagoPartnerBannerConfig } from "@/components/user/molecules/DomagoPartnerBanner/DomagoPartnerBanner";

export const defaultDomagoPartnerBanner: DomagoPartnerBannerConfig = {
  partnerLogoUrl: "", partnerLogoAlt: "Partner", siteLogoUrl: "", siteLogoAlt: "putujEM s travEM",
  heroImageUrl: "", heroImageAlt: "", headlineLine1: "", headlineLine2Prefix: "",
  headlineAccent: "", description: "", ctaLabel: "", ctaUrl: "",
  openCtaInNewTab: true, note: "", accentColor: "#ff9418",
  showStamp: true, stampTopText: "", stampMainText: "", stampBottomText: "",
  partnerLogoScale: 2,
};

export async function getDomagoPartnerBanner(noCache = false): Promise<DomagoPartnerBannerConfig> {
  const response = await fetch(`${apiUrl}/domago-partner-banner?noCache=${noCache}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) return defaultDomagoPartnerBanner;
  return data;
}

export async function updateDomagoPartnerBanner(config: DomagoPartnerBannerConfig) {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const response = await fetch(`${apiUrl}/domago-partner-banner`, {
    method: "PATCH",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(config),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error updating partner banner");
  return data;
}
