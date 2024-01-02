import DestinationItem from "../../atoms/DestinationItem";
import worldMap from "../../../../assets/images/world-map.jpg";
import "./CountryPlaces.scss";

const CountryPlaces = () => {
  return (
    <div className="country-places-container">
      <h2>Proučite specifične lokacije</h2>
      <div className="country-places">
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
        <DestinationItem />
      </div>
      <div className="country-places-world-map-image">
        <img src={worldMap} alt="world-map" />
      </div>
    </div>
  );
};

export default CountryPlaces;
