import { CaretDown } from "@phosphor-icons/react";
import Search from "../../../atoms/Search";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import "./NavbarDesktop.scss";
import { useLocation } from "react-router";

const NavbarDesktop = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="navbar-desktop-container">
      <div className="navbar-desktop-inner-container">
        <div className={`navbar-item ${isHomePage && "dark"}`}>
          Destinacije <CaretDown size={16} weight="bold" />
        </div>
        <div className={`navbar-item ${isHomePage && "dark"}`}>
          Savjeti <CaretDown size={16} weight="bold" />
        </div>
        <div className={`navbar-item ${isHomePage && "dark"}`}>
          Aviokarte <CaretDown size={16} weight="bold" />
        </div>
      </div>
      <div className="navbar-desktop-inner-container">
        <Search onChange={() => {}} />
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default NavbarDesktop;
