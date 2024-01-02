import "./CountryHighlight.scss";
import postImage from "../../../../assets/images/post-image.jpg";
import postImagffoe from "../../../../assets/images/footer-image.jpg";
import food from "../../../../assets/images/food-image.jpg";
import { Dot } from "@phosphor-icons/react";
import icon1 from "../../../../assets/images/menu-icon.png";
import icon2 from "../../../../assets/images/teamwork-icon.png";

const CountryHighlight = ({ iconNmbr }) => {
  return (
    <div className="country-highligth-container">
      <div className="country-highligth-left">
        <div className="country-highlight-left-bg-image">
          {iconNmbr == "1" ? (
            <img src={icon1} alt="icon1" />
          ) : (
            <img src={icon2} alt="icon2" />
          )}
        </div>
        <div className="country-highligth-left-content">
          <div className="country-highligth-titles">
            <div className="country-highligth-title-color">hrana</div>
            <div className="country-highligth-title-black">hrana</div>
          </div>
          <div className="country-highligth-content">
            <div className="country-highligth-content-item">
              <div className="country-highlights-content-item-title">
                <Dot size={32} color="#1abb6f" weight="duotone" />
                <h4>kebabčina</h4>
              </div>
              <p>
                ova je hrana tijesto s umakom od paradajza i jako je fino njam
                njam
              </p>
            </div>
            <div className="country-highligth-content-item">
              <div className="country-highlights-content-item-title">
                <Dot size={32} color="#1abb6f" weight="duotone" />
                <h4>kebabčina</h4>
              </div>
              <p>
                ova je hrana tijesto s umakom od paradajza i jako je fino njam
                njam
              </p>
            </div>
            <div className="country-highligth-content-item">
              <div className="country-highlights-content-item-title">
                <Dot size={32} color="#1abb6f" weight="duotone" />
                <h4>kebabčina</h4>
              </div>
              <p>
                ova je hrana tijesto s umakom od paradajza i jako je fino njam
                njam
              </p>
            </div>
            <div className="country-highligth-content-item">
              <div className="country-highlights-content-item-title">
                <Dot size={32} color="#1abb6f" weight="duotone" />
                <h4>kebabčina</h4>
              </div>
              <p>
                ova je hrana tijesto s umakom od paradajza i jako je fino
                njamova je hrana tijesto s umakom od paradajza i jako je fino
                njam njam
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="country-highlight-right">
        <div className="country-highlight-image-container">
          <img src={postImage} alt="country-highlight" />
        </div>
        <div className="country-highlight-image-container">
          <img src={postImagffoe} alt="country-highlight" />
        </div>
        <div className="country-highlight-image-container">
          <img src={food} alt="country-highlight" />
        </div>
      </div>
    </div>
  );
};

export default CountryHighlight;
