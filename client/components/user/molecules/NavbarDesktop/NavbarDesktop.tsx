// NavbarDesktop.tsx
"use client";

import { FC, SetStateAction, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react";
import Search from "../../../atoms/Search";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import "./NavbarDesktop.scss";

const NavbarDesktop: FC<{
  setIsPlaneTicketsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDestinationsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTipsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaneTicketsMenuShown: boolean;
  isDestinationsMenuShown: boolean;
  isTipsMenuShown: boolean;
}> = ({
  setIsPlaneTicketsMenuShown,
  setIsDestinationsMenuShown,
  setIsTipsMenuShown,
  isPlaneTicketsMenuShown,
  isDestinationsMenuShown,
  isTipsMenuShown,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [searchText, setSearchText] = useState<string>("");

  const closeAllMenus = () => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
    setIsTipsMenuShown(false);
  };

  const handlePlaneTicketsMouseOver = () => {
    closeAllMenus();
    setIsPlaneTicketsMenuShown(true);
  };

  const handleDestinationsMouseOver = () => {
    closeAllMenus();
    setIsDestinationsMenuShown(true);
  };

  const handleTipsMouseOver = () => {
    closeAllMenus();
    setIsTipsMenuShown(true);
  };

  useEffect(() => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
    setIsTipsMenuShown(false);
  }, [pathname]);

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    router.push(`/pretrazivanje?naslov=${searchText}`);
  };

  return (
    <div className="navbar-desktop-container">
      <div className="navbar-desktop-inner-container">
        <div
          className={`navbar-item ${isHomePage ? "dark" : ""} ${
            isDestinationsMenuShown ? "active" : ""
          }`}
          onMouseOver={handleDestinationsMouseOver}
        >
          Destinacije <CaretDown size={16} weight="bold" />
        </div>

        <div
          className={`navbar-item ${isHomePage ? "dark" : ""} ${
            isTipsMenuShown ? "active" : ""
          }`}
          onMouseOver={handleTipsMouseOver}
        >
          Savjeti <CaretDown size={16} weight="bold" />
        </div>

        <div
          className={`navbar-item ${isHomePage ? "dark" : ""} ${
            isPlaneTicketsMenuShown ? "active" : ""
          }`}
          onMouseOver={handlePlaneTicketsMouseOver}
        >
          Aviokarte <CaretDown size={16} weight="bold" />
        </div>
      </div>

      <div className="navbar-desktop-inner-container">
        <Search onChange={handleSearchChange} onClick={handleSearch} />
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default NavbarDesktop;
