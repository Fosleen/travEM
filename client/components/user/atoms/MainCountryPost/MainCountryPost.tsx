"use client";

import Link from "next/link";
import "./MainCountryPost.scss";
import Image from "next/image";
import { useMemo, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import mainPostIconAnimation from "@/public/lottie/main-post-icon.json";

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
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const savedFrameRef = useRef(0);

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
      .slice(0, 4);
  }, [article]);

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
      className="main-country-post-container"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={`/clanak/${article.id}`}
        className="main-country-post-main-link"
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        <div className="main-country-post-bg-image-container">
          <Image
            src={article.main_image_url}
            alt={`${article.title} background`}
            width={4000}
            height={2000}
          />
        </div>

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

        <div className="main-country-post-text-container">{article.title}</div>
      </Link>

      {previewSections.length > 0 && (
        <div className="main-country-post-preview-card">
          <h3>Vodič sadrži</h3>

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

                <span className="main-country-post-preview-arrow">›</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCountryPost;