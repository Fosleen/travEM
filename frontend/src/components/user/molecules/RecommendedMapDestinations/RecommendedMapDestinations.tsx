import DestinationItem from "../../atoms/DestinationItem";
import "./RecommendedMapDestinations.scss";

const RecommendedMapDestinations = () => {
  return (
    <div className="recommended-map-destinations-container">
      <h2>Otkrij</h2>
      <div className="recommended-map-destinations-wrapper">
        <DestinationItem mapItem={true} />
        <DestinationItem mapItem={true} />
        <DestinationItem mapItem={true} />
        <DestinationItem mapItem={true} />
        <DestinationItem mapItem={true} />
        <DestinationItem mapItem={true} />
      </div>
    </div>
  );
};

export default RecommendedMapDestinations;
