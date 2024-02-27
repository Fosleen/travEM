// @ts-nocheck

import DestinationItem from "../../atoms/DestinationItem";
import worldMap from "../../../../assets/images/world-map.jpg";
import "./CountryPlaces.scss";

const CountryPlaces = ({ hasPadding = true, places = [], countryName }) => {
  return (
    <div className="country-places-container">
      <h2>Proučite specifične lokacije</h2>
      <div className={`country-places ${hasPadding && "has-padding"}`}>
        {places &&
          places.map((el, index) => (
            <DestinationItem
              name={el.name}
              countryName={countryName}
              key={index}
            />
          ))}
      </div>
      <div className="country-places-world-map-image">
        <img src={worldMap} alt="world-map" />
      </div>
    </div>
  );
};

export default CountryPlaces;
