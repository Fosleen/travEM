// @ts-nocheck
"use client";

import DestinationsMap from "../../../organisms/DestinationsMap";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";
import "./Continent.scss";
import { ContinentsData } from "../../../../common/types";

interface Country {
  id: number;
  name: string;
  description: string;
}

type ContinentProps = {
  initialContinent: ContinentsData;
  initialCountries: Country[];
};

const Continent = ({ initialContinent, initialCountries }: ContinentProps) => {
  return (
    <div className="continent-page-wrapper">
      <div className="continent-text-wrapper">
        <h1>{initialContinent.name}</h1>
      </div>
      <DestinationsMap
        initialLatitude={initialContinent.latitude}
        initialLongitude={initialContinent.longitude}
        initialZoom={initialContinent.zoom}
        showOnlyFeatured={false}
      />
      <div className="continent-page-recommended-wrapper">
        {initialCountries.map((el, index) => (
          <HorizontalPostItemBig
            thin
            hasDate={false}
            data={el}
            type="country"
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Continent;
