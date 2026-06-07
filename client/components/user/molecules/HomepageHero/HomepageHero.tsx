import HomepageImage from "../../atoms/HomepageImage";
import { ArrowDown } from "@phosphor-icons/react";
import "./HomepageHero.scss";
import { useEffect, useRef, useState } from "react";
import DestinationsMenu from "../../organisms/DestinationsMenu";
import { FC } from "react";
import { HomepageData } from "../../../../common/types";
import Image from "next/image";
import Link from "next/link";

const HomepageHero: FC<{ homepageContent: HomepageData }> = ({
  homepageContent,
}) => {
  const [isDestinationsMenuHereShown, setIsDestinationsMenuHereShown] =
    useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDesktopDevice = () => {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const closeMenu = () => {
    clearCloseTimeout();
    setIsDestinationsMenuHereShown(false);
  };

  const openMenu = () => {
    clearCloseTimeout();
    setIsDestinationsMenuHereShown(true);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimeout();

    closeTimeoutRef.current = setTimeout(() => {
      setIsDestinationsMenuHereShown(false);
    }, 120);
  };

  const toggleMenu = () => {
    setIsDestinationsMenuHereShown((prev) => !prev);
  };

  const handleArrowClick = () => {
    if (!isDesktopDevice()) {
      toggleMenu();
    }
  };

  const handleDesktopMouseEnter = () => {
    if (isDesktopDevice()) {
      openMenu();
    }
  };

  const handleDesktopMouseLeave = () => {
    if (isDesktopDevice()) {
      scheduleCloseMenu();
    }
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  useEffect(() => {
    if (!isDestinationsMenuHereShown) return;

    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      if (isDesktopDevice()) return;

      const target = event.target as Node | null;

      if (!target) return;

      const clickedInsideMenu = menuRef.current?.contains(target);

      if (!clickedInsideMenu) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    const handlePopState = () => {
      setIsDestinationsMenuHereShown(false);
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    document.addEventListener("touchstart", handlePointerDownOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    if (!window.history.state?.heroDestinationsMenuOpen) {
      window.history.pushState({ heroDestinationsMenuOpen: true }, "");
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("touchstart", handlePointerDownOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDestinationsMenuHereShown]);

  return (
    <div className="homepage-hero-container">
      <Image
        className="overlay-icon-1"
        src="/images/suitcase-icon.png"
        alt="suitcase"
        width={320}
        height={320}
        style={{ width: "auto", height: "auto" }}
      />

      <div className="homepage-hero-left">
        <HomepageImage url={homepageContent.hero_image_url} />

        <Image
          className="overlay-icon-2"
          src="/images/plane-icon.png"
          alt="plane"
          width={120}
          height={120}
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <div className="homepage-hero-right">
        <div className="homepage-hero-welcome">
          <p className="light-color">Dobrodošli na</p>
          <div className="homepage-hero-welcome-box">
            <Image
              src="/images/travem-logo-hero.webp"
              alt="travem-logo"
              width={640}
              height={200}
              priority
            />
          </div>
          <p className="light-color">Svijet je veći nego što misliš.</p>
        </div>

        <div className="homepage-hero-more">
          <div className="homepage-hero-more-row">
            <p className="light-color">Mi smo</p>

            <Link
              className="names-link"
              href="/clanak/355"
              aria-label="Saznaj više o Emi i Matiji"
            >
              Ema i Matija
            </Link>
          </div>

          <div className="homepage-hero-more-row">
            <p className="light-color">
              i vodimo te kroz destinacije koje smo zaista posjetili. Korak po
              korak, iz prve ruke. <br />
              <span className="destination-label">Odaberi destinaciju:</span>
            </p>

            <button
              type="button"
              className={`arrow-icon ${
                isDestinationsMenuHereShown ? "is-open" : ""
              }`}
              onClick={handleArrowClick}
              onMouseEnter={handleDesktopMouseEnter}
              onMouseLeave={handleDesktopMouseLeave}
              aria-label="Otvori izbornik destinacija"
              aria-expanded={isDestinationsMenuHereShown}
            >
              <ArrowDown size={32} color="#333333" weight="thin" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`homepage-hero-destinations-menu-here-container ${
          isDestinationsMenuHereShown ? "is-open" : ""
        }`}
        onMouseEnter={handleDesktopMouseEnter}
        onMouseLeave={handleDesktopMouseLeave}
      >
        {isDestinationsMenuHereShown && (
          <DestinationsMenu
            setIsDestinationsMenuShown={setIsDestinationsMenuHereShown}
          />
        )}
      </div>
    </div>
  );
};

export default HomepageHero;