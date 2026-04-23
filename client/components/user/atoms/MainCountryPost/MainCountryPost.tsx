"use client";

import Link from "next/link";
import "./MainCountryPost.scss";
import Image from "next/image";
import { useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import mainPostIconAnimation from "@/public/lottie/main-post-icon.json";

const MainCountryPost = ({ article }: any) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const savedFrameRef = useRef(0);

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
    const lottie = lottieRef.current;
    const item = lottie?.animationItem;

    if (!item) return;

    savedFrameRef.current = item.totalFrames ?? 0;
  };

  return (
    <Link
      href={`/clanak/${article.id}`}
      className="main-country-post-container"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div className="main-country-post-bg-image-container">
        <Image
          src={article.main_image_url}
          alt="post-bg-image"
          width={4000}
          height={2000}
        />
      </div>

      <div className="main-country-top-layer">
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
      </div>
    </Link>
  );
};

export default MainCountryPost;