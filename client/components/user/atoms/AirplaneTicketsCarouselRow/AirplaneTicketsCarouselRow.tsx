"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HorizontalPostItemBig from "../HorizontalPostItemBig/HorizontalPostItemBig";
import "./AirplaneTicketsCarouselRow.scss";

type Item = any;

type Props = {
  title: string;
  items: Item[];
};

export default function AirplaneTicketsCarouselRow({ title, items }: Props) {
  const data = useMemo(() => (items ?? []).slice(0, 6), [items]); // ✅ max 6
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const GAP = 16;
  const CLICK_CANCEL_PX = 6; // ako je drag veći od ovog, cancel click

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: 0,
  });

  const clickGuardRef = useRef({
    shouldCancelClick: false,
  });

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const getStepPx = () => {
    const v = viewportRef.current;
    if (!v) return 0;

    const w = v.clientWidth;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const itemW = isMobile ? w : (w - GAP) / 2;
    return itemW + GAP;
  };

  const updateArrows = () => {
    const v = viewportRef.current;
    if (!v) return;

    const maxScroll = v.scrollWidth - v.clientWidth;
    const left = v.scrollLeft;

    setCanLeft(left > 2);
    setCanRight(left < maxScroll - 2);
  };

  useEffect(() => {
    const v = viewportRef.current;
    if (!v) return;

    updateArrows();

    const onScroll = () => updateArrows();
    v.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(v);

    return () => {
      v.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [data.length]);

  const snapToNearest = () => {
    const v = viewportRef.current;
    if (!v) return;

    const step = getStepPx();
    if (!step) return;

    const idx = Math.round(v.scrollLeft / step);
    v.scrollTo({ left: idx * step, behavior: "smooth" });
  };

  const goLeft = () => {
    const v = viewportRef.current;
    if (!v) return;

    const step = getStepPx();
    v.scrollBy({ left: -step, behavior: "smooth" });
  };

  const goRight = () => {
    const v = viewportRef.current;
    if (!v) return;

    const step = getStepPx();
    v.scrollBy({ left: step, behavior: "smooth" });
  };

  // ✅ CAPTURE faza: hvata pointer prije nego Link/Image krenu u svoje
  const onPointerDownCapture = (e: React.PointerEvent) => {
    const v = viewportRef.current;
    if (!v) return;

    // bitno: spriječi native behavior (selection / image drag)
    e.preventDefault();

    dragRef.current.active = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.startX = e.clientX;
    dragRef.current.startScrollLeft = v.scrollLeft;
    dragRef.current.moved = 0;

    clickGuardRef.current.shouldCancelClick = false;

    setIsDragging(true);

    // ✅ pointer capture radi i kad izađeš iz elementa
    v.setPointerCapture(e.pointerId);
  };

  const onPointerMoveCapture = (e: React.PointerEvent) => {
    const v = viewportRef.current;
    if (!v) return;

    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return;

    // bitno: bez ovoga Firefox često ode u selection/drag mode
    e.preventDefault();

    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));

    if (dragRef.current.moved > CLICK_CANCEL_PX) {
      clickGuardRef.current.shouldCancelClick = true;
    }

    // ✅ fluid scroll dok držiš miš
    v.scrollLeft = dragRef.current.startScrollLeft - dx;
  };

  const endDrag = (e?: React.PointerEvent) => {
    const v = viewportRef.current;
    if (!v) return;

    if (!dragRef.current.active) return;

    // ako imamo event, spriječi “ghost click”
    e?.preventDefault();

    dragRef.current.active = false;

    // ✅ tek na kraju snap (i to smooth)
    snapToNearest();

    // mali delay da se scrollTo pokrene pa tek onda vrati pointer events
    setTimeout(() => setIsDragging(false), 50);
  };

  // ✅ ako se desio drag, cancel click na linkovima
  const onClickCapture = (e: React.MouseEvent) => {
    if (clickGuardRef.current.shouldCancelClick) {
      e.preventDefault();
      e.stopPropagation();
      clickGuardRef.current.shouldCancelClick = false;
    }
  };

  if (!data.length) {
    return (
      <section className="airplane-tickets-row">
        <div className="airplane-tickets-row-header">
          <h2>{title}</h2>
        </div>
        <div className="airplane-tickets-row-empty">
          Trenutno nema aviokarata za ovu rubriku.
        </div>
      </section>
    );
  }

  return (
    <section className="airplane-tickets-row">
      <div className="airplane-tickets-row-header">
        <h2>{title}</h2>
      </div>

      <div className="airplane-tickets-row-viewport-wrap">
        <button
          type="button"
          className={`airplane-tickets-row-arrow left ${!canLeft ? "disabled" : ""}`}
          onClick={goLeft}
          disabled={!canLeft}
          aria-label="Prethodno"
        >
          ←
        </button>

        <div
          ref={viewportRef}
          className={`airplane-tickets-row-viewport ${isDragging ? "is-dragging" : ""}`}
          onPointerDownCapture={onPointerDownCapture}
          onPointerMoveCapture={onPointerMoveCapture}
          onPointerUpCapture={endDrag}
          onPointerCancelCapture={endDrag}
          onLostPointerCapture={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()} // ✅ blokira native drag slika/linkova
        >
          <div className="airplane-tickets-row-track">
            {data.map((article: any) => (
              <div key={article.id} className="airplane-tickets-row-item">
                <HorizontalPostItemBig data={article} stretched={false} thin={true} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`airplane-tickets-row-arrow right ${!canRight ? "disabled" : ""}`}
          onClick={goRight}
          disabled={!canRight}
          aria-label="Sljedeće"
        >
          →
        </button>
      </div>
    </section>
  );
}
