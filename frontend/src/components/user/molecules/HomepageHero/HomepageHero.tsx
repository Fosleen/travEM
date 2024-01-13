import HomepageImage from "../../atoms/HomepageImage";
import travemLogo from "../../../../assets/images/travem-logo-hero.png";
import suitcaseIcon from "../../../../assets/images/suitcase-icon.png";
import planeIcon from "../../../../assets/images/plane-icon.png";
import { ArrowDown } from "@phosphor-icons/react";
import "./HomepageHero.scss";
import { useState } from "react";
import DestinationsMenu from "../../organisms/DestinationsMenu";
import { FC } from "react";
import { HomepageData } from "../../../../common/types";

const HomepageHero: FC<{ homepageContent: HomepageData }> = ({
  homepageContent,
}) => {
  const [isDestinationsMenuHereShown, setIsDestinationsMenuHereShown] =
    useState(false);

  const handleMouseOver = () => {
    setIsDestinationsMenuHereShown(true);
  };

  return (
    <div className="homepage-hero-container">
      <img className="overlay-icon-1" src={suitcaseIcon} alt="suitcase" />
      <img className="overlay-icon-2" src={planeIcon} alt="plane" />
      <div className="homepage-hero-left">
        <HomepageImage url={homepageContent.hero_image_url} />
      </div>
      <div className="homepage-hero-right">
        <div className="homepage-hero-welcome">
          <p className="light-color">Dobrodošli na</p>
          <div className="homepage-hero-welcome-box">
            <img src={travemLogo} alt="travem-logo" />
          </div>
          <p className="light-color">
            i otkrijte nove informacije o putovanjima iz prve ruke
          </p>
        </div>
        <div className="homepage-hero-more">
          <div className="homepage-hero-more-row">
            <p className="light-color">Mi smo</p>
            <p className="names">Ema i Matija</p>
            <div className="arrow-icon">
              <ArrowDown size={32} color="#333333" weight="thin" />
            </div>
          </div>
          <div className="homepage-hero-more-row">
            <p className="light-color"> Izaberite destinaciju </p>
            <p className="special light-color" onMouseOver={handleMouseOver}>
              ovdje
            </p>
            <p className="light-color"> i putujte s nama</p>
          </div>
        </div>
      </div>
      <div className="homepage-hero-destinations-menu-here-container">
        {isDestinationsMenuHereShown && (
          <DestinationsMenu
            setIsDestinationsMenuShown={setIsDestinationsMenuHereShown}
          />
        )}
      </div>
    </div>
  );
};

export default HomepageHero;
