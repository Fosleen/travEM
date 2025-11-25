import { FC } from "react";
import worldMap from "../../../../assets/images/world-map.jpg";
import "./Characteristics.scss";
import { CharacteristicProps } from "../../../../common/types";
import Image from "next/image";

const Characteristics: FC<{ characteristics: Array<CharacteristicProps> }> = ({
  characteristics,
}) => {
  return (
    <div className="characteristics-info-container">
      <div className="characteristics-world-map-image">
        <Image src={worldMap} alt="world-map" />
      </div>
      <div className="characteristics-info-content">
        <h2>Da vas ne iznenadi</h2>
        <div className="characteristics-info-items">
          {characteristics.map((el, index) => (
            <div className="characteristics-info-item" key={index}>
              <img src={el.characteristic_icon.url.trim()} alt="coins-icon" />
              <h5>{el.title}</h5>
              <p>{el.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Characteristics;
