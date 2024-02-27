import { Dispatch, FC, SetStateAction } from "react";
import "./FeaturedMapPlaceSelector.scss";

const FeaturedMapPlaceSelector: FC<{
  isOnMapSelected: boolean;
  setIsOnMapSelected: Dispatch<SetStateAction<boolean>>;
}> = ({ isOnMapSelected, setIsOnMapSelected }) => {
  const toggleSelectedPlaceType = () => {
    setIsOnMapSelected(!isOnMapSelected);
  };

  return (
    <div className="featured-map-place-selector-container">
      <p
        className={`${isOnMapSelected && "selected"}`}
        onClick={toggleSelectedPlaceType}
      >
        Na karti
      </p>
      <p
        className={`${!isOnMapSelected && "selected"}`}
        onClick={toggleSelectedPlaceType}
      >
        Iznad karte
      </p>
    </div>
  );
};

export default FeaturedMapPlaceSelector;
