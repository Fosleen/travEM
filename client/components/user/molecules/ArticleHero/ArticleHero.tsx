// @ts-nocheck

import { useEffect, useRef } from "react";
import { formatDate } from "../../../../utils/global";
import ArticleImage from "../../atoms/ArticleImage";
import "./ArticleHero.scss";

const ArticleHero = ({ article }) => {
  const heroRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const description = descriptionRef.current;
    const photo = hero?.querySelector(".article-hero-right");
    if (!hero || !description || !photo) return;

    let frame;
    const updateExclusion = () => {
      if (window.innerWidth >= 768) return;
      const paragraphRect = description.getBoundingClientRect();
      const photoRect = photo.getBoundingClientRect();
      const textStyle = getComputedStyle(description);
      const paddingRight = parseFloat(textStyle.paddingRight) || 0;
      const contentWidth = paragraphRect.width - paddingRight;
      const minimumTextWidth = 176;
      // Keep the usual 25% overlap, increasing it only as needed (up to 30%)
      // to retain a readable column on 360px screens.
      const overlap = Math.min(
        photoRect.width * 0.3,
        Math.max(
          photoRect.width * 0.25,
          paragraphRect.left + minimumTextWidth - photoRect.left,
        ),
      );
      const exclusionWidth = Math.max(
        0,
        paragraphRect.right - paddingRight - photoRect.left - overlap,
      );
      // Whole words that cannot fit beside the float continue below it;
      // a single long word must not push the entire paragraph below the photo.
      const reserveFullWidth = contentWidth - exclusionWidth < minimumTextWidth - 0.5;
      description.style.setProperty(
        "--photo-offset-top",
        `${photoRect.top - paragraphRect.top}px`,
      );
      description.style.setProperty(
        "--photo-exclusion-width",
        `${reserveFullWidth ? contentWidth : exclusionWidth}px`,
      );
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateExclusion);
    };
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(hero);
    observer.observe(description);
    observer.observe(photo);
    hero.querySelectorAll(".article-hero-titles, .article-hero-meta").forEach(
      (element) => observer.observe(element),
    );
    window.addEventListener("resize", scheduleUpdate);
    updateExclusion();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [article.title, article.description, article.date_updated, article.user]);

  const authorName =
    article.user?.username === "Dox" || article.user?.username === "Ema"
      ? "putujEM s travEM - Ema i Matija"
      : `${article.user?.first_name || ""} ${article.user?.last_name || ""}`.trim();

  return (
    <div className="article-hero-container" ref={heroRef}>
      <div className="article-hero-left">
        <div className="article-hero-titles">
          <h1>{article.title}</h1>
        </div>

        <div className="article-hero-meta">
          {article.date_updated && (
            <h5>
              <span>Ažurirano:</span> {formatDate(article.date_updated)}
            </h5>
          )}

          <h5>
            <span>Objavljeno:</span> {formatDate(article.date_written)}
          </h5>

          <h5>
            <span>Piše:</span> {authorName}
          </h5>
        </div>

        <p ref={descriptionRef}>{article.description}</p>
      </div>

      <div className="article-hero-right">
        <ArticleImage article={article} />
      </div>
    </div>
  );
};

export default ArticleHero;
