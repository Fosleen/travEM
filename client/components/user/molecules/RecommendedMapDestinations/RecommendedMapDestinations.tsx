import { useEffect, useState } from "react";
import DestinationItem from "../../atoms/DestinationItem";
import "./RecommendedMapDestinations.scss";
import { getAboveMapPlaces } from "../../../../utils/map";
import { Nullable, PlacesData } from "../../../../common/types";

const RecommendedMapDestinations = () => {
  const [places, setPlaces] = useState<Nullable<Array<PlacesData>>>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAboveMapPlaces();
      setPlaces(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  return (
    <div className="recommended-map-destinations-container">
      <h2>Otkrij</h2>
      {places && (
        <div className="recommended-map-destinations-wrapper">
          {places.map(
            (el, index) =>
              el.country && (
                <DestinationItem
                  key={index}
                  mapItem={true}
                  name={el.name}
                  iconUrl={el.map_icon}
                  countryName={el.country.name}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendedMapDestinations;
