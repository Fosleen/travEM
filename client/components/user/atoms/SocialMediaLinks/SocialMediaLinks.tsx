import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";
import "./SocialMediaLinks.scss";

const socials = [
  { name: "YouTube", href: "https://www.youtube.com/@travem?sub_confirmation=1", Icon: YoutubeLogo },
  { name: "Facebook", href: "https://www.facebook.com/putujemstravem", Icon: FacebookLogo },
  { name: "Instagram", href: "https://www.instagram.com/putujem_s_travem/", Icon: InstagramLogo },
  { name: "TikTok", href: "https://www.tiktok.com/@putujem_s_travem", Icon: TiktokLogo },
];

const SocialMediaLinks = () => {
  return (
    <div className="socials-container" aria-label="Društvene mreže">
      <div className="socials-group">
        {socials.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`putujEM s travEM ${name}`}
          >
            <div
              className={name === "YouTube" ? "socials-item youtube" : "socials-item"}
              data-tooltip={`Naš ${name}`}
            >
              <Icon weight="regular" aria-hidden="true" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
