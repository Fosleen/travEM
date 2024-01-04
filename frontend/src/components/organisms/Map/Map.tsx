import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Map.scss";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import WorldCountries from "../Map/features.json";

const Map = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();

  const handleCountryClick = (geo) => {
    const countryName = geo.properties.name;
    setSelectedCountry(countryName);
    // Navigate to the URL based on the country name
    navigate(`/${countryName}`);
  };

  const handleCountryHover = (geo, isHovered) => {
    setSelectedCountry(isHovered ? geo.properties.name : null);
  };

  return (
    <div className="map-parent-wrapper">
      <ComposableMap>
        <ZoomableGroup center={[15, 50]} zoom={4} minZoom={2} maxZoom={8}>
          <rect width="100%" height="100%" fill="#73b6e6" />
          <Geographies geography={WorldCountries}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    selectedCountry === geo.properties.name
                      ? "#2BAC82"
                      : "white"
                  }
                  stroke="grey"
                  strokeOpacity={0.05}
                  onMouseEnter={() => handleCountryHover(geo, true)}
                  onMouseLeave={() => handleCountryHover(geo, false)}
                  onClick={() => handleCountryClick(geo)}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default Map;
