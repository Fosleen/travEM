import { Link, useLocation } from "react-router-dom";
import logoWhite from "../../../../assets/images/travem-logo-white.webp";
import logoGrey from "../../../../assets/images/travem-logo-grey.webp";
import "./Header.scss";
import { useEffect, useState } from "react";
import NavbarDesktop from "../../molecules/NavbarDesktop";
import NavbarMobile from "../../molecules/NavbarMobile";
import AirplaneTicketsMenu from "../AirplaneTicketsMenu";
import DestinationsMenu from "../DestinationsMenu";
import TipsMenu from "../TipsMenu";

const Header = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  isPlaneTicketsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  setIsPlaneTicketsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  isDestinationsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  setIsDestinationsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  isTipsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  setIsTipsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  setOpenNav,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  openNav,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  setSelectedSubcategory,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  selectedSubcategory,
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

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
