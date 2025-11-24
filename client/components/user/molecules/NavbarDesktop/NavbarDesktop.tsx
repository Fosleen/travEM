import { CaretDown } from "@phosphor-icons/react";
import Search from "../../../atoms/Search";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import "./NavbarDesktop.scss";
import { useLocation, useNavigate } from "react-router";
import { FC, SetStateAction, useEffect, useState } from "react";

const NavbarDesktop: FC<{
  setIsPlaneTicketsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDestinationsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTipsMenuShown: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setIsPlaneTicketsMenuShown,
  setIsDestinationsMenuShown,
  setIsTipsMenuShown,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

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

  const closeAllMenus = () => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
    setIsTipsMenuShown(false);
  };

  useEffect(() => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
  }, [location]);

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/pretrazivanje?naslov=${searchText}`);
  };

  return (
    <div className="navbar-desktop-container">
      <div className="navbar-desktop-inner-container">
        <div
          className={`navbar-item ${isHomePage && "dark"}`}
          onMouseOver={handleDestinationsMouseOver}
        >
          Destinacije <CaretDown size={16} weight="bold" />
        </div>
        <div
          className={`navbar-item ${isHomePage && "dark"}`}
          onMouseOver={handleTipsMouseOver}
        >
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
        <Search onChange={handleSearchChange} onClick={handleSearch} />
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default NavbarDesktop;
