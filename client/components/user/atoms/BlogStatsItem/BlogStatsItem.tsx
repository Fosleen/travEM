"use client";

import "./BlogStatsItem.scss";
import { FC, useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

type BlogStatsItemProps = {
  lottieSrc: string;
  value: string;
  text: string;
};

const BlogStatsItem: FC<BlogStatsItemProps> = ({ lottieSrc, value, text }) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const savedFrameRef = useRef(0);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    fetch(lottieSrc)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setAnimationData(json);
          savedFrameRef.current = 0;
        }
      })
      .catch((e) => console.error("Failed to load lottie:", lottieSrc, e));

    return () => {
      isMounted = false;
    };
  }, [lottieSrc]);

  const onEnter = () => {
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

  const onLeave = () => {
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

  const handleEnterFrame = () => {
    const item = lottieRef.current?.animationItem;

    if (!item) return;

    savedFrameRef.current = item.currentFrame ?? 0;
  };

  return (
    <div
      className="blog-stats-item-container"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="blog-stats-item-wrapper">
        <div className="blog-stats-item-image">
          {animationData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              autoplay={false}
              loop={false}
              onComplete={handleComplete}
              onEnterFrame={handleEnterFrame}
              className="blog-stats-lottie"
            />
          ) : (
            <div className="blog-stats-lottie-skeleton" />
          )}
        </div>

        <div className="blog-stats-item-value">
          <p>{value}</p>
        </div>
      </div>

      <p className="blog-stats-item-text">{text}</p>
    </div>
  );
};

export default BlogStatsItem;