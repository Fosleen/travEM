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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS

  const handleCountryClick = (geo) => {
    const countryName = geo.properties.name;
    setSelectedCountry(countryName);
    navigate(`/${countryName}`);
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  const handleCountryHover = (geo, isHovered) => {
    setSelectedCountry(isHovered ? geo.properties.name : null);
  };

  const coloredCountries = ["Germany", "France", "Spain", "Croatia"];

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
                      ? "#2BAC82" // Color for the selected country
                      : coloredCountries.includes(geo.properties.name)
                      ? "orange" // Color for specific countries
                      : "white" // Default color for other countries
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
        {/* <Marker coordinates={[45.80881, 15.9304]}>
          <PushPin color="red" size={24} weight="fill" />   markers dont work as they should
        </Marker> */}
      </ComposableMap>
    </div>
  );
};

export default Map;
