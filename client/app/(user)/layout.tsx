"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/user/organisms/Header";
import Footer from "@/components/user/molecules/Footer";
import Newsletter from "@/components/user/molecules/Newsletter";
import PopUp from "@/components/user/molecules/PopUp";
import ScrollToTop from "@/components/atoms/ScrollToTop";
import PopUp from "@/components/user/molecules/PopUp";
import { ArticleProvider } from "@/context/ArticleContext";
import "../../components/user/templates/UserViewLayout.scss";
import { PlaneTicketsProvider } from "@/context/PlaneTicketsMenuContext";
import { ContinentProvider } from "@/context/ContinentContext";
import { CountryProvider } from "@/context/CountryContext";

export default function UserViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isArticlePage = pathname.startsWith("/clanak");

  const isHomePage =
    pathname === "/" ||
    pathname.startsWith("/destinacija") ||
    pathname.startsWith("/clanak");

  const [isPlaneTicketsMenuShown, setIsPlaneTicketsMenuShown] = useState(false);
  const [isDestinationsMenuShown, setIsDestinationsMenuShown] = useState(false);
  const [isTipsMenuShown, setIsTipsMenuShown] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showBmcButton, setShowBmcButton] = useState(false);
  const [isTocDropupActive, setIsTocDropupActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const scrollThreshold = 0.4 * pageHeight;

      setShowBmcButton(window.scrollY > scrollThreshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    setShowBmcButton(false);
    setIsTocDropupActive(false);
  }, [pathname]);

  useEffect(() => {
    const checkTocDropupState = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (!isMobile) {
        setIsTocDropupActive(false);
        return;
      }

      const rootStyles = getComputedStyle(document.documentElement);
      const bodyStyles = getComputedStyle(document.body);

      const rootHiddenValue = rootStyles
        .getPropertyValue("--toc-scrolltop-hidden")
        .trim();

      const bodyHiddenValue = bodyStyles
        .getPropertyValue("--toc-scrolltop-hidden")
        .trim();

      const isHiddenByCssVariable =
        rootHiddenValue === "1" || bodyHiddenValue === "1";

      const activeTocDropup = document.querySelector(
        ".toc-dropup-trigger.active, .toc-dropup-trigger.open, .toc-dropup-trigger[aria-expanded='true']"
      );

      setIsTocDropupActive(Boolean(activeTocDropup) || isHiddenByCssVariable);
    };

    checkTocDropupState();

    const observer = new MutationObserver(checkTocDropupState);

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "style", "aria-expanded"],
    });

    window.addEventListener("scroll", checkTocDropupState);
    window.addEventListener("resize", checkTocDropupState);
    window.addEventListener("click", checkTocDropupState);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkTocDropupState);
      window.removeEventListener("resize", checkTocDropupState);
      window.removeEventListener("click", checkTocDropupState);
    };
  }, [pathname]);

  return (
    <ArticleProvider>
      <PlaneTicketsProvider>
        <ContinentProvider>
          <CountryProvider>
            <main className="user-view-layout-container">
              <ScrollToTop />
              <PopUp />
              <Header
                isPlaneTicketsMenuShown={isPlaneTicketsMenuShown}
                setIsPlaneTicketsMenuShown={setIsPlaneTicketsMenuShown}
                isDestinationsMenuShown={isDestinationsMenuShown}
                setIsDestinationsMenuShown={setIsDestinationsMenuShown}
                isTipsMenuShown={isTipsMenuShown}
                setIsTipsMenuShown={setIsTipsMenuShown}
                setOpenNav={setOpenNav}
                openNav={openNav}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
              />

              <div
                className={`user-view-layout-page ${
                  !isHomePage ? "max-width" : ""
                }`}
              >
                {children}
              </div>

              {isArticlePage && showBmcButton && !isTocDropupActive && (
                <a
                  href="https://www.buymeacoffee.com/putujemstravem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bmc-support-button"
                  aria-label="Podrži blog"
                  title="Podrži blog"
                >
                  <span className="bmc-support-button__icon">☕</span>
                  <span className="bmc-support-button__text">Podrži blog</span>
                </a>
              )}

              <Newsletter />

              <Footer
                setIsPlaneTicketsMenuShown={setIsPlaneTicketsMenuShown}
                setIsDestinationsMenuShown={setIsDestinationsMenuShown}
                setIsTipsMenuShown={setIsTipsMenuShown}
                setOpenNav={setOpenNav}
                setSelectedSubcategory={setSelectedSubcategory}
              />

              <PopUp />

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </main>
          </CountryProvider>
        </ContinentProvider>
      </PlaneTicketsProvider>
    </ArticleProvider>
  );
}