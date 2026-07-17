import "./BlogStats.scss";
import BlogStatsItem from "../../atoms/BlogStatsItem";
import { HomepageData, Nullable } from "../../../../common/types";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { getHomepageStats } from "../../../../utils/homepage";

type BlogStatsData = {
  continents_nmbr: number;
  countries_nmbr: number;
  articles_nmbr: number;
};

type ParsedStatValue = {
  number: number;
  suffix: string;
};

const ANIMATION_DURATION = 1400;

const parseStatValue = (value: string | number): ParsedStatValue => {
  const stringValue = value.toString().trim();

  const match = stringValue.match(/^(\d+(?:[.,]\d+)?)(.*)$/);

  if (!match) {
    return {
      number: 0,
      suffix: "",
    };
  }

  return {
    number: Number(match[1].replace(",", ".")),
    suffix: match[2],
  };
};

const formatAnimatedValue = (value: number, suffix: string) => {
  return `${Math.floor(value)}${suffix}`;
};

const BlogStats: FC<{ homepageContent: HomepageData }> = ({
  homepageContent,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [blogStats, setBlogStats] = useState<Nullable<BlogStatsData>>(null);
  const [hasAnimationStarted, setHasAnimationStarted] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    getHomepageStats().then(setBlogStats).catch(console.error);
  }, []);

  const statsItems = useMemo(() => {
    if (!blogStats) {
      return [];
    }

    return [
      {
        icon: "/images/world-icon.png",
        value: blogStats.continents_nmbr,
        text: "kontinenta",
      },
      {
        icon: "/images/globe-icon.png",
        value: blogStats.countries_nmbr,
        text: "države",
      },
      {
        icon: "/images/article-icon.png",
        value: blogStats.articles_nmbr,
        text: "članaka",
      },
      {
        icon: "/images/plane-ticket-icon.png",
        value: homepageContent.flights_nmbr,
        text: "letova avionom",
      },
      {
        icon: "/images/vlogging-icon.png",
        value: homepageContent.videos_nmbr,
        text: "videa",
      },
      {
        icon: "/images/walk-icon.png",
        value: homepageContent.distance_nmbr,
        text: "prijeđenih kilometara",
      },
    ];
  }, [blogStats, homepageContent]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || hasAnimationStarted || !blogStats) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimationStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimationStarted, blogStats]);

  useEffect(() => {
    if (!hasAnimationStarted) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setAnimationProgress(1);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasAnimationStarted]);

  return (
    <div ref={containerRef} className="blog-stats-container">
      {statsItems.map((item) => {
        const parsedValue = parseStatValue(item.value);
        const animatedValue = formatAnimatedValue(
          parsedValue.number * animationProgress,
          parsedValue.suffix
        );

        return (
          <BlogStatsItem
            key={item.text}
            icon={item.icon}
            value={animatedValue}
            text={item.text}
          />
        );
      })}
    </div>
  );
};

export default BlogStats;