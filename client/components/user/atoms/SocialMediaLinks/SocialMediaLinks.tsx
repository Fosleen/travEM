import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";
import "./SocialMediaLinks.scss";

const SocialMediaLinks = () => {
  return (
    <div className="socials-container" aria-label="Društvene mreže">
      <div className="socials-group">
        <a
          href="https://www.youtube.com/@travem?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="putujEM s travEM YouTube"
        >
          <div className="socials-item shared youtube" data-tooltip="Naš YouTube">
            <YoutubeLogo weight="regular" />
          </div>
        </a>

        <a
          href="https://www.facebook.com/putujemstravem"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="putujEM s travEM Facebook"
        >
          <div className="socials-item shared" data-tooltip="Naš Facebook">
            <FacebookLogo weight="regular" />
          </div>
        </a>

        <a
          href="https://www.instagram.com/putujem_s_travem/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="putujEM s travEM Instagram"
        >
          <div className="socials-item shared" data-tooltip="Naš Instagram">
            <InstagramLogo weight="regular" />
          </div>
        </a>

        <a
          href="https://www.tiktok.com/@putujem_s_travem"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="putujEM s travEM TikTok"
        >
          <div className="socials-item shared" data-tooltip="Naš TikTok">
            <TiktokLogo weight="regular" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
