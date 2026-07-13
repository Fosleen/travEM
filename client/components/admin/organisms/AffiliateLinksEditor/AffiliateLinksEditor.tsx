"use client";

import { Plus, Trash } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { ArticleAffiliateLink } from "@/utils/affiliateLinks";
import "./AffiliateLinksEditor.scss";

interface AffiliateIcon {
  fileName: string;
  label: string;
  url: string;
}

interface Props {
  value: ArticleAffiliateLink[];
  onChange: (links: ArticleAffiliateLink[]) => void;
}

const AffiliateLinksEditor = ({ value, onChange }: Props) => {
  const [icons, setIcons] = useState<AffiliateIcon[]>([]);
  const [openIconPicker, setOpenIconPicker] = useState<number | null>(null);

  const loadIcons = useCallback(async () => {
    try {
      const response = await fetch("/api/affiliate-icons", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Icons could not be loaded");
      setIcons(await response.json());
    } catch (error) {
      console.error("Affiliate icons could not be loaded:", error);
      setIcons([]);
    }
  }, []);

  useEffect(() => {
    loadIcons();
  }, [loadIcons]);

  const updateLink = (index: number, patch: Partial<ArticleAffiliateLink>) => {
    onChange(
      value.map((link, currentIndex) =>
        currentIndex === index ? { ...link, ...patch } : link
      )
    );
  };

  const updatePartner = (
    index: number,
    patch: Partial<ArticleAffiliateLink["partner"]>
  ) => {
    updateLink(index, {
      partner: { ...value[index].partner, ...patch },
    });
  };

  const addDraftPartner = async () => {
    const availableIcons = icons.length
      ? icons
      : await fetch("/api/affiliate-icons", { cache: "no-store" })
          .then((response) => (response.ok ? response.json() : []))
          .catch(() => []);

    if (!icons.length && availableIcons.length) setIcons(availableIcons);

    const temporaryId = -Date.now();
    const iconUrl = availableIcons[0]?.url || "";
    onChange([
      ...value,
      {
        affiliate_partner_id: temporaryId,
        url: "",
        icon_url: iconUrl,
        is_enabled: true,
        sort_order: value.length,
        update_default_url: false,
        use_default_url: true,
        partner: {
          id: temporaryId,
          name: "",
          label: "",
          default_url: "",
          icon_url: iconUrl,
          sort_order: value.length * 10 + 10,
        },
      },
    ]);
  };

  const removeDraftPartner = (index: number) => {
    onChange(value.filter((_link, currentIndex) => currentIndex !== index));
  };

  return (
    <section className="affiliate-editor">
      <div className="affiliate-editor__header">
        <h6>Affiliate poveznice</h6>
        <button
          type="button"
          onClick={addDraftPartner}
          aria-label="Dodaj affiliate partnera"
          title="Dodaj novi red"
        >
          <Plus size={22} />
        </button>
      </div>

      {value.length > 0 && (
        <div className="affiliate-editor__column-labels" aria-hidden="true">
          <span>Naslov</span>
          <span>Tekst poveznice</span>
          <span>URL</span>
          <span>Ikona</span>
          <span>Default URL</span>
          <span>Prikaži</span>
          <span />
        </div>
      )}

      <div className="affiliate-editor__list">
        {value.map((link, index) => (
          <div
            className={`affiliate-editor__row ${
              !link.is_enabled ? "is-disabled" : ""
            }`}
            key={link.affiliate_partner_id}
          >
            <input
              aria-label="Naslov partnera"
              placeholder="Npr. Booking.com"
              value={link.partner.name}
              onChange={(event) =>
                updatePartner(index, { name: event.target.value })
              }
            />

            <input
              aria-label={`Tekst poveznice za ${link.partner.name || "partnera"}`}
              placeholder="Npr. Pronađi smještaj"
              value={link.partner.label}
              onChange={(event) =>
                updatePartner(index, { label: event.target.value })
              }
            />

            <input
              aria-label={`URL za ${link.partner.name || "partnera"}`}
              placeholder="https://..."
              type="url"
              value={link.url}
              onChange={(event) =>
                updateLink(index, {
                  url: event.target.value,
                  use_default_url: false,
                })
              }
            />

            <div className="affiliate-editor__icon-picker">
              <button
                type="button"
                className="affiliate-editor__icon-trigger"
                aria-label={`Ikona za ${link.partner.name || "partnera"}`}
                aria-expanded={openIconPicker === link.affiliate_partner_id}
                onClick={() => {
                  loadIcons();
                  setOpenIconPicker(
                    openIconPicker === link.affiliate_partner_id
                      ? null
                      : link.affiliate_partner_id
                  );
                }}
              >
                {(link.icon_url || link.partner.icon_url) ? (
                  <img
                    src={link.icon_url || link.partner.icon_url}
                    alt="Odabrana ikona"
                  />
                ) : (
                  <span>—</span>
                )}
                <span aria-hidden="true">⌄</span>
              </button>

              {openIconPicker === link.affiliate_partner_id && (
                <div
                  className="affiliate-editor__icon-menu"
                  role="listbox"
                  aria-label="Dostupne affiliate ikone"
                >
                  {icons.map((icon) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={link.icon_url === icon.url}
                      className={link.icon_url === icon.url ? "is-selected" : ""}
                      key={icon.url}
                      title={icon.label}
                      onClick={() => {
                        updateLink(index, { icon_url: icon.url });
                        setOpenIconPicker(null);
                      }}
                    >
                      <img src={icon.url} alt={icon.label} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ToggleSwitch
              name={`affiliate-default-${link.affiliate_partner_id}`}
              description="Spremi kao default"
              value={Boolean(link.update_default_url)}
              setter={() =>
                updateLink(index, {
                  update_default_url: !link.update_default_url,
                })
              }
            />

            <ToggleSwitch
              name={`affiliate-visible-${link.affiliate_partner_id}`}
              description="Prikaži"
              value={link.is_enabled}
              setter={() =>
                updateLink(index, { is_enabled: !link.is_enabled })
              }
            />

            {link.partner.id <= 0 ? (
              <button
                type="button"
                className="affiliate-editor__remove"
                onClick={() => removeDraftPartner(index)}
                aria-label="Ukloni novi affiliate red"
              >
                <Trash size={21} />
              </button>
            ) : (
              <span className="affiliate-editor__remove-spacer" />
            )}
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <p className="affiliate-editor__empty">
          Nema affiliate partnera. Zeleni plus dodaje novi red koji će se
          spremiti zajedno s člankom.
        </p>
      )}
    </section>
  );
};

export default AffiliateLinksEditor;
