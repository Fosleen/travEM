import { useEffect, useState } from "react";
import "./ScrollToTop.scss";
import { ArrowCircleUp } from "@phosphor-icons/react/dist/ssr";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const pageHeight = document.documentElement.scrollHeight;
  const scrollThreshold = 0.4 * pageHeight; //it has to be dynamic because of many pages
  const location = useLocation();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > scrollThreshold) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  });

  useEffect(() => {
    goToTopInstant();
  }, [location]);

  const goToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToTopInstant = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
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
