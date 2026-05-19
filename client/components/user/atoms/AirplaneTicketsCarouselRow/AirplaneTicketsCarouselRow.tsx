"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import HorizontalPostItemBig from "../HorizontalPostItemBig/HorizontalPostItemBig";
import Pagination from "@/components/atoms/Pagination";
import "./AirplaneTicketsCarouselRow.scss";

type Item = any;

type Props = {
  title: string;
  items: Item[];
};

const PRICE_PATTERNS = [
  /(?:već\s+)?od\s+(\d{1,4}(?:[.,]\d{1,2})?)\s*€/i,
  /za\s+(\d{1,4}(?:[.,]\d{1,2})?)\s*€/i,
];

const DESKTOP_VISIBLE_ITEMS = 6;
const MOBILE_ITEMS_PER_PAGE = 3;

const extractPriceLabel = (title?: string) => {
  if (!title) return null;

  const odMatch = title.match(PRICE_PATTERNS[0]);
  if (odMatch?.[1]) return `od ${odMatch[1]} €`;

  const zaMatch = title.match(PRICE_PATTERNS[1]);
  if (zaMatch?.[1]) return `od ${zaMatch[1]} €`;

  return null;
};

const getIsMobileLayout = () => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(max-width: 767px)").matches;
};

export default function AirplaneTicketsCarouselRow({ title, items }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const GAP = 16;
  const DRAG_THRESHOLD_PX = 10;

  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const allItems = useMemo(() => items ?? [], [items]);

  const mobileTotalPages = Math.ceil(allItems.length / MOBILE_ITEMS_PER_PAGE);

  const data = useMemo(() => {
    if (isMobileLayout) {
      const startIndex = (mobilePage - 1) * MOBILE_ITEMS_PER_PAGE;
      const endIndex = startIndex + MOBILE_ITEMS_PER_PAGE;

      return allItems.slice(startIndex, endIndex);
    }

    return allItems.slice(0, DESKTOP_VISIBLE_ITEMS);
  }, [allItems, isMobileLayout, mobilePage]);

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: 0,
    dragging: false,
    captured: false,
    isTouch: false,
  });

  const clickGuardRef = useRef({
    cancelClick: false,
  });

  useEffect(() => {
    const updateLayout = () => {
      setIsMobileLayout(getIsMobileLayout());
    };

    updateLayout();

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateLayout);
    } else {
      mediaQuery.addListener(updateLayout);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateLayout);
      } else {
        mediaQuery.removeListener(updateLayout);
      }
    };
  }, []);

  useEffect(() => {
    setMobilePage(1);
  }, [items]);

  const getItemWidth = () => {
    const v = viewportRef.current;
    if (!v) return 0;

    const firstItem = v.querySelector(
      ".airplane-tickets-row-item"
    ) as HTMLDivElement | null;

    if (!firstItem) return 0;

    return firstItem.getBoundingClientRect().width;
  };

  const getStepPx = () => {
    const itemW = getItemWidth();
    if (!itemW) return 0;
    return itemW + GAP;
  };

  const updateArrows = () => {
    const v = viewportRef.current;

    if (!v || isMobileLayout) {
      setCanLeft(false);
      setCanRight(false);
      return;
    }

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
  }, [data.length, isMobileLayout]);

  const snapToNearest = () => {
    const v = viewportRef.current;
    if (!v || isMobileLayout) return;

    const step = getStepPx();
    if (!step) return;

    const idx = Math.round(v.scrollLeft / step);
    v.scrollTo({ left: idx * step, behavior: "smooth" });
  };

  const goLeft = () => {
    const v = viewportRef.current;
    if (!v || isMobileLayout) return;

    const step = getStepPx();
    v.scrollBy({ left: -step, behavior: "smooth" });
  };

  const goRight = () => {
    const v = viewportRef.current;
    if (!v || isMobileLayout) return;

    const step = getStepPx();
    v.scrollBy({ left: step, behavior: "smooth" });
  };

  const handleMobilePageChange = (newPage: number) => {
    setMobilePage(newPage);

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const startDrag = (clientX: number, pointerId = -1, isTouch = false) => {
    if (isMobileLayout) return;

    const v = viewportRef.current;
    if (!v) return;

    dragRef.current.active = true;
    dragRef.current.pointerId = pointerId;
    dragRef.current.startX = clientX;
    dragRef.current.startScrollLeft = v.scrollLeft;
    dragRef.current.moved = 0;
    dragRef.current.dragging = false;
    dragRef.current.captured = false;
    dragRef.current.isTouch = isTouch;

    clickGuardRef.current.cancelClick = false;
  };

  const moveDrag = (
    clientX: number,
    e?: React.PointerEvent | React.TouchEvent
  ) => {
    if (isMobileLayout) return;

    const v = viewportRef.current;
    if (!v || !dragRef.current.active) return;

    const dx = clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));

    if (!dragRef.current.dragging && dragRef.current.moved > DRAG_THRESHOLD_PX) {
      dragRef.current.dragging = true;
      clickGuardRef.current.cancelClick = true;
      setIsDragging(true);
    }

    if (dragRef.current.dragging) {
      e?.preventDefault?.();
      v.scrollLeft = dragRef.current.startScrollLeft - dx;
    }
  };

  const finishDrag = (e?: React.SyntheticEvent) => {
    if (isMobileLayout) {
      setIsDragging(false);
      return;
    }

    const v = viewportRef.current;
    if (!v || !dragRef.current.active) return;

    const wasDragging = dragRef.current.dragging;

    dragRef.current.active = false;
    dragRef.current.dragging = false;
    dragRef.current.pointerId = -1;
    dragRef.current.isTouch = false;

    if (wasDragging) {
      e?.preventDefault?.();
      e?.stopPropagation?.();

      snapToNearest();

      setTimeout(() => setIsDragging(false), 50);
    } else {
      setIsDragging(false);
    }
  };

  const onPointerDownCapture = (e: React.PointerEvent) => {
    if (isMobileLayout || e.pointerType === "touch") return;
    startDrag(e.clientX, e.pointerId, false);
  };

  const onPointerMoveCapture = (e: React.PointerEvent) => {
    if (isMobileLayout || e.pointerType === "touch") return;
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId)
      return;

    const v = viewportRef.current;
    if (!v) return;

    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));

    if (!dragRef.current.dragging && dragRef.current.moved > DRAG_THRESHOLD_PX) {
      dragRef.current.dragging = true;
      clickGuardRef.current.cancelClick = true;
      setIsDragging(true);

      if (!dragRef.current.captured) {
        try {
          v.setPointerCapture(e.pointerId);
          dragRef.current.captured = true;
        } catch {
          // ignore
        }
      }
    }

    if (dragRef.current.dragging) {
      e.preventDefault();
      v.scrollLeft = dragRef.current.startScrollLeft - dx;
    }
  };

  const endPointerDrag = (e: React.PointerEvent) => {
    if (isMobileLayout || e.pointerType === "touch") return;
    finishDrag(e);
  };

  const onTouchStartCapture = (e: React.TouchEvent) => {
    if (isMobileLayout || !e.touches.length) return;
    startDrag(e.touches[0].clientX, -1, true);
  };

  const onTouchMoveCapture = (e: React.TouchEvent) => {
    if (isMobileLayout || !dragRef.current.active || !e.touches.length) return;
    moveDrag(e.touches[0].clientX, e);
  };

  const onTouchEndCapture = (e: React.TouchEvent) => {
    if (isMobileLayout) return;
    finishDrag(e);
  };

  const onTouchCancelCapture = (e: React.TouchEvent) => {
    if (isMobileLayout) return;
    finishDrag(e);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (clickGuardRef.current.cancelClick) {
      e.preventDefault();
      e.stopPropagation();
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
    <section
      ref={sectionRef}
      className={`airplane-tickets-row ${
        isMobileLayout ? "is-mobile-list" : ""
      }`}
    >
      <div className="airplane-tickets-row-header">
        <h2>{title}</h2>
      </div>

      <div className="airplane-tickets-row-viewport-wrap">
        <button
          type="button"
          className={`airplane-tickets-row-arrow left ${
            !canLeft ? "disabled" : ""
          }`}
          onClick={goLeft}
          disabled={!canLeft}
          aria-label="Prethodno"
        >
          ←
        </button>

        <div
          ref={viewportRef}
          className={`airplane-tickets-row-viewport ${
            isDragging ? "is-dragging" : ""
          }`}
          onPointerDownCapture={onPointerDownCapture}
          onPointerMoveCapture={onPointerMoveCapture}
          onPointerUpCapture={endPointerDrag}
          onPointerCancelCapture={endPointerDrag}
          onLostPointerCapture={endPointerDrag}
          onTouchStartCapture={onTouchStartCapture}
          onTouchMoveCapture={onTouchMoveCapture}
          onTouchEndCapture={onTouchEndCapture}
          onTouchCancelCapture={onTouchCancelCapture}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          <div className="airplane-tickets-row-track">
            {data.map((article: any) => {
              const priceLabel = extractPriceLabel(article.title);

              return (
                <div key={article.id} className="airplane-tickets-row-item">
                  <HorizontalPostItemBig
                    data={article}
                    stretched={false}
                    thin={true}
                  />

                  {priceLabel && (
                    <span className="airplane-tickets-row-price-badge">
                      {priceLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className={`airplane-tickets-row-arrow right ${
            !canRight ? "disabled" : ""
          }`}
          onClick={goRight}
          disabled={!canRight}
          aria-label="Sljedeće"
        >
          →
        </button>
      </div>

      {isMobileLayout && mobileTotalPages > 1 && (
        <div className="airplane-tickets-row-mobile-pagination">
          <Pagination
            totalPages={mobileTotalPages}
            currentPage={mobilePage}
            onPageChange={handleMobilePageChange}
            scrollToTop={false}
          />
        </div>
      )}
    </section>
  );
}