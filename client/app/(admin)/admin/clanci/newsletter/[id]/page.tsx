'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  ArrowClockwise, ArrowLeft, ArrowUpRight, CaretDown, CaretLeft, CaretRight,
  Check, CheckCircle, Clock, Copy, EnvelopeSimple, Info, LockKey,
  MagnifyingGlass, MinusCircle, PaperPlaneTilt, Question, UsersThree, WarningCircle, X,
} from '@phosphor-icons/react';
import { newsletterApi, type NewsletterOverview, type NewsletterRecipient, type NewsletterStatus } from '@/utils/newsletters';
import { useDashboardUser } from '@/context/DashboardUserContext';
import './NewsletterDetails.scss';

const labels: Record<NewsletterStatus, string> = {
  pending: 'Čeka slanje', sending: 'Slanje u tijeku', sent: 'Poslano',
  failed: 'Neuspjelo', uncertain: 'Neizvjesno', skipped: 'Preskočeno',
};
const campaignLabels: Record<string, string> = {
  queued: 'U redu slanja', sending: 'Obrada u tijeku', completed: 'Završeno', completed_with_errors: 'Završeno s greškama',
};
const statusIcons = {
  pending: Clock, sending: PaperPlaneTilt, sent: CheckCircle,
  failed: WarningCircle, uncertain: Question, skipped: MinusCircle,
};
const statusOrder: NewsletterStatus[] = ['sent', 'pending', 'sending', 'failed', 'uncertain', 'skipped'];
const confirmAction = async (title: string, text: string, confirmButtonText: string) => {
  const result = await Swal.fire({
    title, text, icon: 'question', showCancelButton: true, confirmButtonText,
    cancelButtonText: 'Odustani', reverseButtons: true, focusCancel: true,
    buttonsStyling: false,
    customClass: { popup: 'newsletter-confirm', confirmButton: 'newsletter-confirm-primary', cancelButton: 'newsletter-confirm-secondary' },
  });
  return result.isConfirmed;
};
const dateFormatter = new Intl.DateTimeFormat('hr-HR', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Zagreb',
});
const formatTime = (value?: string | null) => value ? dateFormatter.format(new Date(value)) : '-';

export default function NewsletterDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useDashboardUser();
  const [overviewResult, setOverviewResult] = useState<{
    articleId: string; data: NewsletterOverview | null; error: string; revision: number; updatedAt: string;
  } | null>(null);
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const [recipientResult, setRecipientResult] = useState<{
    key: string; data: NewsletterRecipient[]; total: number; error: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyAction, setBusyAction] = useState<'start' | 'retry' | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState('');
  const [refresh, setRefresh] = useState(0);
  const requestKey = useRef<string | null>(null);
  const overview = overviewResult?.articleId === id ? overviewResult.data : null;
  const recipientKey = JSON.stringify([id, campaignId, page, status, query]);
  const currentRecipients = recipientResult?.key === recipientKey ? recipientResult : null;
  const recipients = currentRecipients?.data || [];
  const total = currentRecipients?.total || 0;
  const loadingRecipients = Boolean(campaignId) && !currentRecipients;
  const error = (overviewResult?.articleId === id && overviewResult.error) || currentRecipients?.error || actionError;
  const canSend = Boolean(overview?.canSend && overview.workerEnabled);
  const busy = busyAction !== null;
  const refreshing = !overviewResult || overviewResult.articleId !== id || overviewResult.revision !== refresh;

  useEffect(() => {
    const timer = setTimeout(() => { setQuery(search); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!isAdmin) return;
    const controller = new AbortController();
    newsletterApi.overview(id, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setOverviewResult({ articleId: id, data: result, error: '', revision: refresh, updatedAt: new Date().toISOString() });
      setCampaignId((current) => current && result.campaigns.some((c) => c.id === current) ? current : result.campaigns[0]?.id ?? null);
    }).catch((failure: Error) => {
      if (!controller.signal.aborted) setOverviewResult({ articleId: id, data: null, error: failure.message, revision: refresh, updatedAt: '' });
    });
    return () => controller.abort();
  }, [id, isAdmin, refresh]);

  useEffect(() => {
    if (!isAdmin || !campaignId) return;
    const controller = new AbortController();
    newsletterApi.recipients(id, campaignId, page, status, query, controller.signal).then((result) => {
      if (!controller.signal.aborted) setRecipientResult({ key: recipientKey, data: result.data, total: result.total, error: '' });
    }).catch((failure: Error) => {
      if (!controller.signal.aborted) setRecipientResult({ key: recipientKey, data: [], total: 0, error: failure.message });
    });
    return () => controller.abort();
  }, [id, isAdmin, campaignId, page, status, query, refresh, recipientKey]);

  const hasActive = overview?.campaigns.some((c) => ['queued', 'sending'].includes(c.status));
  useEffect(() => {
    if (!hasActive) return;
    const timer = setInterval(() => setRefresh((value) => value + 1), 10000);
    return () => clearInterval(timer);
  }, [hasActive]);

  useEffect(() => {
    if (!copiedEmail) return;
    const timer = setTimeout(() => setCopiedEmail(''), 2000);
    return () => clearTimeout(timer);
  }, [copiedEmail]);

  const runAction = useCallback(async (kind: 'start' | 'retry', action: () => Promise<string>) => {
    setBusyAction(kind); setActionError(''); setSuccessMessage('');
    try { setSuccessMessage(await action()); setRefresh((value) => value + 1); }
    catch (failure) { setActionError(failure instanceof Error ? failure.message : 'Radnja nije uspjela.'); }
    finally { setBusyAction(null); }
  }, []);

  const campaign = overview?.campaigns.find((item) => item.id === campaignId);
  const sent = campaign?.counts.sent || 0;
  const progress = campaign?.total ? Math.round(sent / campaign.total * 100) : 0;
  const failed = campaign?.counts.failed || 0;
  const waiting = Boolean(campaign?.next_attempt_at && new Date(campaign.next_attempt_at).getTime() > Date.now());
  const pages = Math.max(1, Math.ceil(total / 25));
  const selectStatus = (value: string) => { setStatus(value); setPage(1); };
  const resetFilters = () => { setSearch(''); setQuery(''); setStatus(''); setPage(1); };
  const startCampaign = async () => {
    if (!await confirmAction('Pokrenuti novo slanje?', 'Newsletter će biti poslan svim trenutačnim pretplatnicima. Oni koji su ga već primili dobit će ga ponovno.', 'Da, pokreni slanje')) return;
    await runAction('start', async () => {
      requestKey.current ||= crypto.randomUUID();
      const result = await newsletterApi.start(id, requestKey.current);
      requestKey.current = null; setCampaignId(result.campaignId); setPage(1);
      return `Slanje #${result.campaignId} dodano je u red. Napredak možeš pratiti ovdje.`;
    });
  };
  const retryCampaign = async () => {
    if (!campaign || !await confirmAction('Ponoviti neuspjele poruke?', 'Ponovno ćemo pokušati poslati samo neuspjele poruke. Poslane, preskočene i neizvjesne poruke ne šalju se ponovno.', 'Da, ponovi neuspjele')) return;
    await runAction('retry', async () => {
      const result = await newsletterApi.retry(id, campaign.id);
      return result.retried ? `${result.retried} poruka ponovno je dodano u red slanja.` : 'Nema neuspjelih poruka za ponovno slanje.';
    });
  };

  if (!isAdmin) return <div className="newsletter-details"><div className="newsletter-empty"><LockKey size={36} aria-hidden="true" /><h1>Administratorski pristup</h1><p>Za pregled newslettera prijavi se kao administrator.</p></div></div>;
  return <main className="newsletter-details">
    <span className="newsletter-sr-only" role="status">{copiedEmail ? `Kopirana adresa ${copiedEmail}` : ''}</span>
    <nav className="newsletter-breadcrumb" aria-label="Putanja stranice">
      <Link href="/admin/clanci"><ArrowLeft size={16} aria-hidden="true" />Članci</Link><span>/</span><span>Newsletter</span>
    </nav>
    <header className="newsletter-heading">
      <div className="newsletter-heading-main">
        <span className="newsletter-heading-icon"><EnvelopeSimple size={30} weight="duotone" aria-hidden="true" /></span>
        <div><span className="newsletter-eyebrow">PUTUJEM S TRAVEM · ADMINISTRACIJA</span><h1>Newsletter</h1><p>Pregled slanja i primatelja za članak <strong>#{id}</strong>.</p></div>
      </div>
      <div className="newsletter-heading-actions">
        <Link className="newsletter-button newsletter-button-secondary" href={`/admin/clanci/uredi/${id}`}>Otvori članak<ArrowUpRight size={17} aria-hidden="true" /></Link>
        <button className="newsletter-button newsletter-button-secondary" type="button" disabled={refreshing || busy} onClick={() => setRefresh((value) => value + 1)} aria-label={refreshing ? 'Osvježavanje pregleda' : 'Osvježi pregled'}>
          <ArrowClockwise size={17} className={refreshing ? 'newsletter-spin' : ''} aria-hidden="true" />Osvježi
        </button>
      </div>
    </header>
    {error && <div role="alert" className="newsletter-notice newsletter-notice-error"><WarningCircle size={22} aria-hidden="true" /><div><strong>Pregledaj poruku i pokušaj ponovno</strong><p>{error}</p></div></div>}
    {successMessage && <div role="status" className="newsletter-notice newsletter-notice-success"><CheckCircle size={22} aria-hidden="true" /><p>{successMessage}</p></div>}
    {!overview && !error && <div className="newsletter-empty" role="status"><ArrowClockwise className="newsletter-spin" size={28} aria-hidden="true" /><h2>Učitavamo pregled slanja</h2><p>Još samo trenutak...</p></div>}
    {overview && !overview.enabled && <div className="newsletter-empty"><EnvelopeSimple size={40} weight="duotone" aria-hidden="true" /><h2>Evidencija još nije uključena</h2><p>Postojeća slanja preko Lambde nastavljaju se prema produkcijskoj konfiguraciji.</p></div>}
    {overview?.enabled && <>
      {!canSend && <div className="newsletter-notice newsletter-notice-info"><LockKey size={21} aria-hidden="true" /><p>{!overview.canSend ? 'Ovaj pregled je samo za čitanje. Slanje je isključeno u ovom okruženju.' : 'Slanje trenutačno nije dostupno. Za pokretanje treba uključiti obradu newslettera na backendu.'}</p></div>}
      <section className="newsletter-campaign-bar" aria-label="Odabir slanja">
        {overview.campaigns.length > 0 ? <label className="newsletter-campaign-select"><span className="newsletter-label">POVIJEST SLANJA</span>
          <span className="newsletter-select-wrap"><select aria-label="Odaberi slanje" value={campaignId ?? ''} onChange={(event) => { setCampaignId(Number(event.target.value)); setPage(1); }}>
            {overview.campaigns.map((item) => <option key={item.id} value={item.id}>Slanje #{item.id} · {formatTime(item.created_at)} · {campaignLabels[item.status] || item.status}</option>)}
          </select><CaretDown size={16} aria-hidden="true" /></span>
        </label> : <div><span className="newsletter-label">POVIJEST SLANJA</span><p>Za ovaj članak još nema zabilježenih slanja.</p></div>}
        <div className="newsletter-campaign-bar-actions">
          {hasActive && <span className="newsletter-live"><span />Praćenje uživo</span>}
          <button className="newsletter-button newsletter-button-primary" type="button" disabled={busy || !canSend || Boolean(hasActive)} onClick={() => void startCampaign()} title={hasActive ? 'Pričekaj završetak aktivnog slanja.' : !canSend ? 'Slanje je isključeno u ovom okruženju.' : 'Pokreni novu kampanju za sve pretplatnike.'}>
            {busyAction === 'start' ? <ArrowClockwise className="newsletter-spin" size={18} aria-hidden="true" /> : <PaperPlaneTilt size={18} aria-hidden="true" />}{busyAction === 'start' ? 'Pokretanje...' : 'Novo slanje'}
          </button>
        </div>
      </section>
      {!overview.campaigns.length && <div className="newsletter-empty"><EnvelopeSimple size={44} weight="duotone" aria-hidden="true" /><h2>Još nema zabilježenih slanja</h2><p>Kad pokreneš newsletter, ovdje ćeš vidjeti njegov napredak i status svake poruke. Starija slanja preko Lambde nisu dio ove evidencije.</p></div>}
      {campaign && <>
        <section className="newsletter-progress-panel" aria-label="Napredak slanja">
          <div className="newsletter-progress-heading"><div><span className="newsletter-eyebrow">SLANJE #{campaign.id}</span><h2>Napredak slanja</h2></div><span className={`newsletter-campaign-status newsletter-campaign-status-${campaign.status}`}><span />{waiting ? 'Čeka nastavak' : campaignLabels[campaign.status] || campaign.status}</span></div>
          <div className="newsletter-progress-value"><p><strong>{sent.toLocaleString('hr-HR')}</strong><span> / {campaign.total.toLocaleString('hr-HR')} poruka poslano</span></p><strong>{progress}%</strong></div>
          <div className="newsletter-progress-track" role="progressbar" aria-label="Uspješno poslane poruke" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
          <dl className="newsletter-metadata"><div><dt>Pokrenuto</dt><dd>{formatTime(campaign.created_at)}</dd></div><div><dt>Način pokretanja</dt><dd>{campaign.source === 'scheduled' ? 'Zakazana objava' : 'Ručno pokretanje'}</dd></div>{campaign.completed_at && <div><dt>Završeno</dt><dd>{formatTime(campaign.completed_at)}</dd></div>}</dl>
        </section>
        <div className="newsletter-stats" aria-label="Filtriraj primatelje prema statusu">
          <button type="button" className="newsletter-stat newsletter-stat-total" aria-pressed={!status} onClick={() => selectStatus('')}><span className="newsletter-stat-icon"><UsersThree size={22} aria-hidden="true" /></span><span><span className="newsletter-stat-label">Svi primatelji</span><strong>{campaign.total.toLocaleString('hr-HR')}</strong></span><ArrowUpRight size={17} className="newsletter-stat-arrow" aria-hidden="true" /></button>
          {statusOrder.map((key) => { const Icon = statusIcons[key]; return <button key={key} type="button" className={`newsletter-stat newsletter-stat-${key}`} aria-pressed={status === key} onClick={() => selectStatus(status === key ? '' : key)} title={`Prikaži: ${labels[key].toLowerCase()}`}><span className="newsletter-stat-icon"><Icon size={21} aria-hidden="true" /></span><span><span className="newsletter-stat-label">{labels[key]}</span><strong>{(campaign.counts[key] || 0).toLocaleString('hr-HR')}</strong></span></button>; })}
        </div>
        {waiting && <div className="newsletter-notice newsletter-notice-info"><Clock size={23} aria-hidden="true" /><div><strong>Nastavak najranije {formatTime(campaign.next_attempt_at)}</strong><p>Preostale poruke čekaju sljedeći pokušaj. Vrijeme ovisi o raspoloživoj kvoti i drugim slanjima.</p></div></div>}
        {Boolean(campaign.counts.uncertain) && <div className="newsletter-notice newsletter-notice-warning"><Question size={23} aria-hidden="true" /><div><strong>Neke poruke imaju neizvjestan ishod</strong><p>Možda su već prihvaćene za slanje. Ne ponavljaju se automatski kako primatelji ne bi dobili duplikate.</p></div></div>}
        <section className="newsletter-recipients" aria-labelledby="newsletter-recipients-title">
          <div className="newsletter-section-heading"><div><span className="newsletter-eyebrow">STATUSI I DETALJI</span><h2 id="newsletter-recipients-title">Primatelji <span className="newsletter-count-badge">{campaign.total}</span></h2><p>Pretraži adresu ili odaberi status za detaljniji pregled.</p></div>
            {failed > 0 && <button className="newsletter-button newsletter-button-secondary" type="button" disabled={busy || !canSend} onClick={() => void retryCampaign()}><ArrowClockwise className={busyAction === 'retry' ? 'newsletter-spin' : ''} size={17} aria-hidden="true" />{busyAction === 'retry' ? 'Pokretanje...' : 'Ponovi neuspjele'}<span className="newsletter-button-count">{failed}</span></button>}
          </div>
          <div className="newsletter-filters">
            <label className="newsletter-search"><span className="newsletter-label">EMAIL ADRESA</span><span className="newsletter-search-wrap"><MagnifyingGlass size={19} aria-hidden="true" /><input type="search" placeholder="Pretraži email adresu..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" className="newsletter-icon-button" aria-label="Očisti pretragu" onClick={() => { setSearch(''); setQuery(''); setPage(1); }}><X size={16} aria-hidden="true" /></button>}</span></label>
            <label className="newsletter-status-select"><span className="newsletter-label">STATUS PORUKE</span><span className="newsletter-select-wrap"><select aria-label="Status poruke" value={status} onChange={(event) => selectStatus(event.target.value)}><option value="">Svi statusi</option>{statusOrder.map((key) => <option key={key} value={key}>{labels[key]}</option>)}</select><CaretDown size={16} aria-hidden="true" /></span></label>
            {(status || search) && <button className="newsletter-text-button" type="button" onClick={resetFilters}><X size={15} aria-hidden="true" />Očisti filtre</button>}
          </div>
          <div className="newsletter-table-scroll" tabIndex={0} aria-label="Tablica primatelja"><table aria-busy={loadingRecipients}>
            <thead><tr><th>Email adresa</th><th>Status</th><th>Pokušaji</th><th>Zadnji pokušaj</th><th>Poslano</th><th>Napomena</th></tr></thead>
            <tbody>{loadingRecipients && <tr><td colSpan={6} className="newsletter-table-message"><ArrowClockwise className="newsletter-spin" size={20} aria-hidden="true" />Učitavanje primatelja...</td></tr>}{recipients.map((recipient) => { const StatusIcon = statusIcons[recipient.status]; return <tr key={recipient.id}>
              <td><div className="newsletter-email-cell"><span className="newsletter-avatar" aria-hidden="true">{recipient.email.charAt(0).toUpperCase()}</span><span className="newsletter-email" title={recipient.email}>{recipient.email}</span><button type="button" className="newsletter-icon-button newsletter-copy" aria-label={`Kopiraj ${recipient.email}`} title={copiedEmail === recipient.email ? 'Kopirano!' : 'Kopiraj email adresu'} onClick={async () => { try { await navigator.clipboard.writeText(recipient.email); setCopiedEmail(recipient.email); } catch { setActionError('Kopiranje nije uspjelo. Adresu možeš označiti i kopirati ručno.'); } }}>{copiedEmail === recipient.email ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}</button></div></td>
              <td><span className={`newsletter-status newsletter-status-${recipient.status}`}><StatusIcon size={15} aria-hidden="true" />{labels[recipient.status]}</span></td><td className="newsletter-attempts">{recipient.attempts}</td><td className="newsletter-date">{formatTime(recipient.last_attempt_at)}</td><td className="newsletter-date">{formatTime(recipient.sent_at)}</td>
              <td>{recipient.last_error ? <details className="newsletter-error-detail"><summary>Prikaži razlog<CaretDown size={13} aria-hidden="true" /></summary><p>{recipient.last_error}</p></details> : <span className="newsletter-muted">-</span>}</td>
            </tr>; })}
            {!loadingRecipients && !currentRecipients?.error && !recipients.length && <tr><td colSpan={6} className="newsletter-table-message"><MagnifyingGlass size={24} aria-hidden="true" /><strong>Nema rezultata za odabrane filtre</strong><span>Pokušaj s drugom adresom ili statusom.</span>{(status || search) && <button type="button" className="newsletter-text-button" onClick={resetFilters}>Prikaži sve primatelje<ArrowUpRight size={16} aria-hidden="true" /></button>}</td></tr>}</tbody>
          </table></div>
          <nav aria-label="Stranice primatelja" className="newsletter-pagination"><span>{total ? (page - 1) * 25 + 1 : 0}–{Math.min(page * 25, total)} od <strong>{total}</strong> primatelja</span><div><button className="newsletter-button newsletter-button-secondary" type="button" disabled={loadingRecipients || page <= 1} onClick={() => setPage((value) => value - 1)}><CaretLeft size={16} aria-hidden="true" /><span>Prethodna</span></button><span className="newsletter-page-indicator">{page} <span>/ {pages}</span></span><button className="newsletter-button newsletter-button-secondary" type="button" disabled={loadingRecipients || page * 25 >= total} onClick={() => setPage((value) => value + 1)}><span>Sljedeća</span><CaretRight size={16} aria-hidden="true" /></button></div></nav>
        </section>
        <footer className="newsletter-footnote"><Info size={17} aria-hidden="true" /><p>„Poslano” znači da je server prihvatio poruku, ne potvrdu dostave u inbox ili čitanja. Sva vremena prikazana su za Zagreb.</p>{overviewResult?.updatedAt && <span>Zadnje osvježeno {formatTime(overviewResult.updatedAt)}</span>}</footer>
      </>}
    </>}
  </main>;
}
