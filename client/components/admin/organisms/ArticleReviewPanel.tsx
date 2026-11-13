"use client";
import { useState } from "react";
import { useFormikContext } from "formik";
import Button from "@/components/atoms/Button";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { useDashboardUser } from "@/context/DashboardUserContext";
import { formatDateTimeLocalInput, getBrowserTimeZone, zonedDateTimeLocalToUtcIso } from "@/utils/articleSchedule";
import { notifyFailure } from "@/components/atoms/Toast/Toast";
import { parseBooleanValue } from "@/utils/parseBooleanValue";

export default function ArticleReviewPanel({ article, onSave }: { article: any; onSave: (values: any, decision: object) => Promise<void> }) {
  const { isAdmin } = useDashboardUser();
  const { values, validateForm, setTouched } = useFormikContext<any>();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(() => parseBooleanValue(article.article_schedule?.notify_subscribers_on_publish));
  const originalDate = article.article_schedule?.publish_at;
  const expired = originalDate && new Date(originalDate).getTime() <= Date.now();
  const [timing, setTiming] = useState(expired ? "" : originalDate ? "later" : "now");
  const [date, setDate] = useState(originalDate ? formatDateTimeLocalInput(originalDate, getBrowserTimeZone()) : "");
  if (!article.review) return null;
  const decide = async (action: "approve" | "return") => {
    if (action === "return" && !note.trim()) { notifyFailure("Napišite napomenu za autora."); return; }
    const publishAt = timing === "later" ? zonedDateTimeLocalToUtcIso(date, getBrowserTimeZone()) : null;
    if (action === "approve" && (!timing || (timing === "later" && (!publishAt || new Date(publishAt).getTime() <= Date.now())))) {
      notifyFailure("Odaberite objavu odmah ili budući termin."); return;
    }
    const errors = await validateForm();
    if (Object.keys(errors).length) {
      await setTouched(Object.fromEntries(Object.keys(errors).map((key) => [key, true])));
      notifyFailure("Provjerite obavezna polja prije spremanja i odluke."); return;
    }
    setBusy(true);
    try { await onSave(values, {
      action, note, publish_at: publishAt,
      ...(action === "approve" ? { notify_subscribers_on_publish: notifySubscribers } : {}),
    }); }
    finally { setBusy(false); }
  };
  return <aside className="article-review-panel" role="note">
    <h3>{article.review.status === "approved" ? "Članak je odobren" : article.review.status === "changes_requested" ? "Vraćeno na doradu" : "Članak čeka pregled"}</h3>
    {article.review.note && <p><strong>Napomena administratora:</strong> {article.review.note}</p>}
    {!isAdmin && article.review.status !== "approved" && <p>Članak će biti javno dostupan nakon što ga administrator pregleda i odobri. Zakazani termin vrijedi tek nakon odobrenja.</p>}
    {isAdmin && article.review.status === "pending" && article.review.submitted_at && <>
      <p>Prije odluke spremit će se i izmjene iz ove forme.</p>
      {expired && <p>Zatraženi termin je prošao. Odaberite novi termin ili objavu odmah.</p>}
      <label>Objava nakon odobrenja <select value={timing} onChange={(event) => setTiming(event.target.value)}>
        <option value="">Odaberite termin</option><option value="now">Objavi odmah</option><option value="later">Zakaži objavu</option>
      </select></label>
      {timing === "later" && <label>Datum i vrijeme ({getBrowserTimeZone()}) <input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></label>}
      <fieldset className="article-review-newsletter" disabled={busy}>
        <ToggleSwitch
          name="review-notify-subscribers"
          description="Pošalji newsletter nakon objave"
          value={notifySubscribers}
          setter={setNotifySubscribers}
        />
      </fieldset>
      <p>Prikazan je autorov odabir. Pri odobravanju vrijedi vaša konačna odluka.</p>
      <label>Napomena za autora <textarea value={note} onChange={(event) => setNote(event.target.value)} /></label>
      <div><Button type="button" adminPrimary disabled={busy} onClick={() => void decide("approve")}>Spremi izmjene i odobri članak</Button>
      <Button type="button" white disabled={busy} onClick={() => void decide("return")}>Vrati na doradu</Button></div>
    </>}
    {isAdmin && article.review.status === "pending" && !article.review.submitted_at && <p>Autor još nije dovršio predaju članka.</p>}
  </aside>;
}
