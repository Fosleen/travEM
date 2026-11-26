"use client";

import { useEffect, useState } from "react";
import HomepageHero from "@/components/user/molecules/HomepageHero";
import type { HeroImageCrop } from "@/utils/heroImageCrop";
import "./HeroPreview.scss";

export default function HeroPreview() {
  const [url, setUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<HeroImageCrop>();
  const [failedUrl, setFailedUrl] = useState<string>();

  useEffect(() => {
    const updatePreview = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent ||
          event.data?.type !== "hero-preview-update" || typeof event.data.url !== "string") return;
      setCrop(event.data.crop);
      try {
        const source = event.data.url;
        const imageUrl = new URL(source, window.location.origin);
        setFailedUrl((failed) => failed === imageUrl.href ? failed : undefined);
        setUrl(source && ["http:", "https:"].includes(imageUrl.protocol) ? imageUrl.href : "");
      } catch {
        setUrl("");
      }
    };
    window.addEventListener("message", updatePreview);
    window.parent.postMessage({ type: "hero-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", updatePreview);
  }, []);

  if (url === null) return null;
  if (!url || failedUrl === url) {
    return <p className="hero-preview-error">Fotografiju nije moguće prikazati.</p>;
  }

  return (
    <main
      className="hero-preview-stage"
      inert
      onErrorCapture={(event) => {
        if (event.target instanceof HTMLImageElement && event.target.alt === "homepage-hero-image") {
          setFailedUrl(url);
        }
      }}
    >
      <HomepageHero homepageContent={{ hero_image_url: url, hero_image_crop: crop }} />
    </main>
  );
}
