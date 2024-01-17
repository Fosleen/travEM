/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../../atoms/Pin/Pin";
import "./DestinationsMap.scss";

import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { countries } from "./visited_countries.ts";
import { FC } from "react";
import { getVisitedCountries, getVisitedPlaces } from "../../../api/map.ts";
import { PlacesData } from "../../../common/types.ts";

interface DestinationsMapProps {
  initialLongitude: number;
  initialLatitude: number;
}
const DestinationsMap: FC<DestinationsMapProps> = ({
  initialLongitude,
  initialLatitude,
}) => {
  const geojsonUrl =
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson";
  const sourceId = "countries";
  const layerId = "country-fills";
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [cursor, setCursor] = useState<string>("auto");

  const [visitedPlaces, setVisitedPlaces] = useState<PlacesData | null>([]);

  const [matchingCountries, setMatchingCountries] = useState([]);

  const fetchData = async () => {
    try {
      const content = await getVisitedCountries();
      const visitedPlaces = await getVisitedPlaces();
      setVisitedPlaces(visitedPlaces);
      // console.log("Posjecena mjesta su", visitedPlaces);

      const visitedCountries = content.map((country) => {
        const eng_name =
          country.name.charAt(0).toUpperCase() + country.name.slice(1);
        const cro_name = countries.some((c) => c.eng_name === eng_name)
          ? country.name
          : eng_name;

        return { eng_name, cro_name };
      });

      const matchingCountries = countries.filter((country) =>
        visitedCountries.some(
          (visitedCountry) => visitedCountry.cro_name === country.cro_name
        )
      );

      // console.log(matchingCountries);

      setMatchingCountries(matchingCountries);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClick = useCallback(
    async (event) => {
      const map = mapRef.current.getMap();
      const features = await map.queryRenderedFeatures(event.point, {
        layers: [layerId],
      });

      if (features.length > 0) {
        const clickedCountryName = features[0].properties.name;

        const isCountryInList = matchingCountries.find(
          (country) => country.eng_name === clickedCountryName
        );

        if (isCountryInList) {
          navigate(`/destinacija/${isCountryInList.cro_name}`);
        } else {
          navigate("/nema-drzave");
        }
      }
    },
    [matchingCountries]
  );

  const onHover = useCallback(async (event) => {
    const map = mapRef.current.getMap();
    const features = await map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    });

    if (features.length > 0) {
      const hovered = features[0].properties.name;
      //console.log(`hoverano na ${hovered}`);

      setHoveredCountry(hovered);
      setCursor("pointer");
    }
  }, []);

  const pins = useMemo(
    () =>
      visitedPlaces.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          onClick={(e) => {
            e.originalEvent.stopPropagation();

            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    [visitedPlaces]
  );

  const [popupInfo, setPopupInfo] = useState(null);

  // console.log("Matching Countries Array:", matchingCountries);

  return (
    <div className="map-parent-wrapper">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: Number(initialLatitude),
          longitude: Number(initialLongitude),
          zoom: 3,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken="pk.eyJ1IjoidHJhdmVtIiwiYSI6ImNscjN6b21hZzFwYzYyaW15NHR1MGF2c3YifQ.i0zgKxn9bundlWQQasv_rA"
        scrollZoom={false}
        onClick={onClick}
        onMouseMove={onHover}
        cursor={cursor}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        <Source id={sourceId} type="geojson" data={geojsonUrl}>
          <Layer
            id={layerId}
            type="fill"
            source={sourceId}
            paint={{
              "fill-color": [
                "case",
                ["==", ["get", "name"], hoveredCountry],
                "#098f45", // Hovered country color
                [
                  "in",
                  ["get", "name"],
                  [
                    "literal",

                    matchingCountries.map((country) => country.eng_name),
                  ],
                ],
                "#a9cf00", // Visited country color
                "#f8f8f8", // Default color for other countries
              ],
              "fill-opacity": 0.5,
            }}
          />
        </Source>

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo["longitude"])}
            latitude={Number(popupInfo["latitude"])}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <Link to={`/destinacija/${popupInfo["name"]}`} target="_new">
                {popupInfo["name"]}
              </Link>
            </div>
            <Link to={`/destinacija/${popupInfo["name"]}`} target="_new">
              <img width="100%" src={popupInfo.main_image_url} />
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default DestinationsMap;
