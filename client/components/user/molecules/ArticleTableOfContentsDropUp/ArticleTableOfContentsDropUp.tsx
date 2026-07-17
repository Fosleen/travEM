// client/components/user/molecules/ArticleTableOfContentsDropUp/ArticleTableOfContentsDropUp.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ArticleTableOfContentsDropUp.scss";
import TableOfContentsItem from "../../atoms/TableOfContentsItem";

type TocSection = {
  subtitle?: string | null;
  section_icon?: { url?: string | null } | null;
};

type TocArticle = {
  sections?: TocSection[] | null;
};

type Props = {
  article: TocArticle;
};

// SVG strelica (gore/dolje)
const CaretUp = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
  >
    <path
      d="M6 14l6-6 6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
  >
    <path
      d="M6 10l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArticleTableOfContentsDropUp = ({ article }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropup, setShowDropup] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const hasSections = useMemo(() => {
    const sections = article?.sections ?? [];
    if (!sections || sections.length === 0) return false;
    return sections.some((s) => Boolean(s?.subtitle));
  }, [article]);

  // 1) Show/Hide logika
  useEffect(() => {
    if (!hasSections) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // ===== MOBILE: sentinel (sad kad je sentinel na pravom mjestu u Article.tsx) =====
    if (isMobile) {
      const sentinel = document.querySelector(".toc-dropup-sentinel") as Element | null;

      if (!sentinel) {
        // fallback: pokaži tek nakon scrolla malo
        const onScroll = () => {
          const y = window.scrollY || 0;
          setShowDropup(y > 650);
          if (y <= 650) setIsOpen(false);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      }

      const obs = new IntersectionObserver(
        ([entry]) => {
          const isVisible = Boolean(entry?.isIntersecting);
          // sentinel je vidljiv = još si gore kod TOC-a -> dropup HIDE
          // sentinel nije vidljiv = ušao si u članak -> dropup SHOW
          setShowDropup(!isVisible);
          if (isVisible) setIsOpen(false);
        },
        {
          root: null,
          threshold: 0,
          // malo odgode da ne flickera zbog mobile address bara
          rootMargin: "-60px 0px 0px 0px",
        }
      );

      obs.observe(sentinel);
      return () => obs.disconnect();
    }

    // ===== DESKTOP: tvoja logika (targets) =====
    const selectors = [
      ".article-container",
      ".article-location-parent",
      ".article-table-of-contents-wrapper",
      ".article-connected-articles-wrapper",
      ".newsletter-container",
      ".footer-container",
    ];

    const targets = selectors
      .map((sel) => document.querySelector(sel))
      .filter(Boolean) as Element[];

    if (targets.length === 0) {
      const onScroll = () => {
        const y = window.scrollY || 0;
        setShowDropup(y > 600);
        if (y <= 600) setIsOpen(false);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const visibilityMap = new Map<Element, boolean>();
    targets.forEach((t) => visibilityMap.set(t, false));

    const update = () => {
      const anyVisible = Array.from(visibilityMap.values()).some(Boolean);
      setShowDropup(!anyVisible);
      if (anyVisible) setIsOpen(false);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilityMap.set(entry.target, entry.isIntersecting);
        }
        update();
      },
      { root: null, threshold: 0.12 }
    );

    targets.forEach((t) => obs.observe(t));
    update();

    return () => obs.disconnect();
  }, [hasSections]);

  // 1.5) MOBILE: podigni scroll-to-top iznad TOC dropupa
  useEffect(() => {
    const root = document.documentElement;

    if (showDropup) {
      // visina zatvorenog TOC dropupa (sigurna vrijednost)
      root.style.setProperty("--toc-safe-bottom", "84px");
    } else {
      root.style.setProperty("--toc-safe-bottom", "0px");
    }
    return () => {
      root.style.setProperty("--toc-safe-bottom", "0px");
    };
  }, [showDropup]);

  // 1.6) MOBILE: sakrij ScrollToTop dok je TOC dropup OTVOREN
useEffect(() => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) return;

  const root = document.documentElement;

  if (showDropup && isOpen) {
    // sakrij scroll-to-top
    root.style.setProperty("--toc-scrolltop-hidden", "1");
  } else {
    root.style.setProperty("--toc-scrolltop-hidden", "0");
  }

  return () => {
    root.style.setProperty("--toc-scrolltop-hidden", "0");
  };
}, [showDropup, isOpen]);



  // 2) ESC zatvori
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // 3) Klik izvan panela zatvara
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const panel = panelRef.current;
      const target = e.target as Node | null;
      if (!panel || !target) return;

      if (!panel.contains(target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown as any);
    };
  }, [isOpen]);

  if (!hasSections) return null;

  const sections = article?.sections ?? [];

  // Klik bilo gdje na "table-of-contents-item" -> okini click na <a>
  const handleListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const directLink = target.closest("a");
    if (directLink) {
      setIsOpen(false);
      return;
    }

    const itemWrapper = target.closest(".table-of-contents-item") as HTMLElement | null;
    if (!itemWrapper) return;

    const link = itemWrapper.querySelector("a") as HTMLAnchorElement | null;
    if (!link) return;

    link.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
    );

    setIsOpen(false);
  };

  return (
    <div className={`toc-dropup ${showDropup ? "show" : ""} ${isOpen ? "open" : ""}`}>
      <div className="toc-dropup-inner">
        <div ref={panelRef} className="toc-dropup-panel">
          <button
            type="button"
            className="toc-dropup-trigger"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
          >
            <span className="toc-dropup-title">Sadržaj</span>
            <span className="toc-dropup-caret" aria-hidden="true">
              {isOpen ? <CaretDown /> : <CaretUp />}
            </span>
          </button>

          <div className={`toc-dropup-content ${isOpen ? "open" : ""}`}>
            <ul className="toc-dropup-list" onClick={handleListClick}>
              {sections.map((section: TocSection, index: number) => {
                const subtitle = section?.subtitle ?? "";
                const iconUrl = section?.section_icon?.url?.trim() ?? "";
                if (!subtitle || !iconUrl) return null;

                const sectionId = `odlomak-${index}`;

                return (
                  <TableOfContentsItem
                    key={sectionId}
                    icon={iconUrl}
                    text={subtitle}
                    href={`#${sectionId}`}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleTableOfContentsDropUp;
