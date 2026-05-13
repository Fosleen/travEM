"use client";

import Link from "next/link";
import "./MainCountryPost.scss";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import mainPostIconAnimation from "@/public/lottie/main-post-icon.json";

const EXTENDED_PREVIEW_MIN_HEIGHT = 520;
const DESKTOP_BREAKPOINT = 1024;

const getArticleSections = (article: any) => {
  return (
    article?.sections ||
    article?.article_sections ||
    article?.articleSections ||
    []
  );
};

const getSectionSubtitle = (section: any) => {
  return section?.subtitle || "";
};

const getSectionIcon = (section: any) => {
  return (
    section?.section_icon?.url ||
    section?.sectionIcon?.url ||
    section?.icon?.url ||
    section?.section_icon_url ||
    section?.sectionIconUrl ||
    section?.icon_url ||
    section?.iconUrl ||
    ""
  );
};

const MainCountryPost = ({ article }: any) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const savedFrameRef = useRef(0);

  const [canShowExtendedPreview, setCanShowExtendedPreview] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof window === "undefined") return;

    const updatePreviewMode = () => {
      const containerHeight = container.getBoundingClientRect().height;
      const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

      setCanShowExtendedPreview(
        isDesktop && containerHeight >= EXTENDED_PREVIEW_MIN_HEIGHT
      );
    };

    updatePreviewMode();

    const resizeObserver = new ResizeObserver(updatePreviewMode);
    resizeObserver.observe(container);

    window.addEventListener("resize", updatePreviewMode);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePreviewMode);
    };
  }, []);

  const previewSections = useMemo(() => {
    const sections = getArticleSections(article);

    if (!sections || sections.length === 0) {
      return [];
    }

    return sections
      .map((section: any, index: number) => ({
        id: section?.id || index,
        title: getSectionSubtitle(section),
        icon: getSectionIcon(section),
        href: `/clanak/${article.id}#odlomak-${index}`,
      }))
      .filter((section: any) => section.title)
      .slice(0, canShowExtendedPreview ? 8 : 4);
  }, [article, canShowExtendedPreview]);

  const handleEnter = () => {
    const lottie = lottieRef.current;
    const item = lottie?.animationItem;

    if (!lottie || !item) return;

    const totalFrames = item.totalFrames ?? 0;
    const savedFrame = savedFrameRef.current;
    const isAtEnd = savedFrame >= totalFrames - 1;

    if (isAtEnd) {
      savedFrameRef.current = 0;
      lottie.goToAndPlay(0, true);
      return;
    }

    lottie.goToAndPlay(savedFrame, true);
  };

  const handleLeave = () => {
    const lottie = lottieRef.current;
    const item = lottie?.animationItem;

    if (!lottie || !item) return;

    savedFrameRef.current = item.currentFrame ?? 0;
    lottie.pause();
  };

  const handleComplete = () => {
    const item = lottieRef.current?.animationItem;

    if (!item) return;

    savedFrameRef.current = item.totalFrames ?? 0;
  };

  return (
    <div
      ref={containerRef}
      className={`main-country-post-container ${
        canShowExtendedPreview ? "has-extended-preview" : ""
      }`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="main-country-post-bg-image-container">
        <Image
          src={article.main_image_url}
          alt={`${article.title} background`}
          width={4000}
          height={2000}
        />
      </div>

      <div className="main-country-top-layer">
        <Link
          href={`/clanak/${article.id}`}
          className="main-country-post-main-link"
          onFocus={handleEnter}
          onBlur={handleLeave}
        >
          <div className="main-country-post-top-image-container">
            <img
              src={article.main_image_url}
              alt={`${article.title} post-image`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="main-country-icon-container">
            <div className="main-country-icon-circle">
              <div className="main-country-icon-lottie">
                <Lottie
                  lottieRef={lottieRef}
                  animationData={mainPostIconAnimation}
                  autoplay={false}
                  loop={false}
                  onComplete={handleComplete}
                />
              </div>
            </div>
          </div>

          <div className="main-country-post-text-container">
            {article.title}
          </div>
        </Link>

        {previewSections.length > 0 && (
          <div className="main-country-post-preview-row">
            {previewSections.map((section: any, index: number) => (
              <Link
                href={section.href}
                className="main-country-post-preview-item"
                key={section.id || index}
                title={section.title}
                onFocus={handleEnter}
                onBlur={handleLeave}
              >
                <div className="main-country-post-preview-icon">
                  {section.icon ? (
                    <img src={section.icon} alt="" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <span className="main-country-post-preview-text">
                  {section.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainCountryPost;