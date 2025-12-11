/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css?legacy";
import Pin from "../../atoms/Pin";
import "./DestinationsMap.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { countries } from "../../../utils/all_countries.ts";
import { FC } from "react";
import { getVisitedCountries, getVisitedPlaces } from "../../../api/map.ts";
import { DestinationsMapProps, PlacesData } from "../../../common/types.ts";
import { getPlaces } from "../../../api/places.ts";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl/mapbox";

const DestinationsMap: FC<DestinationsMapProps> = ({
  initialLongitude,
  initialLatitude,
  initialZoom = 3,
  showOnlyFeatured = true,
}) => {
  const geojsonUrl =
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson";
  const sourceId = "countries";
  const layerId = "country-fills";
  const router = useRouter();
  const mapRef = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [cursor, setCursor] = useState<string>("auto");
  const [visitedPlaces, setVisitedPlaces] = useState<PlacesData | null>([]);
  const [matchingCountries, setMatchingCountries] = useState([]);

  const fetchData = async () => {
    try {
      const content = await getVisitedCountries();
      let visitedPlaces;
      if (showOnlyFeatured) {
        visitedPlaces = await getVisitedPlaces();
        setVisitedPlaces(visitedPlaces);
      } else {
        visitedPlaces = await getPlaces(1, 1000);
        setVisitedPlaces(visitedPlaces.data);
      }
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
          router.push(`/destinacija/${isCountryInList.cro_name}`); // FIXED: Added parentheses
        } else {
          router.push("/nema-drzave");
        }
      }
    },
    [matchingCountries, router] // FIXED: Added router to dependencies
  );

  const onHover = useCallback(async (event) => {
    const map = mapRef.current.getMap();
    const features = await map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    });
    if (features.length > 0) {
      const hovered = features[0].properties.name;
      setHoveredCountry(hovered);
      setCursor("pointer");
    }
  }, []);

  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
      visitedPlaces.map((city, index) => (
        <Marker
          key={`marker-${index}`} // FIXED: Added curly braces
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

  return (
    <div className="map-parent-wrapper">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: Number(initialLatitude),
          longitude: Number(initialLongitude),
          zoom: Number(initialZoom),
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken="pk.eyJ1IjoidHJhdmVtIiwiYSI6ImNsdDc4dGR1dzBnbWYyam05cDlmbjNpMTAifQ.EkCtJKiZzE-Yux0ZmCpMhg"
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
                "#098f45",
                [
                  "in",
                  ["get", "name"],
                  [
                    "literal",
                    matchingCountries.map((country) => country.eng_name),
                  ],
                ],
                "#a9cf00",
                "#f8f8f8",
              ],
              "fill-opacity": 0.5,
            }}
          />
          <Layer
            id={`${layerId}-outline`} // FIXED: Added curly braces
            type="line"
            source={sourceId}
            paint={{
              "line-color": "#817c7c",
              "line-width": 1.5,
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
              <Link
                href={`/destinacija/${popupInfo.country.name}/${popupInfo.name}`} // FIXED: Added curly braces
                target="_blank"
              >
                {popupInfo["name"]}
              </Link>
            </div>
            <Link
              href={`/destinacija/${popupInfo.country.name}/${popupInfo.name}`} // FIXED: Added curly braces
            >
              <img
                width="100%"
                src={popupInfo.main_image_url}
                alt={popupInfo.name}
              />
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default DestinationsMap;
