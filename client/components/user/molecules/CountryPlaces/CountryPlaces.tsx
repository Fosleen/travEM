// @ts-nocheck

import DestinationItem from "../../atoms/DestinationItem";
import "./CountryPlaces.scss";
import Image from "next/image";

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
        <Image
          src="/images/world-map.jpg"
          alt="world-map"
          width={958}
          height={946}
        />
      </div>
    </div>
  );
};

export default CountryPlaces;
