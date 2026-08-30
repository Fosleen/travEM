"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AirplaneTilt, PencilSimpleLine, Plus, X } from "@phosphor-icons/react";
import { AirportCityData } from "@/common/types";
import Button from "@/components/atoms/Button";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import {
  createAirportCity,
  getAirportCities,
  updateAirportCity,
} from "@/utils/airportCities";
import { getAirportHeroImage } from "@/utils/airportVisuals";
import "./AirportAdmin.scss";

type Draft = Omit<AirportCityData, "id">;
const emptyDraft: Draft = {
  name: "",
  flag_url: "",
  banner_image_url: "",
  is_in_croatia: true,
  is_active: true,
  display_order: 10,
};

export default function AirportAdminPage() {
  const [airports, setAirports] = useState<AirportCityData[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setAirports(await getAirportCities(true));
    } catch (error) {
      notifyFailure(error instanceof Error ? error.message : "Aerodromi se nisu mogli učitati.");
    }
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(
    () => airports.filter(({ name }) =>
      name.toLocaleLowerCase("hr").includes(search.trim().toLocaleLowerCase("hr"))
    ),
    [airports, search]
  );

  const edit = (airport: AirportCityData) => {
    setIsAdding(false);
    setEditingId(airport.id);
    setDraft({
      name: airport.name,
      flag_url: airport.flag_url || "",
      banner_image_url: airport.banner_image_url || "",
      is_in_croatia: airport.is_in_croatia,
      is_active: airport.is_active,
      display_order: airport.display_order ?? 10,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => { setEditingId(null); setIsAdding(false); setDraft(emptyDraft); };

  useEffect(() => {
    if (!isAdding && editingId === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) reset();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdding, editingId, saving]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (isAdding) await createAirportCity(draft);
      else if (editingId !== null) await updateAirportCity(editingId, draft);
      await load();
      reset();
      notifySuccess("Aerodrom je spremljen.");
    } catch (error) {
      notifyFailure(error instanceof Error ? error.message : "Spremanje nije uspjelo.");
    } finally { setSaving(false); }
  };

  const toggle = async (airport: AirportCityData) => {
    try {
      const updated = await updateAirportCity(airport.id, { is_active: !airport.is_active });
      setAirports((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      notifyFailure(error instanceof Error ? error.message : "Vidljivost nije spremljena.");
    }
  };

  return (
    <div className="airport-admin">
      <header className="airport-admin__header">
        <div><h1>Aerodromi i banneri</h1><p>Upravljaj polaznim aerodromima, fotografijama, redoslijedom i vidljivošću.</p></div>
        <Button adminPrimary onClick={() => { setEditingId(null); setDraft(emptyDraft); setIsAdding(true); }}><Plus size={20} /> dodaj aerodrom</Button>
      </header>

      {(isAdding || editingId !== null) && (
        <div className="airport-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) reset(); }}>
          <form className="airport-form" onSubmit={save} role="dialog" aria-modal="true" aria-labelledby="airport-form-title">
            <div className="airport-form__title"><div><span><AirplaneTilt size={22} /></span><h2 id="airport-form-title">{isAdding ? "Novi aerodrom" : `Uredi ${draft.name}`}</h2></div><button type="button" onClick={reset} disabled={saving} aria-label="Zatvori"><X size={22} /></button></div>
            <div className="airport-form__fields">
              <label>Naziv<input autoFocus required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
              <label>Redoslijed<input type="number" value={draft.display_order ?? 10} onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })} /></label>
              <label className="wide">URL zastave<input required type="url" placeholder="https://..." value={draft.flag_url} onChange={(e) => setDraft({ ...draft, flag_url: e.target.value })} /></label>
              <label className="wide">URL banner fotografije<input required={isAdding} type="url" placeholder="https://..." value={draft.banner_image_url || ""} onChange={(e) => setDraft({ ...draft, banner_image_url: e.target.value })} /></label>
            </div>
            <div className="airport-form__switches"><label><input type="checkbox" checked={draft.is_in_croatia} onChange={(e) => setDraft({ ...draft, is_in_croatia: e.target.checked })} /><span><strong>Iz Hrvatske</strong><small>Prikaži u hrvatskoj grupi</small></span></label><label><input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} /><span><strong>Prikazan javno</strong><small>Vidljiv u meniju i na hub stranici</small></span></label></div>
            {(draft.banner_image_url || draft.name) && <div className="airport-form__preview"><span>Pregled bannera</span><Image src={(draft.banner_image_url || getAirportHeroImage(draft.name)).trim()} alt="Pregled bannera" width={1000} height={420} unoptimized /></div>}
            <div className="airport-form__actions"><Button adminPrimary type="submit" disabled={saving}>{saving ? "spremanje..." : "spremi aerodrom"}</Button><Button white onClick={reset} disabled={saving}>odustani</Button></div>
          </form>
        </div>
      )}

      <div className="airport-admin__toolbar"><input type="search" placeholder="Pretraži aerodrome..." value={search} onChange={(e) => setSearch(e.target.value)} /><span>{visible.length} od {airports.length}</span></div>
      <div className="airport-list">{visible.map((airport) => (
        <article key={airport.id} className={airport.is_active ? "" : "is-inactive"}>
          <div className="airport-row__visual"><Image className="banner" src={(airport.banner_image_url || getAirportHeroImage(airport.name)).trim()} alt={`Banner za ${airport.name}`} width={240} height={110} unoptimized /><Image className="flag" src={airport.flag_url.trim()} alt={`Zastava za ${airport.name}`} width={32} height={32} unoptimized /></div>
          <div className="airport-row__details"><strong>{airport.name}</strong><div><span className={airport.is_in_croatia ? "group croatia" : "group"}>{airport.is_in_croatia ? "Iz Hrvatske" : "Ostali"}</span><span className="order">Redoslijed: {airport.display_order ?? "—"}</span></div></div>
          <label className="airport-row__visibility"><input type="checkbox" checked={airport.is_active} onChange={() => toggle(airport)} /><span>{airport.is_active ? "Prikazan" : "Skriven"}</span></label>
          <button className="airport-row__edit" type="button" onClick={() => edit(airport)} aria-label={`Uredi ${airport.name}`}><PencilSimpleLine size={20} /></button>
        </article>
      ))}{visible.length === 0 && <p className="airport-list__empty">Nema aerodroma koji odgovaraju pretraživanju.</p>}</div>
    </div>
  );
}
