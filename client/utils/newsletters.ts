import { apiUrl } from './api';

export type NewsletterStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'uncertain' | 'skipped';
export type NewsletterCampaign = {
  id: number; source: string; status: string; created_at: string; completed_at: string | null;
  next_attempt_at: string | null; total: number; counts: Partial<Record<NewsletterStatus, number>>;
};
export type NewsletterOverview = {
  enabled: boolean; canSend: boolean; workerEnabled?: boolean; campaigns: NewsletterCampaign[];
};
export type NewsletterRecipient = {
  id: number; email: string; status: NewsletterStatus; attempts: number;
  sent_at: string | null; last_attempt_at: string | null; next_attempt_at: string;
  last_error: string | null;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${apiUrl}/admin/newsletters${path}`, {
    ...init, cache: 'no-store', headers: {
      Accept: 'application/json', Authorization: token ? `Bearer ${token}` : '', ...init.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Pregled newslettera nije dostupan.');
  }
  return response.json();
}

export const newsletterApi = {
  overview: (articleId: string, signal?: AbortSignal) => request<NewsletterOverview>(`/articles/${articleId}`, { signal }),
  recipients: (articleId: string, campaignId: number, page: number, status: string, search: string, signal?: AbortSignal) =>
    request<{ data: NewsletterRecipient[]; total: number; page: number; pageSize: number }>(
      `/articles/${articleId}/campaigns/${campaignId}/recipients?${new URLSearchParams({ page: String(page), status, search })}`, { signal }),
  start: (articleId: string, key: string) => request<{ campaignId: number }>(`/articles/${articleId}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request_key: key }),
  }),
  retry: (articleId: string, campaignId: number) => request<{ retried: number }>(
    `/articles/${articleId}/campaigns/${campaignId}/retry`, { method: 'POST' }),
};
