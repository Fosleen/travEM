"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteHoneymoonProgram, dismissHoneymoonInquiry, getHoneymoonInquiries,
  getHoneymoonPrograms, getHoneymoonSettings, HoneymoonInquiry, HoneymoonProgram, reorderHoneymoonPrograms,
  saveHoneymoonProgram, saveHoneymoonSettings,
} from "@/utils/honeymoon";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import "./BookMe.scss";

type ProgramEditor = {
  id?: number; name: string; description: string; destination: string; duration: string;
  price_from: string; display_order: number; is_active: boolean; images: { image_url: string }[];
};
const blank: ProgramEditor = { name: "", description: "", destination: "", duration: "", price_from: "", display_order: 0, is_active: true, images: [] };

export default function BookMePage() {
  const [tab, setTab] = useState<"programs" | "inquiries">("programs");
  const [programs, setPrograms] = useState<HoneymoonProgram[]>([]);
  const [inquiries, setInquiries] = useState<HoneymoonInquiry[]>([]);
  const [editing, setEditing] = useState<ProgramEditor>(blank);
  const [imageUrl, setImageUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [savingHero, setSavingHero] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { const [p, i, settings] = await Promise.all([getHoneymoonPrograms(true), getHoneymoonInquiries(), getHoneymoonSettings()]); setPrograms(p); setInquiries(i); setHeroImageUrl(settings.hero_image_url || ""); }
    catch (error) { notifyFailure(error instanceof Error ? error.message : "Podatke nije moguće učitati."); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const edit = (program: HoneymoonProgram) => {
    setEditing({ id: program.id, name: program.name, description: program.description, destination: program.destination || "", duration: program.duration || "", price_from: program.price_from?.toString() || "", display_order: program.display_order, is_active: program.is_active, images: program.images.map(({ image_url }) => ({ image_url })) }); setImageUrl(""); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const addImage = () => {
    try { const parsed = new URL(imageUrl.trim()); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); }
    catch { notifyFailure("Unesite ispravan HTTP ili HTTPS URL fotografije."); return; }
    setEditing((current) => ({ ...current, images: [...(current.images || []), { image_url: imageUrl.trim() }] })); setImageUrl("");
  };
  const save = async () => {
    if (!editing.name.trim() || !editing.description.trim()) { notifyFailure("Naziv i opis su obavezni."); return; }
    setBusy(true); try { await saveHoneymoonProgram(editing); notifySuccess("Ideja putovanja je spremljena.", 2500); setEditing(blank); await load(); }
    catch (error) { notifyFailure(error instanceof Error ? error.message : "Ideju putovanja nije moguće spremiti."); } finally { setBusy(false); }
  };
  const remove = async (id: number) => {
    if (!window.confirm("Želite li trajno obrisati ovu ideju putovanja?")) return;
    try { await deleteHoneymoonProgram(id); await load(); } catch (error) { notifyFailure(error instanceof Error ? error.message : "Ideju putovanja nije moguće obrisati."); }
  };
  const move = async (index: number, offset: number) => {
    const target = index + offset; if (target < 0 || target >= programs.length) return;
    const next = [...programs]; [next[index], next[target]] = [next[target], next[index]]; setPrograms(next);
    try { await reorderHoneymoonPrograms(next); } catch { notifyFailure("Redoslijed nije moguće spremiti."); await load(); }
  };
  const dismiss = async (id: number) => {
    if (!window.confirm("Ukloniti upit s nadzorne ploče? Upit će biti trajno obrisan.")) return;
    try { await dismissHoneymoonInquiry(id); setInquiries((items) => items.filter((item) => item.id !== id)); } catch (error) { notifyFailure(error instanceof Error ? error.message : "Upit nije moguće ukloniti."); }
  };
  const saveHero = async () => {
    if (heroImageUrl.trim()) {
      try { const url = new URL(heroImageUrl.trim()); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
      catch { notifyFailure("Unesite ispravan HTTP ili HTTPS URL naslovne fotografije."); return; }
    }
    setSavingHero(true);
    try { await saveHoneymoonSettings(heroImageUrl.trim()); notifySuccess("Naslovna fotografija je spremljena.", 2500); }
    catch (error) { notifyFailure(error instanceof Error ? error.message : "Fotografiju nije moguće spremiti."); }
    finally { setSavingHero(false); }
  };

  return <main className="bookme-admin">
    <header><div><h1>BookMe</h1><p>Ideje putovanja i upiti za organizaciju medenog mjeseca.</p></div><div className="bookme-tabs"><button className={tab === "programs" ? "active" : ""} onClick={() => setTab("programs")}>Ideje putovanja</button><button className={tab === "inquiries" ? "active" : ""} onClick={() => setTab("inquiries")}>Upiti ({inquiries.length})</button></div></header>
    {tab === "programs" ? <>
      <section className="bookme-editor bookme-hero-editor">
        <h2>Naslovna fotografija</h2>
        <p>Fotografija se prikazuje u velikom banneru na vrhu stranice <strong>/medeni-mjesec</strong>.</p>
        <label>URL fotografije<input value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} placeholder="https://..." /></label>
        {heroImageUrl && <div className="bookme-hero-preview"><img src={heroImageUrl} alt="Pregled naslovne fotografije" onError={(e) => { e.currentTarget.style.display = "none"; }} /></div>}
        <div className="bookme-editor-actions"><button onClick={saveHero} disabled={savingHero}>{savingHero ? "Spremanje..." : "Spremi naslovnu fotografiju"}</button></div>
      </section>
      <section className="bookme-editor">
        <h2>{editing.id ? "Uredi ideju putovanja" : "Nova ideja putovanja"}</h2>
        <div className="bookme-grid">
          <label>Naziv *<input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
          <label>Destinacija<input value={editing.destination || ""} onChange={(e) => setEditing({ ...editing, destination: e.target.value })} /></label>
          <label>Trajanje<input value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="npr. 12 dana" /></label>
          <label>Procijenjeni troškovi putovanja od (€)<input type="number" min="0" step="0.01" value={editing.price_from ?? ""} onChange={(e) => setEditing({ ...editing, price_from: e.target.value })} placeholder="Bez naknade za planiranje" /></label>
          <label className="full">Opis *<textarea rows={5} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
          <label className="checkbox full"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Ideja putovanja vidljiva je na javnoj stranici</label>
          <div className="full bookme-images"><label>URL fotografije<input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} /></label><button type="button" onClick={addImage}>Dodaj fotografiju</button></div>
          <div className="full bookme-image-list">{editing.images?.map((image, index) => <div key={`${image.image_url}-${index}`}><img src={image.image_url} alt="Pregled" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /><span>{image.image_url}</span><button onClick={() => setEditing({ ...editing, images: editing.images.filter((_, i) => i !== index) })}>Ukloni</button></div>)}</div>
        </div>
        <div className="bookme-editor-actions">{editing.id && <button className="secondary" onClick={() => setEditing(blank)}>Odustani</button>}<button onClick={save} disabled={busy}>{busy ? "Spremanje..." : "Spremi ideju putovanja"}</button></div>
      </section>
      <section className="bookme-program-list"><h2>Ideje putovanja</h2>{programs.length === 0 ? <p>Još nema ideja putovanja.</p> : programs.map((program, index) => <article key={program.id}><div><strong>{program.name}</strong><span>{program.is_active ? "Aktivna" : "Skrivena"}{program.price_from ? ` · Troškovi putovanja od ${Number(program.price_from).toLocaleString("hr-HR")} €` : ""}</span></div><div><button disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button disabled={index === programs.length - 1} onClick={() => move(index, 1)}>↓</button><button onClick={() => edit(program)}>Uredi</button><button className="danger" onClick={() => remove(program.id)}>Obriši</button></div></article>)}</section>
    </> : <section className="bookme-inquiries">{inquiries.length === 0 ? <p>Nema novih upita.</p> : inquiries.map((item) => <article key={item.id}><button className="dismiss" onClick={() => dismiss(item.id)}>Ukloni</button><h2>{item.first_name} {item.last_name}</h2><p className="date">{new Date(item.createdAt).toLocaleString("hr-HR")}</p><dl><dt>Ideja putovanja</dt><dd>{item.program_name}</dd><dt>Email</dt><dd><a href={`mailto:${item.email}`}>{item.email}</a></dd><dt>Broj putnika</dt><dd>{item.traveler_count}</dd>{item.phone && <><dt>Telefon</dt><dd>{item.phone}</dd></>}{item.approximate_date && <><dt>Datum</dt><dd>{item.approximate_date}</dd></>}{item.estimated_budget && <><dt>Budžet</dt><dd>{item.estimated_budget}</dd></>}{item.preferred_destinations && <><dt>Destinacije</dt><dd>{item.preferred_destinations}</dd></>}{item.departure_airport && <><dt>Polazište</dt><dd>{item.departure_airport}</dd></>}</dl>{item.message && <p className="message">{item.message}</p>}</article>)}</section>}
  </main>;
}
