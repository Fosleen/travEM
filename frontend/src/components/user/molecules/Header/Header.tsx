import { Link, useLocation } from "react-router-dom";
import logoWhite from "../../../../assets/travem-logo-white.png";
import logoGrey from "../../../../assets/travem-logo-grey.png";
import "./Header.scss";
import { useEffect, useState } from "react";
import NavbarDesktop from "../NavbarDesktop";
import NavbarMobile from "../NavbarMobile";

const Header = () => {
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
        {isDesktop && <NavbarDesktop />}
      </div>
      {!isDesktop && <NavbarMobile />}
    </div>
  );
};

export default Header;
