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
import CITIES from "./cities";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { countries } from "./visited_countries.ts";
import { FC } from "react";
import { getVisitedCountries, getVisitedPlaces } from "../../../api/map.ts";
import { MapCountriesData, VisitedPlacesData } from "../../../common/types.ts";

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  const [mapContent, setMapContent] = useState<MapCountriesData | null>(null);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlacesData | null>(
    []
  );

  const [matchingCountries, setMatchingCountries] = useState([]);

  const fetchData = async () => {
    try {
      const content = await getVisitedCountries();
      const visitedPlaces = await getVisitedPlaces();
      setMapContent(content);
      setVisitedPlaces(visitedPlaces);

      console.log("Posjecena mjesta su", visitedPlaces);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignoreS
      const visitedCountries = content.map((country) => {
        const eng_name =
          country.name.charAt(0).toUpperCase() + country.name.slice(1);
        const cro_name = countries.some((c) => c.eng_name === eng_name)
          ? country.name
          : eng_name;

        return { eng_name, cro_name };
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignoreS
      const matchingCountries = countries.filter((country) =>
        visitedCountries.some(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignoreS
          (visitedCountry) => visitedCountry.cro_name === country.cro_name
        )
      );

      console.log(matchingCountries);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignoreS
      setMatchingCountries(matchingCountries);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  const onClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignoreS
    async (event) => {
      //  console.log(mapRef);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignoreS
      // eslint-disable-next-line
      const map = mapRef.current.getMap();
      const features = await map.queryRenderedFeatures(event.point, {
        layers: [layerId],
      });

      if (features.length > 0) {
        const clickedCountryName = features[0].properties.name;

        // Check if the clicked country is in the list
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  const onHover = useCallback(async (event) => {
    //   console.log(mapRef);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignoreS
    // eslint-disable-next-line
    const map = mapRef.current.getMap();
    const features = await map.queryRenderedFeatures(event.point, {
      layers: [layerId],
    });

    if (features.length > 0) {
      const hovered = features[0].properties.name;
      //console.log(`hoverano na ${hovered}`);

      setHoveredCountry(hovered);
      setCursor("pointer"); // nekak bi da se ovo i makne ak nije vise hoverana drzava (ostane zadnja hoverana i pointer kursor)
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
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignoreS
            // eslint-disable-next-line
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    [visitedPlaces]
  );

  const [popupInfo, setPopupInfo] = useState(null);

  console.log("Matching Countries Array:", matchingCountries);

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
                "#218161", // Hovered country color
                [
                  "in",
                  ["get", "name"],
                  [
                    "literal",
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignoreS
                    matchingCountries.map((country) => country.eng_name),
                  ],
                ],
                "#d2eb64", // Visited country color
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
