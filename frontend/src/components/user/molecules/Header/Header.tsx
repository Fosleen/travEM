import { useLocation } from "react-router-dom";
import logoWhite from "../../../../assets/travem-logo-white.png";
import logoGrey from "../../../../assets/travem-logo-grey.png";
import "./Header.scss";
import { useEffect } from "react";

const Header = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(`location: ${location}`);
  }, [location]);
  const isHomePage = location.pathname === "/";

  return (
    <div className="header-container">
      <img src={isHomePage ? logoWhite : logoGrey} alt="Logo" />{" "}
    </div>
  );
};

export default Header;
