"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowCircleUp } from "@phosphor-icons/react/dist/ssr";
import "./ScrollToTop.scss";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const scrollThreshold = 0.4 * pageHeight;

      if (window.scrollY > scrollThreshold) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const goToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="btn-scroll-to-top">
      {showTopBtn ? (
        <ArrowCircleUp onClick={goToTopSmooth} size={64} weight="fill" />
      ) : null}
    </div>
  );
};

export default ScrollToTop;
