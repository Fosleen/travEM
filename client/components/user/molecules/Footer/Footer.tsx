"use client";

import { FC } from "react";
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
}) => {
  const closeAllMenus = () => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
    setIsTipsMenuShown(false);
  };

  return (
    <div className="footer-container" data-nosnippet>
      <div className="footer-list">
        <div className="footer-list-item">
          <div className="footer-list-item-title">BRZE POVEZNICE</div>
          <Link
            href="/destinacije"
            className="footer-list-item-content"
            onClick={closeAllMenus}
          >
            Destinacije
          </Link>
          <Link
            href="/savjeti"
            className="footer-list-item-content"
            onClick={closeAllMenus}
          >
            Savjeti
          </Link>
          <Link
            href="/aviokarte"
            className="footer-list-item-content"
            onClick={closeAllMenus}
          >
            Aviokarte
          </Link>
          <Link
            href="https://www.discovercars.com/?a_aid=travEM"
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            <div className="footer-list-item-content">
              Rentaj auto na Discover Cars
            </div>
          </Link>
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
          <a
            className="footer-list-item-content"
            href="mailto:hello@putujemstravem.com"
          >
            hello@putujemstravem.com
          </a>
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
            src="https://ik.imagekit.io/travEM/Sponzori/Fosleen%20logo-light.png?updatedAt=1785507272050"
            alt="fosleen-logo"
            width={100}
            height={40}
            priority
          />
        </a>
      </div>
      <Marquee />
    </div>
  );
};

export default Footer;
