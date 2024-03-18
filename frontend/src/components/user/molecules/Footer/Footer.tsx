import { Link } from "react-router-dom";
import SocialMediaLinks from "../../atoms/SocialMediaLinks/SocialMediaLinks";
import logo from "../../../../assets/images/logo-light.png";
import "./Footer.scss";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignoreS
const Footer = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  setIsPlaneTicketsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  setIsDestinationsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  setIsTipsMenuShown,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  setOpenNav,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  setSelectedSubcategory,
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 1024);

  const updateMedia = () => {
    setDesktop(window.innerWidth >= 1024);
  };

  const goToTop = (type: string) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    closeAllMenus();
    if (isDesktop) {
      // open desktop version of menu
      if (type == "destinacije") {
        setIsDestinationsMenuShown(true);
      } else if (type == "savjeti") {
        setIsTipsMenuShown(true);
      } else if (type == "aviokarte") {
        setIsPlaneTicketsMenuShown(true);
      }
    } else {
      // open mobile version of menu
      setOpenNav(true);
      setSelectedSubcategory(type);
    }
  };

  const closeAllMenus = () => {
    setIsPlaneTicketsMenuShown(false);
    setIsDestinationsMenuShown(false);
    setIsTipsMenuShown(false);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <div className="footer-container">
      <div className="footer-list">
        <div className="footer-list-item">
          <div className="footer-list-item-title">BRZE POVEZNICE</div>
          <div
            className="footer-list-item-content"
            onClick={() => {
              goToTop("destinacije");
            }}
          >
            Destinacije
          </div>
          <div
            className="footer-list-item-content"
            onClick={() => {
              goToTop("savjeti");
            }}
          >
            Savjeti
          </div>
          <div
            className="footer-list-item-content"
            onClick={() => {
              goToTop("aviokarte");
            }}
          >
            Aviokarte
          </div>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">O NAMA</div>
          <Link to="/clanak/100">
            {/* TODO add link to about us article */}
            <div className="footer-list-item-content">Priča o nama</div>
          </Link>
          <Link to="/kontakt">
            <div className="footer-list-item-content">Radite s nama</div>
          </Link>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">PRAVILA</div>
          <Link to="">
            <div className="footer-list-item-content">Uvjeti korištenja</div>
          </Link>
          <Link to="/pravila-o-privatnosti">
            <div className="footer-list-item-content">
              Pravila o privatnosti
            </div>
          </Link>
          <Link to="https://www.flaticon.com" target="_blank">
            <div className="footer-list-item-content flaticon">
              Icons by Freepik - Flaticon
            </div>
          </Link>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">KONTAKT</div>
          <div className="footer-list-item-content">travem@gmail.com</div>
          <span className="footer-list-item-links">
            <SocialMediaLinks />
          </span>
        </div>
      </div>
      <div className="footer-logo">
        <a href="https://fosleen.netlify.app/" target="blank">
          <img src={logo} alt="fosleen-logo" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
