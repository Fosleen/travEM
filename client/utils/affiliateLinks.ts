import { apiUrl } from "./api";
import { parseBooleanValue } from "./parseBooleanValue";

const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("jwt");

export interface AffiliatePartner {
  id: number;
  name: string;
  label: string;
  default_url: string;
  icon_url: string;
  sort_order: number;
}

export interface ArticleAffiliateLink {
  id?: number;
  affiliate_partner_id: number;
  url: string;
  icon_url?: string;
  is_enabled: boolean;
  sort_order: number;
  partner: AffiliatePartner;
  update_default_url?: boolean;
  use_default_url?: boolean;
}

export const getAffiliatePartners = async (): Promise<AffiliatePartner[]> => {
  const response = await fetch(`${apiUrl}/affiliates/partners`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Affiliate partners could not be loaded");
  return response.json();
};

export const addAffiliatePartner = async (
  partner: Omit<AffiliatePartner, "id">
): Promise<AffiliatePartner> => {
  const response = await fetch(`${apiUrl}/affiliates/partners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(partner),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Partner could not be added");
  return data;
};

export const updateAffiliatePartner = async (
  id: number,
  updates: Partial<Omit<AffiliatePartner, "id">>
): Promise<AffiliatePartner> => {
  const response = await fetch(`${apiUrl}/affiliates/partners/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Partner could not be updated");
  return data;
};

export const persistAffiliatePartners = async (
  links: ArticleAffiliateLink[]
): Promise<ArticleAffiliateLink[]> => {
  const persistedLinks: ArticleAffiliateLink[] = [];

  for (const link of links) {
    if (!link.partner.name.trim() || !link.partner.label.trim()) {
      throw new Error("Svaki affiliate partner mora imati naslov i tekst poveznice.");
    }
    if (!link.url.trim() || !link.icon_url) {
      throw new Error("Svaki affiliate partner mora imati URL i ikonu.");
    }

    if (link.partner.id <= 0) {
      const createdPartner = await addAffiliatePartner({
        name: link.partner.name.trim(),
        label: link.partner.label.trim(),
        default_url: link.url.trim(),
        icon_url: link.icon_url,
        sort_order: link.sort_order,
      });
      persistedLinks.push({
        ...link,
        affiliate_partner_id: createdPartner.id,
        partner: createdPartner,
        update_default_url: false,
        use_default_url: true,
      });
      continue;
    }

    const updatedPartner = await updateAffiliatePartner(link.partner.id, {
      name: link.partner.name.trim(),
      label: link.partner.label.trim(),
      icon_url: link.icon_url,
      sort_order: link.partner.sort_order,
      ...(link.update_default_url ? { default_url: link.url.trim() } : {}),
    });
    persistedLinks.push({
      ...link,
      url: link.update_default_url ? updatedPartner.default_url : link.url,
      partner: updatedPartner,
      update_default_url: false,
      use_default_url: link.update_default_url
        ? true
        : Boolean(link.use_default_url),
    });
  }

  return persistedLinks;
};

export const saveArticleAffiliateLinks = async (
  articleId: number,
  links: ArticleAffiliateLink[]
) => {
  const response = await fetch(`${apiUrl}/affiliates/articles/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      links: links.map((link, index) => ({
        affiliate_partner_id: link.affiliate_partner_id,
        url: link.use_default_url ? null : link.url,
        icon_url: link.icon_url || link.partner.icon_url,
        is_enabled: link.is_enabled,
        sort_order: index,
      })),
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Affiliate links could not be saved");
  return data;
};

export const mergeArticleAffiliateLinks = (
  partners: AffiliatePartner[],
  savedLinks: any[] = [],
  enableByDefault: boolean = true
): ArticleAffiliateLink[] =>
  partners.map((partner, index) => {
    const saved = savedLinks.find(
      (link) => Number(link.affiliatePartnerId) === partner.id
    );
    return {
      id: saved?.id,
      affiliate_partner_id: partner.id,
      url: saved?.url || partner.default_url,
      icon_url: saved?.icon_url || partner.icon_url,
      is_enabled: saved
        ? parseBooleanValue(saved.is_enabled)
        : enableByDefault,
      sort_order: saved?.sort_order ?? partner.sort_order ?? index,
      partner,
      update_default_url: false,
      use_default_url: saved ? !saved.url : true,
    };
  });
