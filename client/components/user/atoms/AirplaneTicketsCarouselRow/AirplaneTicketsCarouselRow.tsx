"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import HorizontalPostItemBig from "../HorizontalPostItemBig/HorizontalPostItemBig";
import "./AirplaneTicketsCarouselRow.scss";

type Item = any;

type Props = {
  title: string;
  items: Item[];
};

export default function AirplaneTicketsCarouselRow({ title, items }: Props) {
  const data = useMemo(() => (items ?? []).slice(0, 6), [items]);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const GAP = 16;
  const DRAG_THRESHOLD_PX = 10; // malo veće da “micro-move” ne ubije klik

  const [isDragging, setIsDragging] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: 0,
    dragging: false,
    captured: false,
  });

  const clickGuardRef = useRef({
    cancelClick: false,
  });

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

  const onPointerDownCapture = (e: React.PointerEvent) => {
    const v = viewportRef.current;
    if (!v) return;

    dragRef.current.active = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.startX = e.clientX;
    dragRef.current.startScrollLeft = v.scrollLeft;
    dragRef.current.moved = 0;
    dragRef.current.dragging = false;
    dragRef.current.captured = false;

    clickGuardRef.current.cancelClick = false;

    // ⛔️ NAMJERNO: NE setPointerCapture ovdje.
    // Capture palimo TEK kad stvarno krenemo draggati.
  };

  const onPointerMoveCapture = (e: React.PointerEvent) => {
    const v = viewportRef.current;
    if (!v) return;
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return;

    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));

    // Kad pređe threshold -> to je drag
    if (!dragRef.current.dragging && dragRef.current.moved > DRAG_THRESHOLD_PX) {
      dragRef.current.dragging = true;
      clickGuardRef.current.cancelClick = true;

      setIsDragging(true);

      // ✅ Capture tek sad (kad je drag stvaran)
      if (!dragRef.current.captured) {
        try {
          v.setPointerCapture(e.pointerId);
          dragRef.current.captured = true;
        } catch {
          // ignore - neki browseri mogu bacit error u edge caseovima
        }
      }
    }

    if (dragRef.current.dragging) {
      // spriječi selection i “image drag”
      e.preventDefault();
      v.scrollLeft = dragRef.current.startScrollLeft - dx;
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    const v = viewportRef.current;
    if (!v) return;
    if (!dragRef.current.active) return;

    const wasDragging = dragRef.current.dragging;

    dragRef.current.active = false;
    dragRef.current.dragging = false;

    // Ako smo imali drag, ubij ghost click i snap-aj
    if (wasDragging) {
      e.preventDefault();
      e.stopPropagation();

      snapToNearest();

      // malo vremena da snap krene, pa ugasi state
      setTimeout(() => setIsDragging(false), 50);
    } else {
      // nije bilo draga -> klik mora proći normalno
      setIsDragging(false);
    }
  };

  // Ako je bio drag, cancel click (ali samo tada)
  const onClickCapture = (e: React.MouseEvent) => {
    if (clickGuardRef.current.cancelClick) {
      e.preventDefault();
      e.stopPropagation();
      // reset
      clickGuardRef.current.cancelClick = false;
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
          onDragStart={(e) => e.preventDefault()}
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
