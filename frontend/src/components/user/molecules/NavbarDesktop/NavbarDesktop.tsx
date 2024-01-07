import { CaretDown } from "@phosphor-icons/react";
import Search from "../../../atoms/Search";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import "./NavbarDesktop.scss";
import { useLocation } from "react-router";
import { useEffect } from "react";

const NavbarDesktop = ({
  setIsPlaneTicketsMenuShown,
  setIsDestinationsMenuShown,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handlePlaneTicketsMouseOver = () => {
    closeAllMenus();
    setIsPlaneTicketsMenuShown(true);
  };

  const handleDestinationsMouseOver = () => {
    closeAllMenus();
    setIsDestinationsMenuShown(true);
  };

  const closeAllMenus = () => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
  };

  useEffect(() => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
  }, [location]);

  return (
    <div className="navbar-desktop-container">
      <div className="navbar-desktop-inner-container">
        <div
          className={`navbar-item ${isHomePage && "dark"}`}
          onMouseOver={handleDestinationsMouseOver}
        >
          Destinacije <CaretDown size={16} weight="bold" />
        </div>
        <div className={`navbar-item ${isHomePage && "dark"}`}>
          Savjeti <CaretDown size={16} weight="bold" />
        </div>
        <div
          className={`navbar-item ${isHomePage && "dark"}`}
          onMouseOver={handlePlaneTicketsMouseOver}
        >
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
