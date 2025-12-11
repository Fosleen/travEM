"use client";

import "./loading.scss";
import { useEffect, useState } from "react";

const funFacts = [
  "TravEM piše o destinacijama koje smo osobno posjetili i istražili!",
  "Naš tim je do sada posjetio preko 50 zemalja širom svijeta.",
  "Svaki članak prolazi kroz ručnu provjeru kvalitete i točnosti informacija.",
  "Savjet: Spremite zanimljive članke u favorite za lakši pristup!",
  "Znate li? Naši water sports članci sadrže sve potrebne informacije za sigurno uživanje.",
  "TravEM zajednica broji tisuće putnika koji dijele svoja iskustva.",
  "Pratite nas na društvenim mrežama za dnevne travel savjete!",
];

export default function Loading() {
  const TIP_INTERVAL = 4000;
  const FIRST_TIP_DELAY = 5000;

  const [currentTipIndex, setCurrentTipIndex] = useState<number | null>(null);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setCurrentTipIndex(0);
    }, FIRST_TIP_DELAY);

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => {
        if (prev === null) return null;
        return (prev + 1) % funFacts.length;
      });
    }, TIP_INTERVAL);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <div className="loading-spinner-inner"></div>
        </div>

        <h2>Učitavanje...</h2>
        <p>Molimo pričekajte</p>

        {currentTipIndex !== null && (
          <div className="loading-tip">
            <span className="tip-icon">💡</span>
            <p>{funFacts[currentTipIndex]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
