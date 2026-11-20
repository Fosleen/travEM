// Local process notification. Durable campaign state remains in SQL.
// API/scheduler and worker must be enabled in the same backend process.
const listeners = new Set();

export function onNewsletterWork(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyNewsletterWork() {
  for (const listener of listeners) listener();
}
