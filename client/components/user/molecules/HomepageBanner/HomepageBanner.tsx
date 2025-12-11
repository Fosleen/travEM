import Button from "../../../atoms/Button";
import HorizontalPostItem from "../../atoms/HorizontalPostItem";
import "./HomepageBanner.scss";
import { FC } from "react";
import { Article, HomepageData } from "../../../../common/types";
import Image from "next/image";

const HomepageBanner: FC<{
  homepageContent: HomepageData;
  homepageArticles: Array<Article>;
}> = ({ homepageContent, homepageArticles }) => {
  return (
    <div className="homepage-banner-container">
      <div className="homepage-banner-bg-image">
        <div className="overlay"></div>
        <Image
          src={homepageContent.banner_image_url}
          alt="image-banner-bg"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="homepage-banner-wrapper">
        <div className="homepage-banner-left">
          <h4>{homepageContent.banner_small_text}</h4>
          <h2>{homepageContent.banner_title}</h2>
          <p>{homepageContent.banner_description}</p>
          <Button
            primary
            fitText={false}
            onClick={() => {
              window.open(homepageContent.button_url, "_blank");
            }}
          >
            {homepageContent.button_text}
          </Button>
        </div>
        <div className="homepage-banner-right">
          <div className="homepage-banner-right-content">
            {homepageArticles.map((el, index) => (
              <HorizontalPostItem article={el} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageBanner;
