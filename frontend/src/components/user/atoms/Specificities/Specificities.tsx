import "./Specificities.scss";
import { Dot } from "@phosphor-icons/react";
import icon1 from "../../../../assets/images/menu-icon.png";
import icon2 from "../../../../assets/images/teamwork-icon.png";
import { FC } from "react";
import { SpecificityProps } from "../../../../common/types";

const Specificities: FC<{
  iconNmbr: string;
  specificities: SpecificityProps;
}> = ({ iconNmbr, specificities }) => {
  return (
    <>
      {specificities && specificities.specificity_items && (
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
                <div className="country-highligth-title-color">
                  {specificities.title}
                </div>
                <div className="country-highligth-title-black">
                  {specificities.title}
                </div>
              </div>
              <div className="country-highligth-content">
                {specificities.specificity_items.map((el, index) => (
                  <div className="country-highligth-content-item" key={index}>
                    <div className="country-highlights-content-item-title">
                      <Dot size={32} color="#1abb6f" weight="duotone" />
                      <h4>{el.title}</h4>
                    </div>
                    <p>{el.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="country-highlight-right">
            {specificities &&
              specificities.specificity_images &&
              specificities.specificity_images.map((el, index) => (
                <div className="country-highlight-image-container" key={index}>
                  <img src={el.url} alt="country-highlight" />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Specificities;
