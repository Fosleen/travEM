import Button from "../../../atoms/Button";
import HorizontalPostItem from "../../atoms/HorizontalPostItem";
import bgImage from "../../../../assets/images/post-image.jpg";
import "./HomepageBanner.scss";

const HomepageBanner = () => {
  return (
    <div className="homepage-banner-container">
      <div className="homepage-banner-bg-image">
        <div className="overlay"></div>
        <img src={bgImage} alt="image-banner-bg" />
      </div>
      <div className="homepage-banner-wrapper">
        <div className="homepage-banner-left">
          <h4>Gdje držiš sav svoj novac?</h4>
          <h2>U sjećanjima svojim.</h2>
          <p>
            Ako ste avanturističkog duha, ali ste ograničeni budžetom, na pravom
            ste mjestu. Pronađite savjete kako uštediti novac na putovanjima,
            ali i inspiraciju za nova putovanja koja će vas oduševiti.
          </p>
          <Button primary fitText={false} onClick={() => {}}>
            BUDGET FRIENDLY PUTOVANJA
          </Button>
        </div>
        <div className="homepage-banner-right">
          <div className="homepage-banner-right-content">
            <HorizontalPostItem />
            <HorizontalPostItem />
            <HorizontalPostItem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageBanner;
