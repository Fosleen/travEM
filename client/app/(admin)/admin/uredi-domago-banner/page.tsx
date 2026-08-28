"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { defaultDomagoPartnerBanner, getDomagoPartnerBanner, updateDomagoPartnerBanner } from "@/utils/domagoPartnerBanner";
import type { DomagoPartnerBannerConfig } from "@/components/user/molecules/DomagoPartnerBanner/DomagoPartnerBanner";
import "./EditDomagoBanner.scss";

const fields: Array<[keyof DomagoPartnerBannerConfig, string, boolean?]> = [
  ["partnerLogoUrl", "Logo partnera URL"], ["partnerLogoAlt", "Logo partnera alt tekst"],
  ["siteLogoUrl", "putujEM s travEM logo URL"], ["siteLogoAlt", "putujEM s travEM logo alt tekst"],
  ["heroImageUrl", "Banner image URL"], ["heroImageAlt", "Banner image alt text"],
  ["headlineLine1", "Prvi red naslova"], ["headlineLine2Prefix", "Početak drugog reda"],
  ["headlineAccent", "Naglašeni tekst"], ["description", "Opis", true], ["ctaLabel", "CTA tekst"],
  ["ctaUrl", "CTA URL"], ["note", "Napomena"], ["accentColor", "Boja naglaska"],
  ["stampTopText", "Gornji tekst pečata"], ["stampMainText", "Glavni tekst pečata"], ["stampBottomText", "Donji tekst pečata"],
  ["partnerLogoScale", "Veličina logotipa partnera (0.5–3×)"],
];

export default function EditDomagoBanner() {
  const [config, setConfig] = useState<DomagoPartnerBannerConfig | null>(null);
  useEffect(() => { getDomagoPartnerBanner(true).then(setConfig).catch(() => { setConfig(defaultDomagoPartnerBanner); notifyFailure("Nije moguće učitati spremljene postavke; prikazane su zadane vrijednosti."); }); }, []);
  if (!config) return <div className="edit-domago-banner"><h2>Partner Banner</h2><p>Učitavanje...</p></div>;
  const update = (key: keyof DomagoPartnerBannerConfig, value: string | boolean | number) => setConfig({ ...config, [key]: value });
  const save = async () => { try { setConfig(await updateDomagoPartnerBanner(config)); notifySuccess("Uspješno ažurirano!"); } catch { notifyFailure("Došlo je do greške. Pokušajte ponovo."); } };
  return <div className="edit-domago-banner">
    <h2>Partner Banner</h2>
    <p>Slike se učitavaju s unesenih URL-ova i ne spremaju se kao projektni asseti.</p>
    <div className="edit-domago-banner__grid">
      {fields.map(([key, label, textarea]) => textarea ? <label key={key}>{label}<textarea value={String(config[key] || "")} onChange={(e) => update(key, e.target.value)} /></label> : <Input key={key} adminView type={key === "accentColor" ? "color" : key === "partnerLogoScale" ? "number" : key.toLowerCase().includes("url") ? "url" : "text"} name={key} label={label} placeholder="" value={String(config[key] || "")} onChange={(e) => update(key, key === "partnerLogoScale" ? Number(e.target.value) : e.target.value)} />)}
    </div>
    <div className="edit-domago-banner__toggles">
      <ToggleSwitch name="domago-new-tab" description="Otvori CTA u novoj kartici" value={config.openCtaInNewTab !== false} setter={(value: boolean) => update("openCtaInNewTab", value)} />
      <ToggleSwitch name="domago-stamp" description="Prikaži pečat partnera" value={config.showStamp !== false} setter={(value: boolean) => update("showStamp", value)} />
    </div>
    <Button adminPrimary onClick={save}>spremi promjene</Button>
  </div>;
}
