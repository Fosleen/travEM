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

  // Close nav when pathname changes
  useEffect(() => {
    setOpenNav(false);
    setSelectedSubcategory("");
  }, [location.pathname, setOpenNav, setSelectedSubcategory]);

  const handleSubcategoryChange = (type: string) => {
    console.log(type);
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

  useEffect(() => {
    console.log(selectedSubcategory);
  }, [selectedSubcategory]);

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
          <div className="navbar-empty-header"></div>
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
