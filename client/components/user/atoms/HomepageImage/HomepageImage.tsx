"use client";

import "./HomepageImage.scss";
import { FC, useEffect, useState } from "react";

const HomepageImage: FC<{ url: string }> = ({ url }) => {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 768
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="homepage-image-container">
      <img src={url} alt="homepage-hero-image" />
      <svg
        className="homepage-clip scalableSvg"
        width="61"
        height="61"
        viewBox="0 0 61 61"
      >
        <defs>
          <clipPath id="homepage-clip-custom">
            {screenWidth < 768 ? (
              <path
                d="M589 0.5H1.99951C1.99978 136 1.00004 419 1 474C0.999956 537.032 59.4895 560.17 109.5 545.5C165.5 529.073 183.833 382.667 191.499 350.5C204.166 270.333 238.5 186.5 287 118.5C335.5 50.5 420.5 27.5 487.5 48C554.5 68.5 573 6 589 0.5Z"
                fill="#D9D9D9"
                stroke="black"
              />
            ) : (
              <path
                d="M77.5986 629.576C-46.5439 502.899 5.45436 165.42 47.8464 0H815.57C828.987 171.95 786.616 461.341 694.227 587.677C634.14 669.843 107.351 683.991 77.5986 629.576Z"
                fill="#D9D9D9"
              />
            )}
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default HomepageImage;
