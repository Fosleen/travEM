"use client";

import { useEffect, useState, FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../assets/images/travem-logo-white.webp";
import logoGrey from "../../../../assets/images/travem-logo-grey.webp";
import NavbarDesktop from "../../molecules/NavbarDesktop";
import NavbarMobile from "../../molecules/NavbarMobile";
import AirplaneTicketsMenu from "../AirplaneTicketsMenu";
import DestinationsMenu from "../DestinationsMenu";
import TipsMenu from "../TipsMenu";
import "./Header.scss";

interface HeaderProps {
  isPlaneTicketsMenuShown: boolean;
  setIsPlaneTicketsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  isDestinationsMenuShown: boolean;
  setIsDestinationsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  isTipsMenuShown: boolean;
  setIsTipsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
  openNav: boolean;
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSubcategory: string;
}

const Header: FC<HeaderProps> = ({
  isPlaneTicketsMenuShown,
  setIsPlaneTicketsMenuShown,
  isDestinationsMenuShown,
  setIsDestinationsMenuShown,
  isTipsMenuShown,
  setIsTipsMenuShown,
  setOpenNav,
  openNav,
  setSelectedSubcategory,
  selectedSubcategory,
}) => {
  const [isDesktop, setDesktop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateMedia = () => {
      setDesktop(window.innerWidth >= 1024);
    };

    updateMedia();

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const isHomePage = pathname === "/"|| pathname === "/pocetna";

  return (
    <div className="header-container">
      <div className="header-top">
        <Link href="/">
          <Image src={isHomePage ? logoWhite : logoGrey} alt="travem-logo" />
        </Link>
        {isDesktop && (
          <NavbarDesktop
            setIsPlaneTicketsMenuShown={setIsPlaneTicketsMenuShown}
            setIsDestinationsMenuShown={setIsDestinationsMenuShown}
            setIsTipsMenuShown={setIsTipsMenuShown}
          />
        )}
      </div>
      {!isDesktop && (
        <NavbarMobile
          location={{ pathname }}
          setOpenNav={setOpenNav}
          openNav={openNav}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />
      )}
      <div className="header-filter-menu-container">
        {isPlaneTicketsMenuShown && (
          <AirplaneTicketsMenu
            setIsPlaneTicketsMenuShown={setIsPlaneTicketsMenuShown}
          />
        )}
        {isDestinationsMenuShown && (
          <DestinationsMenu
            setIsDestinationsMenuShown={setIsDestinationsMenuShown}
          />
        )}
        {isTipsMenuShown && (
          <TipsMenu setIsTipsMenuShown={setIsTipsMenuShown} />
        )}
      </div>
    </div>
  );
};

export default Header;
