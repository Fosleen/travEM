import { List, X, CaretDown, CaretUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "./NavbarMobile.scss";
import SocialMediaLinks from "../../../atoms/SocialMediaLinks/SocialMediaLinks";
import Search from "../../../atoms/Search";

const NavbarMobile = () => {
  const [openNav, setOpenNav] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const navHandler = () => {
    setOpenNav(!openNav);
  };

  const closeNav = () => {
    setOpenNav(false);
  };

  const handleSubcategoryChange = (type: string) => {
    console.log(type);
    7;
    if (type != selectedSubcategory) {
      setSelectedSubcategory(type);
    } else {
      setSelectedSubcategory("");
    }
  };

  useEffect(() => {
    console.log(selectedSubcategory);
  }, [selectedSubcategory]);

  return (
    <div className="navbar-mobile-container">
      <div className="navbar-mobile-icon">
        {openNav ? (
          <X
            onClick={navHandler}
            className={`cursor-pointer ${openNav ? "block" : "hidden"}`}
            size={40}
            color="black"
          />
        ) : (
          <List
            onClick={navHandler}
            className={`cursor-pointer ${openNav ? "hidden" : "block"}`}
            size={40}
            color="black"
          />
        )}
      </div>
      {openNav && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-menu-categories">
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

          <div className="navbar-mobile-content">
            {selectedSubcategory === "destinacije" && (
              <div>destinacije popis</div>
            )}
            {selectedSubcategory === "savjeti" && <div>savjeti popis </div>}
            {selectedSubcategory === "aviokarte" && <div>aviokarte popis </div>}
            <Search green onChange={() => {}} />
            <SocialMediaLinks />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
