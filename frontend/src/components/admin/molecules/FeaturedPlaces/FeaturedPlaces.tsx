import { FC } from "react";
import "./FeaturedPlaces.scss";

const FeaturedPlaces: FC<{ isOnMapSelected: boolean }> = ({
  isOnMapSelected,
}) => {
  return (
    <div className="featured-places-container">
      <h3>
        {isOnMapSelected
          ? "Istaknuta mjesta na karti"
          : "Istaknuto iznad karte (max. 6, dopušteno samo mjestima s ikonom)"}
      </h3>
    </div>
  );
};

export default FeaturedPlaces;
