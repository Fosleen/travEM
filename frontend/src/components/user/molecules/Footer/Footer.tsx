import { Link } from "react-router-dom";
import SocialMediaLinks from "../../../atoms/SocialMediaLinks/SocialMediaLinks";
import logo from "../../../../assets/images/logo-light.png";
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-list">
        <div className="footer-list-item">
          <div className="footer-list-item-title">BRZE POVEZNICE</div>
          <Link to="">
            <div className="footer-list-item-content">Destinacije</div>
          </Link>
          <Link to="">
            <div className="footer-list-item-content">Savjeti</div>
          </Link>
          <Link to="">
            <div className="footer-list-item-content">Aviokarte</div>
          </Link>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">O NAMA</div>
          <Link to="">
            <div className="footer-list-item-content">Priča o nama</div>
          </Link>
          <Link to="">
            <div className="footer-list-item-content">Radite s nama</div>
          </Link>
        </div>
        <div className="footer-list-item">
          <div className="footer-list-item-title">PRAVILA</div>
          <Link to="">
            <div className="footer-list-item-content">Uvjeti korištenja</div>
          </Link>
          <Link to="">
            <div className="footer-list-item-content">Zaštita privatnosti</div>
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
        <img src={logo} alt="fosleen-logo" />
      </div>
    </div>
  );
};

export default Footer;
