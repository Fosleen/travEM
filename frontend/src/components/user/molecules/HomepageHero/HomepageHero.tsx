import HomepageImage from "../../atoms/HomepageImage";
import travemLogo from "../../../../assets/images/travem-logo-hero.png";
import { ArrowDown } from "@phosphor-icons/react";
import "./HomepageHero.scss";

const HomepageHero = () => {
  return (
    <div className="homepage-hero-container">
      <div className="homepage-hero-left">
        <HomepageImage />
      </div>
      <div className="homepage-hero-right">
        <div className="homepage-hero-welcome">
          <p>Dobrodošli na</p>
          <div className="homepage-hero-welcome-box">
            <img src={travemLogo} alt="travem-logo" />
          </div>
          <p>i otkrijte nove informacije o putovanjima iz prve ruke</p>
        </div>
        <div className="homepage-hero-more">
          <div className="homepage-hero-more-row">
            <p>Mi smo</p>
            <p className="names">Ema i Matija</p>
            <div className="arrow-icon">
              <ArrowDown size={32} color="#333333" weight="thin" />
            </div>
          </div>
          <div className="homepage-hero-more-row">
            <p> Izaberite destinaciju </p>
            <p className="special">ovdje</p>
            <p> i putujte s nama</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
