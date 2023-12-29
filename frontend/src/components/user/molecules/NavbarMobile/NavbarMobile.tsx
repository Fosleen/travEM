import { List, X, CaretDown, CaretUp, Divide } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "./NavbarMobile.scss";
import { Link } from "react-router-dom";

const NavbarMobile = () => {
  const [openNav, setOpenNav] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const navHandler = () => {
    setOpenNav(!openNav);
  };

  const closeNav = () => {
    setOpenNav(false);
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
            size={32}
            color="black"
          />
        ) : (
          <List
            onClick={navHandler}
            className={`cursor-pointer ${openNav ? "hidden" : "block"}`}
            size={32}
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
              onClick={() => setSelectedSubcategory("destinacije")}
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
              onClick={() => setSelectedSubcategory("savjeti")}
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
              onClick={() => setSelectedSubcategory("aviokarte")}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
