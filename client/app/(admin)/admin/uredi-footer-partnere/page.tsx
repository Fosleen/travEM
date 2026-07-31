"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CaretDown, CaretUp, PencilSimpleLine, Plus, Trash, X } from "@phosphor-icons/react";
import { FooterPartnerData } from "@/common/types";
import Button from "@/components/atoms/Button";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import {
  createFooterPartner,
  deleteFooterPartner,
  getFooterPartnersAdmin,
  reorderFooterPartners,
  updateFooterPartner,
} from "@/utils/footerPartners";
import "./EditFooterPartners.scss";

type PartnerDraft = Pick<FooterPartnerData, "name" | "image_url" | "target_url" | "is_active">;

const emptyDraft: PartnerDraft = {
  name: "",
  image_url: "",
  target_url: "",
  is_active: true,
};

const EditFooterPartners = () => {
  const [partners, setPartners] = useState<FooterPartnerData[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<PartnerDraft>(emptyDraft);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadPartners = async () => {
    try {
      setPartners(await getFooterPartnersAdmin());
    } catch (error) {
      console.error(error);
      notifyFailure("Partneri se nisu mogli učitati.");
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const visiblePartners = useMemo(
    () => partners.filter((partner) =>
      partner.name.toLocaleLowerCase("hr").includes(search.toLocaleLowerCase("hr").trim())
    ),
    [partners, search]
  );

  const openEdit = (partner: FooterPartnerData) => {
    setIsAdding(false);
    setEditingId(partner.id);
    setDraft({
      name: partner.name,
      image_url: partner.image_url,
      target_url: partner.target_url,
      is_active: partner.is_active,
    });
  };

  const closeForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setDraft(emptyDraft);
  };

  useEffect(() => {
    if (!isAdding && editingId === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) closeForm();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdding, editingId, isSaving]);

  const savePartner = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (isAdding) {
        await createFooterPartner(draft);
      } else if (editingId !== null) {
        await updateFooterPartner(editingId, draft);
      }
      await loadPartners();
      closeForm();
      notifySuccess("Partner je uspješno spremljen.");
    } catch (error) {
      console.error(error);
      notifyFailure(error instanceof Error ? error.message : "Spremanje nije uspjelo.");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePartner = async (partner: FooterPartnerData) => {
    try {
      const updated = await updateFooterPartner(partner.id, {
        is_active: !partner.is_active,
      });
      setPartners((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      console.error(error);
      notifyFailure("Vidljivost se nije mogla promijeniti.");
    }
  };

  const movePartner = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= partners.length) return;
    const reordered = [...partners];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setPartners(reordered);
    try {
      setPartners(await reorderFooterPartners(reordered.map(({ id }) => id)));
    } catch (error) {
      console.error(error);
      await loadPartners();
      notifyFailure("Redoslijed se nije mogao spremiti.");
    }
  };

  const removePartner = async (partner: FooterPartnerData) => {
    if (!window.confirm(`Želiš li izbrisati partnera “${partner.name}”?`)) return;
    try {
      await deleteFooterPartner(partner.id);
      setPartners((current) => current.filter(({ id }) => id !== partner.id));
      if (editingId === partner.id) closeForm();
      notifySuccess("Partner je izbrisan.");
    } catch (error) {
      console.error(error);
      notifyFailure("Partner se nije mogao izbrisati.");
    }
  };

  return (
    <div className="footer-partners-editor">
      <div className="footer-partners-editor__header">
        <div>
          <h2>Partneri u footeru</h2>
          <p>Uredi logotipe, poveznice, vidljivost i redoslijed partnera.</p>
        </div>
        <Button adminPrimary onClick={() => {
          setEditingId(null);
          setDraft(emptyDraft);
          setIsAdding(true);
        }}>
          <Plus size={20} /> dodaj partnera
        </Button>
      </div>

      {(isAdding || editingId !== null) && (
        <div
          className="footer-partner-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) closeForm();
          }}
        >
          <form
            className="footer-partner-form"
            onSubmit={savePartner}
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-partner-dialog-title"
          >
            <div className="footer-partner-form__title">
              <h3 id="footer-partner-dialog-title">{isAdding ? "Novi partner" : "Uredi partnera"}</h3>
              <button type="button" onClick={closeForm} disabled={isSaving} aria-label="Zatvori obrazac"><X size={22} /></button>
            </div>
            <div className="footer-partner-form__fields">
              <label>Naziv<input autoFocus required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label>URL logotipa<input required type="url" placeholder="https://..." value={draft.image_url} onChange={(event) => setDraft({ ...draft, image_url: event.target.value })} /></label>
              <label>URL poveznice<input required type="url" placeholder="https://..." value={draft.target_url} onChange={(event) => setDraft({ ...draft, target_url: event.target.value })} /></label>
            </div>
            {draft.image_url && <div className="footer-partner-form__preview"><span>Pregled</span><img src={draft.image_url} alt="Pregled logotipa" /></div>}
            <div className="footer-partner-form__actions">
              <Button adminPrimary type="submit" disabled={isSaving}>{isSaving ? "spremanje..." : "spremi"}</Button>
              <Button white onClick={closeForm} disabled={isSaving}>odustani</Button>
            </div>
          </form>
        </div>
      )}

      <div className="footer-partners-editor__toolbar">
        <input type="search" placeholder="Pretraži partnere..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <span>{visiblePartners.length} od {partners.length}</span>
      </div>

      <div className="footer-partners-list">
        {visiblePartners.map((partner) => {
          const index = partners.findIndex(({ id }) => id === partner.id);
          return (
            <article className={`footer-partner-row ${partner.is_active ? "" : "is-inactive"}`} key={partner.id}>
              <div className="footer-partner-row__order">
                <button disabled={index === 0 || Boolean(search)} onClick={() => movePartner(index, -1)} aria-label={`Pomakni ${partner.name} gore`}><CaretUp /></button>
                <button disabled={index === partners.length - 1 || Boolean(search)} onClick={() => movePartner(index, 1)} aria-label={`Pomakni ${partner.name} dolje`}><CaretDown /></button>
              </div>
              <div className="footer-partner-row__logo"><img src={partner.image_url} alt={`${partner.name} logo`} /></div>
              <div className="footer-partner-row__details"><strong>{partner.name}</strong><a href={partner.target_url} target="_blank" rel="noopener noreferrer">{partner.target_url}</a></div>
              <label className="footer-partner-row__visibility"><input type="checkbox" checked={partner.is_active} onChange={() => togglePartner(partner)} /><span>{partner.is_active ? "Prikazan" : "Skriven"}</span></label>
              <div className="footer-partner-row__actions">
                <button onClick={() => openEdit(partner)} aria-label={`Uredi ${partner.name}`}><PencilSimpleLine /></button>
                <button className="delete" onClick={() => removePartner(partner)} aria-label={`Izbriši ${partner.name}`}><Trash /></button>
              </div>
            </article>
          );
        })}
        {visiblePartners.length === 0 && <p className="footer-partners-list__empty">Nema partnera koji odgovaraju pretraživanju.</p>}
      </div>
    </div>
  );
};

export default EditFooterPartners;
