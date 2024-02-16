import Button from "../../../atoms/Button";
import HorizontalPostItem from "../../atoms/HorizontalPostItem";
import "./HomepageBanner.scss";
import { FC } from "react";
import { Article, HomepageData } from "../../../../common/types";

const HomepageBanner: FC<{
  homepageContent: HomepageData;
  homepageArticles: Array<Article>;
}> = ({ homepageContent, homepageArticles }) => {
  return (
    <div className="homepage-banner-container">
      <div className="homepage-banner-bg-image">
        <div className="overlay"></div>
        <img src={homepageContent.banner_image_url} alt="image-banner-bg" />
      </div>
      <div className="homepage-banner-wrapper">
        <div className="homepage-banner-left">
          <h4>{homepageContent.banner_small_text}</h4>
          <h2>{homepageContent.banner_title}</h2>
          <p>{homepageContent.banner_description}</p>
          <Button primary fitText={false} onClick={() => {}}>
            {homepageContent.button_text}
          </Button>
        </div>
        <div className="homepage-banner-right">
          <div className="homepage-banner-right-content">
            {homepageArticles.map((el) => (
              <HorizontalPostItem article={el} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageBanner;
