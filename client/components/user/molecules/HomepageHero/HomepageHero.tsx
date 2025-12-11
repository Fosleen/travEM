import HomepageImage from "../../atoms/HomepageImage";
import { ArrowDown } from "@phosphor-icons/react";
import "./HomepageHero.scss";
import { useState } from "react";
import DestinationsMenu from "../../organisms/DestinationsMenu";
import { FC } from "react";
import { HomepageData } from "../../../../common/types";
import Image from "next/image";

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
      <Image
        className="overlay-icon-1"
        src="/images/suitcase-icon.png"
        alt="suitcase"
        width={320}
        height={320}
        style={{ width: "auto", height: "auto" }}
      />
      <Image
        className="overlay-icon-2"
        src="/images/plane-icon.png"
        alt="plane"
        width={120}
        height={120}
        style={{ width: "auto", height: "auto" }}
      />
      <div className="homepage-hero-left">
        <HomepageImage url={homepageContent.hero_image_url} />
      </div>
      <div className="homepage-hero-right">
        <div className="homepage-hero-welcome">
          <p className="light-color">Dobrodošli na</p>
          <div className="homepage-hero-welcome-box">
            <Image
              src="/images/travem-logo-hero.webp"
              alt="travem-logo"
              width={640}
              height={200}
              priority
            />
          </div>
          <p className="light-color">
            i otkrijte nove informacije o putovanjima iz prve ruke
          </p>
        </div>
        <div className="homepage-hero-more">
          <div className="homepage-hero-more-row">
            <p className="light-color">Mi smo</p>
            <p className="names">Ema i Matija</p>
            <div className="arrow-icon" onMouseOver={handleMouseOver}>
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
