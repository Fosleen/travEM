import { useEffect, useState } from "react";
import DestinationsMap from "../../../components/organisms/DestinationsMap/DestinationsMap";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";

import "./Continent.scss";
import { getCountriesByContinent } from "../../../api/countries";
import { useParams } from "react-router-dom";
import { getContinentById } from "../../../api/continents";
import { ContinentsData } from "../../../common/types";

const Continent = () => {
  const { id } = useParams();
  const [continent, setContinent] = useState<ContinentsData | null>();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      if (id) {
        setContinent(null);
        setCountries([]);

        const continentData = await getContinentById(parseInt(id));
        setContinent(continentData);
        const countriesData = await getCountriesByContinent(parseInt(id));
        setCountries(countriesData);
      }
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  return (
    <div className="continent-page-wrapper">
      {continent && countries && (
        <>
          <div className="continent-text-wrapper">
            <h2>{continent.name}</h2>
          </div>
          <DestinationsMap
            initialLatitude={continent.latitude}
            initialLongitude={continent.longitude}
            initialZoom={continent.zoom}
            showOnlyFeatured={false}
          />
          <div className="continent-page-recommended-wrapper">
            {countries.map((el, index) => (
              <HorizontalPostItemBig
                thin
                hasDate={false}
                data={el}
                type="country"
                key={index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Continent;
