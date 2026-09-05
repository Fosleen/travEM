"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import AirplaneTicketsHero from "@/components/user/atoms/AirplaneTicketsHero/AirplaneTicketsHero";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { HoneymoonProgram, submitHoneymoonInquiry } from "@/utils/honeymoon";
import { isBasicValidEmail, normalizeEmail } from "@/utils/email";
import "./HoneymoonPlanning.scss";

const OPEN = "open";
const emptyForm = { first_name: "", last_name: "", email: "", phone: "", approximate_date: "", traveler_count: "2", estimated_budget: "", preferred_destinations: "", departure_airport: "", message: "", selection: "", website: "", privacy_accepted: false };
const isPlausibleName = (value: string) => {
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || !/^[\p{L}][\p{L}\p{M}'’ -]*[\p{L}\p{M}]$/u.test(name) || /(.)\1\1/iu.test(name)) return false;
  const compact = name.normalize("NFD").replace(/[\u0300-\u036f'’ -]/g, "").toLowerCase();
  if (/(?:asdf|qwer|zxcv|dfgdfg|abcabc|testtest)/.test(compact)) return false;
  return compact.length <= 3 || /[aeiouy]/.test(compact);
};
const hasGibberishEmailLocalPart = (email: string) => {
  const localPart = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return /^(.{2,5})\1{1,}$/.test(localPart) || /(.)\1{3,}/.test(localPart) || /(?:asdf|qwer|zxcv|dfgdfg|abcabc|testtest)/.test(localPart);
};

export default function HoneymoonPlanning({ initialPrograms, heroImageUrl }: { initialPrograms: HoneymoonProgram[]; heroImageUrl: string }) {
  const [form, setForm] = useState(emptyForm);
  const [slide, setSlide] = useState(0);
  const [invalidImages, setInvalidImages] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const selected = useMemo(() => initialPrograms.find((program) => String(program.id) === form.selection), [form.selection, initialPrograms]);
  const isOpenInquiry = form.selection === OPEN;
  const images = (selected?.images || []).filter((image) => !invalidImages.includes(image.image_url));
  const update = (name: string, value: string | boolean) => setForm((current) => ({ ...current, [name]: value }));
  const chooseProgram = (value: string) => {
    setForm((current) => ({ ...current, selection: value, preferred_destinations: value === OPEN ? current.preferred_destinations : "" }));
    setSlide(0); setInvalidImages([]);
  };
  const changeSlide = (direction: "next" | "previous") => {
    if (images.length < 2) return;
    setSlide((current) => direction === "next" ? Math.min(current + 1, images.length - 1) : Math.max(current - 1, 0));
  };
  const goToSlide = (index: number) => {
    if (index === slide) return;
    setSlide(index);
  };
  const handleTouchEnd = (endX: number) => {
    if (touchStartX.current === null) return;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 45) return;
    changeSlide(distance < 0 ? "next" : "previous");
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    const email = normalizeEmail(form.email);
    if (!isPlausibleName(form.first_name) || (form.last_name.trim() && !isPlausibleName(form.last_name))) {
      notifyFailure("Unesite ispravno ime i prezime, ako ga navodite."); return;
    }
    if (!isBasicValidEmail(email) || hasGibberishEmailLocalPart(email)) {
      notifyFailure("Unesite ispravnu email adresu."); return;
    }
    if (!form.selection || Number(form.traveler_count) < 1) {
      notifyFailure("Ispunite sva obavezna polja."); return;
    }
    if (!form.privacy_accepted) { notifyFailure("Potvrdite da ste pročitali pravila privatnosti."); return; }
    setSending(true);
    try {
      await submitHoneymoonInquiry({ ...form, email, program_id: selected?.id || null });
      setForm(emptyForm); setSlide(0);
      notifySuccess("Hvala! Vaš upit je uspješno poslan. Javit ćemo vam se uskoro.", 4000);
    } catch (error) {
      notifyFailure(error instanceof Error ? error.message : "Upit nije moguće poslati.");
    } finally { setSending(false); }
  }

  return (
    <main className="honeymoon-page">
      <AirplaneTicketsHero imageUrl={heroImageUrl} title="Planiranje medenog mjeseca" subtitle="Vaše želje, naše iskustvo i putovanje koje ćemo osmisliti baš za vas." />

      <section className="honeymoon-content">
        <div className="honeymoon-intro">
          <span className="honeymoon-eyebrow">PUTOVANJE KROJENO ZA VAS</span>
          <h2>Vaš medeni mjesec počinje dobrom pričom</h2>
          <p>Ne prodajemo gotova putovanja. Ideje putovanja u izborniku služe kao inspiracija, a svaki prijedlog prilagođavamo vašim potrebama i željama.</p>
        </div>

        <form className="honeymoon-form" onSubmit={submit} noValidate>
          <label className="honeymoon-full">Inspiracija za medeni mjesec *
            <select value={form.selection} onChange={(e) => chooseProgram(e.target.value)} required>
              <option value="" disabled>Odaberite ideju putovanja ili slobodan upit</option>
              {initialPrograms.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
              <option value={OPEN}>Složimo vaš medeni mjesec zajedno - slobodan upit</option>
            </select>
          </label>

          {form.selection && <div className="honeymoon-form-context honeymoon-full">
            <span>{isOpenInquiry ? "SLOBODAN UPIT" : "ODABRANA INSPIRACIJA"}</span>
            <h3>{isOpenInquiry ? "Složimo vaš medeni mjesec od početka" : `Izradimo vaš osobni plan: ${selected?.name || ""}`}</h3>
            <p>{isOpenInquiry ? "Opišite nam svoje ideje, želje i destinacije koje vas privlače." : "Recite nam kada želite putovati i što biste željeli doživjeti na odabranoj destinaciji."}</p>
          </div>}

          {selected && <div className="honeymoon-program honeymoon-full">
            {images.length > 0 && <div className="honeymoon-carousel" role="region" aria-label={`Fotografije ideje putovanja ${selected.name}`} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") changeSlide("previous"); if (event.key === "ArrowRight") changeSlide("next"); }} onTouchStart={(event) => { touchStartX.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}>
              <div className="honeymoon-carousel-track" style={{ transform: `translate3d(-${slide * 100}%, 0, 0)` }}>
                {images.map((image, index) => <div className="honeymoon-carousel-slide" key={image.image_url}><img src={image.image_url} alt={`${selected.name} – inspiracija ${index + 1}`} draggable={false} onError={() => { setInvalidImages((current) => current.includes(image.image_url) ? current : [...current, image.image_url]); setSlide(0); }} /></div>)}
              </div>
              {images.length > 1 && <>{slide > 0 && <button className="honeymoon-carousel-arrow honeymoon-carousel-arrow-previous" type="button" aria-label="Prethodna fotografija" onClick={() => changeSlide("previous")}><CaretLeft size={23} weight="bold" /></button>}{slide < images.length - 1 && <button className="honeymoon-carousel-arrow honeymoon-carousel-arrow-next" type="button" aria-label="Sljedeća fotografija" onClick={() => changeSlide("next")}><CaretRight size={23} weight="bold" /></button>}<div className="honeymoon-carousel-dots" aria-label={`Fotografija ${slide + 1} od ${images.length}`}>{images.map((image, index) => <button key={image.image_url} type="button" className={index === slide ? "active" : ""} aria-label={`Prikaži fotografiju ${index + 1}`} aria-current={index === slide ? "true" : undefined} onClick={() => goToSlide(index)} />)}</div><span className="honeymoon-carousel-count" aria-live="polite">{slide + 1} / {images.length}</span></>}
            </div>}
            <div className="honeymoon-program-details">
              <p className="honeymoon-program-description">{selected.description}</p>
              <dl>
                {selected.destination && <div><dt>Destinacija</dt><dd>{selected.destination}</dd></div>}
                {selected.duration && <div><dt>Optimalno trajanje</dt><dd>{selected.duration}</dd></div>}
                {selected.price_from && <div><dt>Procijenjeni troškovi putovanja</dt><dd>Od {Number(selected.price_from).toLocaleString("hr-HR")} € <span className="honeymoon-price-note">bez naknade za planiranje</span></dd></div>}
              </dl>
            </div>
          </div>}

          <label>Ime *<input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} maxLength={80} required /></label>
          <label>Prezime<input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} maxLength={80} /></label>
          <label>Email *<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={200} required /></label>
          <label>Telefon<input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={50} /></label>
          <label>{isOpenInquiry ? "Kada biste željeli putovati?" : "Željeni datum putovanja"}<input type="date" value={form.approximate_date} onChange={(e) => update("approximate_date", e.target.value)} /></label>
          <label>Broj putnika *<input type="number" min="1" max="100" value={form.traveler_count} onChange={(e) => update("traveler_count", e.target.value)} required /></label>
          <label>{isOpenInquiry ? "Okvirni budžet" : "Okvirni budžet za troškove putovanja"}<input value={form.estimated_budget} onChange={(e) => update("estimated_budget", e.target.value)} maxLength={100} placeholder="npr. 5.000 €" /></label>
          {isOpenInquiry && <label>Željene destinacije<input value={form.preferred_destinations} onChange={(e) => update("preferred_destinations", e.target.value)} maxLength={500} placeholder="npr. Japan, Bali ili destinacija uz ocean" /></label>}
          <label className="honeymoon-full">Polazište<input value={form.departure_airport} onChange={(e) => update("departure_airport", e.target.value)} maxLength={160} placeholder="Grad ili željeni polazni aerodrom" /></label>
          <label className="honeymoon-full">{isOpenInquiry ? "Kako zamišljate svoj medeni mjesec?" : "Što biste željeli doživjeti na ovom putovanju?"}<textarea rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={3000} placeholder={isOpenInquiry ? "Opišite nam atmosferu, tempo putovanja i doživljaje koje priželjkujete..." : "Opišite nam iskustva, aktivnosti i posebne trenutke koje biste željeli uključiti u svoj medeni mjesec..."} /></label>
          <label className="honeymoon-honeypot" aria-hidden="true">Web stranica<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label>
          <label className="honeymoon-consent honeymoon-full"><input type="checkbox" checked={form.privacy_accepted} onChange={(e) => update("privacy_accepted", e.target.checked)} /> <span>Pročitao/la sam <Link href="/pravila-o-privatnosti" target="_blank">Pravila privatnosti</Link> i upoznat/a sam s obradom podataka potrebnom za odgovor na moj upit. *</span></label>
          <div className="honeymoon-service-note honeymoon-full">
            <strong>Kako funkcionira naša usluga?</strong>
            <p>putujEM s travEM pruža uslugu savjetovanja, istraživanja i izrade prijedloga putovanja. Ne prodajemo paket-aranžmane i ne sklapamo rezervacije u vaše ime. Sve usluge putovanja odabirete, ugovarate i plaćate izravno pojedinačnim pružateljima.</p>
            <p>Prikazani iznosi procjena su troškova putovanja bez naše naknade. Stvarni troškovi ovise o vašim potrebama i željama, dostupnosti te cijenama pružatelja u trenutku rezervacije. Naša naknada odnosi se isključivo na planiranje i organizacijsku podršku, a određuje se prema složenosti i vremenu potrebnom za pripremu. O njezinu iznosu obavijestit ćemo vas prije početka pružanja usluge.</p>
          </div>
          <div className="honeymoon-submit honeymoon-full"><button type="submit" disabled={sending || !form.privacy_accepted}>{sending ? "Šaljemo..." : isOpenInquiry ? "Pošaljite slobodan upit" : "Zatražite uslugu planiranja"}</button></div>
        </form>
      </section>
    </main>
  );
}
