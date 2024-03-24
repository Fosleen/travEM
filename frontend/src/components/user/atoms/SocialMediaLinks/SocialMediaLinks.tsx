import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import "./SocialMediaLinks.scss";

const SocialMediaLinks = () => {
  return (
    <div className="socials-container">
      <a href="https://www.youtube.com/@travem?sub_confirmation=1" target="_blank">
        <div className="socials-item green">
          <YoutubeLogo color="#2F2936" />
        </div>
      </a>
      <a href="https://www.facebook.com/putujemstravem" target="_blank">
        <div className="socials-item blue">
          <FacebookLogo color="#FFFFFF" />
        </div>
      </a>
      <a href="https://www.instagram.com/travel_paradox" target="_blank">
        <div className="socials-item blue">
          <InstagramLogo color="#FFFFFF" />
        </div>
      </a>
      <a href="https://www.instagram.com/ema_only_/" target="_blank">
        <div className="socials-item blue">
          <InstagramLogo color="#FFFFFF" />
        </div>
      </a>
      <a href="https://www.tiktok.com/@ema_only_" target="_blank">
        <div className="socials-item blue">
          <TiktokLogo color="#FFFFFF" />
        </div>
      </a>
    </div>
  );
};

export default SocialMediaLinks;
