import { useEffect, useState } from "react";
import "./ScrollToTop.scss";
import { ArrowCircleUp } from "@phosphor-icons/react/dist/ssr";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const pageHeight = document.documentElement.scrollHeight;
  const scrollThreshold = 0.4 * pageHeight; //it has to be dynamic because of many pages
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > scrollThreshold) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  });
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="btn-scroll-to-top">
      {showTopBtn ? (
        <ArrowCircleUp onClick={goToTop} size={64} weight="fill" />
      ) : null}
    </div>
  );
};

export default ScrollToTop;
