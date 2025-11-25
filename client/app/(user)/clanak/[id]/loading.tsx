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
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);
      setCurrentTip(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="article-loading-container">
      <div className="article-loading-content">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <div className="loading-spinner-inner"></div>
        </div>
        <h2>Učitavanje članka...</h2>
        <p>Molimo pričekajte</p>

        {showTip && (
          <div className="loading-tip">
            <span className="tip-icon">💡</span>
            <p>{currentTip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
