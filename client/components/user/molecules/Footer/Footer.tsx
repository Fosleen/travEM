"use client";

import { useEffect, useState, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import Marquee from "../../atoms/Marquee";
import "./Footer.scss";

interface FooterProps {
  setIsPlaneTicketsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDestinationsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTipsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<string>>;
}

const Footer: FC<FooterProps> = ({
  setIsPlaneTicketsMenuShown,
  setIsDestinationsMenuShown,
  setIsTipsMenuShown,
  setOpenNav,
  setSelectedSubcategory,
}) => {
  const [isDesktop, setDesktop] = useState(false);

  useEffect(() => {
    const updateMedia = () => {
      setDesktop(window.innerWidth >= 1024);
    };

    updateMedia();

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const goToTop = (type: string) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    closeAllMenus();
    if (isDesktop) {
      if (type == "destinacije") {
        setIsDestinationsMenuShown(true);
      } else if (type == "savjeti") {
        setIsTipsMenuShown(true);
      } else if (type == "aviokarte") {
        setIsPlaneTicketsMenuShown(true);
      }
    } else {
      setOpenNav(true);
      setSelectedSubcategory(type);
    }
  };

  const closeAllMenus = () => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
    setIsTipsMenuShown(false);
  };

  return (
    <div className="footer-container">
      <div className="footer-list">
        <div className="footer-list-item">
          <div className="footer-list-item-title">BRZE POVEZNICE</div>
          <div
            className="footer-list-item-content"
            onClick={() => {
              goToTop("destinacije");
            }}
          >
            Destinacije
          </div>
          <div
            className="footer-list-item-content"
            onClick={() => {
              goToTop("savjeti");
            }}
          >
            Savjeti
          </div>
          <div
            className="footer-list-item-content"
            onClick={() => {
              goToTop("aviokarte");
            }}
          >
            Aviokarte
          </div>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">O NAMA</div>
          <Link href="/clanak/355">
            <div className="footer-list-item-content">Priča o nama</div>
          </Link>
          <Link href="/kontakt">
            <div className="footer-list-item-content">Radite s nama</div>
          </Link>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">PRAVILA</div>
          <Link href="/uvjeti-koristenja">
            <div className="footer-list-item-content">Uvjeti korištenja</div>
          </Link>
          <Link href="/pravila-o-privatnosti">
            <div className="footer-list-item-content">
              Pravila o privatnosti
            </div>
          </Link>
          <Link href="https://www.flaticon.com" target="_blank">
            <div className="footer-list-item-content flaticon">
              Icons by Freepik - Flaticon
            </div>
          </Link>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">KONTAKT</div>
          <div className="footer-list-item-content">travem.hr@gmail.com</div>
          <span className="footer-list-item-links">
            <SocialMediaLinks />
          </span>
        </div>
      </div>
      <div className="footer-logo">
        <a
          href="https://fosleen.com/?utm_source=putujemstravem&utm_medium=footer&utm_campaign=internal-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/logo-light.png"
            alt="fosleen-logo"
            width={100}
            height={40}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </a>
      </div>
      <Marquee />
    </div>
  );
};

export default Footer;
