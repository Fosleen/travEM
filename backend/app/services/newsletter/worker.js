// Runs only while campaigns remain active; an empty queue leaves no polling timer.
export function createNewsletterWorker({ queue, subscribe, schedule = setTimeout,
  cancel = clearTimeout, onError = (error) => console.error('Newsletter worker failed:', error.message),
}) {
  let timer = null;
  let running = false;
  let requested = false;
  let started = false;
  let stopped = false;
  let unsubscribe;

  function arm(delay) {
    if (timer !== null) cancel(timer);
    timer = schedule(() => { timer = null; void tick(); }, delay);
    timer?.unref?.();
  }

  function wake() {
    if (stopped) return;
    if (running) { requested = true; return; }
    arm(0);
  }

  async function tick() {
    if (stopped || running) return;
    running = true;
    requested = false;
    let remaining = false;
    try {
      // One recovery read at startup. An empty queue leaves no timer running.
      if (!await queue.hasWork()) return;
      for (let i = 0; i < 50; i++) {
        if (stopped || !await queue.dispatchOne()) break;
      }
      remaining = await queue.hasWork();
    } catch (error) {
      // Unknown DB state is not completion: retain recovery/retry behavior.
      remaining = true;
      onError(error);
    } finally {
      running = false;
      if (!stopped && (requested || remaining)) arm(requested ? 0 : 30000);
    }
  }

  return {
    start() {
      if (started || stopped) return;
      started = true;
      unsubscribe = subscribe(wake);
      wake();
    },
    wake,
    stop() {
      stopped = true;
      if (timer !== null) cancel(timer);
      timer = null;
      unsubscribe?.();
    },
  };
}
