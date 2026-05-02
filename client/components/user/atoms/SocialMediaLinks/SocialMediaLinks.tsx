import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import "./SocialMediaLinks.scss";

const SocialMediaLinks = () => {
  return (
    <div className="socials-container" aria-label="Društvene mreže">
      <div className="socials-group socials-group-shared">
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
      </div>

      <div className="socials-group socials-group-personal">
        <div className="personal-cluster male-cluster">
          <a
            href="https://www.instagram.com/putujuci_paradoks/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matijin Instagram"
          >
            <div
              className="socials-item male personal"
              data-tooltip="Matijin Instagram"
            >
              <InstagramLogo weight="regular" />
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@putujuci_paradoks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matijin TikTok"
            className="cluster-hidden-link"
          >
            <div
              className="socials-item male personal cluster-hidden-item"
              data-tooltip="Matijin TikTok"
            >
              <TiktokLogo weight="regular" />
            </div>
          </a>
        </div>

        <div className="personal-cluster female-cluster">
          <a
            href="https://www.instagram.com/ema_only_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Emin Instagram"
          >
            <div
              className="socials-item female personal"
              data-tooltip="Emin Instagram"
            >
              <InstagramLogo weight="regular" />
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@ema_only_"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Emin TikTok"
            className="cluster-hidden-link"
          >
            <div
              className="socials-item female personal cluster-hidden-item"
              data-tooltip="Emin TikTok"
            >
              <TiktokLogo weight="regular" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLinks;