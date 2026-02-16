import "./BlogStatsItem.scss";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

type BlogStatsItemProps = {
  lottieSrc: string; // npr. "/lottie/stats-globe.json"
  value: string;
  text: string;
};

const BlogStatsItem: FC<BlogStatsItemProps> = ({ lottieSrc, value, text }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  // učitaj JSON iz public/ preko fetcha (Next radi normalno)
  useEffect(() => {
    let isMounted = true;

    fetch(lottieSrc)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) setAnimationData(json);
      })
      .catch((e) => console.error("Failed to load lottie:", lottieSrc, e));

    return () => {
      isMounted = false;
    };
  }, [lottieSrc]);

  const onEnter = () => {
    if (!lottieRef.current) return;
    lottieRef.current.goToAndPlay(0, true);
  };

  const onLeave = () => {
    if (!lottieRef.current) return;
    // vrati na početak i stani (da ne ostane na mid-frame)
    lottieRef.current.goToAndStop(0, true);
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
