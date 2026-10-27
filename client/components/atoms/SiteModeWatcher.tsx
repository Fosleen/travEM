"use client";

import { useEffect } from "react";

export default function SiteModeWatcher() {
  useEffect(() => {
    let pending = false;
    const controller = new AbortController();

    const check = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch("/api/site-mode", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const { mode } = await response.json();
        if (mode !== "normal" && mode !== "maintenance") return;
        const showingMaintenance = Boolean(
          document.querySelector('[data-site-mode="maintenance"]')
        );
        if ((mode === "maintenance") !== showingMaintenance) {
          // Reload the original URL so middleware can apply/remove maintenance.
          window.location.reload();
        }
      } catch {
        // A temporary connection failure must not reload the page.
      } finally {
        pending = false;
      }
    };

    const timer = window.setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return null;
}
