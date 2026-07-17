// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { List, X, CaretDown, CaretUp } from "@phosphor-icons/react";
import { SetStateAction, useEffect, useState } from "react";
import "./NavbarMobile.scss";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import Search from "../../../atoms/Search";
import AirplaneTicketsMenu from "../../organisms/AirplaneTicketsMenu";
import DestinationsMenu from "../../organisms/DestinationsMenu";
import TipsMenu from "../../organisms/TipsMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NavbarMobile = ({
  location,
  setOpenNav,
  openNav,
  setSelectedSubcategory,
  selectedSubcategory,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const navHandler = () => {
    setOpenNav(!openNav);
  };

  const closeMobileNav = () => {
    setOpenNav(false);
    setSelectedSubcategory("");
  };

  // Close nav when pathname changes
  useEffect(() => {
    setOpenNav(false);
    setSelectedSubcategory("");
  }, [location.pathname, setOpenNav, setSelectedSubcategory]);

  const handleSubcategoryChange = (type: string) => {
    if (type != selectedSubcategory) {
      setSelectedSubcategory(type);
    } else {
      setSelectedSubcategory("");
    }
  };

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    router.push(`/pretrazivanje?naslov=${searchText}`);
  };

  return (
    <div className="navbar-mobile-container">
      <div className="navbar-mobile-icon">
        {openNav ? (
          <X onClick={navHandler} size={40} color="white" className="color" />
        ) : (
          <List onClick={navHandler} size={40} color="black" />
        )}
      </div>

      {openNav && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-menu-header">
            <Link
              href="/"
              className="navbar-mobile-logo"
              onClick={closeMobileNav}
              aria-label="Povratak na početnu stranicu"
            >
              <Image
                src="/images/travem-logo-grey.webp"
                width={102}
                height={61}
                alt="putujEM s travEM logo"
                priority
              />
            </Link>
          </div>

          <div className="navbar-mobile-menu-categories">
            <div className="navbar-mobile-menu-search">
              <Search
                green
                onChange={handleSearchChange}
                onClick={handleSearch}
              />
            </div>

            <div className="navbar-mobile-menu-list">
              <div
                className={`navbar-mobile-item ${
                  selectedSubcategory === "destinacije" && "selected"
                }`}
                onClick={() => handleSubcategoryChange("destinacije")}
              >
                Destinacije
                {selectedSubcategory === "destinacije" ? (
                  <CaretUp size={16} weight="bold" color="#e0e0e0" />
                ) : (
                  <CaretDown size={16} weight="bold" color="#303030" />
                )}
              </div>

              <div
                className={`navbar-mobile-item ${
                  selectedSubcategory === "savjeti" && "selected"
                }`}
                onClick={() => handleSubcategoryChange("savjeti")}
              >
                Savjeti
                {selectedSubcategory === "savjeti" ? (
                  <CaretUp size={16} weight="bold" color="#e0e0e0" />
                ) : (
                  <CaretDown size={16} weight="bold" color="#303030" />
                )}
              </div>

              <div
                className={`navbar-mobile-item ${
                  selectedSubcategory === "aviokarte" && "selected"
                }`}
                onClick={() => handleSubcategoryChange("aviokarte")}
              >
                Aviokarte
                {selectedSubcategory === "aviokarte" ? (
                  <CaretUp size={16} weight="bold" color="#e0e0e0" />
                ) : (
                  <CaretDown size={16} weight="bold" color="#303030" />
                )}
              </div>
            </div>
          </div>

          <div className="navbar-mobile-content">
            {selectedSubcategory === "destinacije" && (
              <div>
                <DestinationsMenu />
              </div>
            )}

            {selectedSubcategory === "savjeti" && (
              <div>
                <TipsMenu />
              </div>
            )}

            {selectedSubcategory === "aviokarte" && (
              <div>
                <AirplaneTicketsMenu />
              </div>
            )}

            <SocialMediaLinks />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;