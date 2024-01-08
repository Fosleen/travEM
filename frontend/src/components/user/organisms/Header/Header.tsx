import { Link, useLocation } from "react-router-dom";
import logoWhite from "../../../../assets/images/travem-logo-white.png";
import logoGrey from "../../../../assets/images/travem-logo-grey.png";
import "./Header.scss";
import { useEffect, useState } from "react";
import NavbarDesktop from "../../molecules/NavbarDesktop";
import NavbarMobile from "../../molecules/NavbarMobile";
import AirplaneTicketsMenu from "../AirplaneTicketsMenu";
import DestinationsMenu from "../DestinationsMenu";
import TipsMenu from "../TipsMenu";

const Header = ({
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
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  useEffect(() => {
    console.log(`location: ${location.pathname}`);
  }, [location]);

  const updateMedia = () => {
    setDesktop(window.innerWidth >= 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const isHomePage = location.pathname === "/";

  return (
    <div className="header-container">
      <div className="header-top">
        <Link to="/">
          <img src={isHomePage ? logoWhite : logoGrey} alt="travem-logo" />
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
          location={location}
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
