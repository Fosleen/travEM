import { useCallback, useMemo, useRef, useState } from "react";
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

interface DestinationsMapProps {
  initialLongitude: number;
  initialLatitude: number;
}
const DestinationsMap: FC<DestinationsMapProps> = ({
  initialLongitude,
  initialLatitude,
}) => {
  const [popupInfo, setPopupInfo] = useState(null);

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
  // eslint-disable-next-line
  const onClick = useCallback(async (event) => {
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

      // Extract the English and Croatian names from the countries array
      const countryNames = countries.map((country) => ({
        eng_name: country.eng_name.trim(),
        cro_name: country.cro_name.trim(),
      }));

      // Check if the clicked country is in the list
      const isCountryInList = countryNames.some(
        (country) =>
          country.eng_name === clickedCountryName ||
          country.cro_name === clickedCountryName
      );

      if (isCountryInList) {
        navigate(`/destinacija/${clickedCountryName}`);
      } else {
        navigate("/nema-drzave");
      }
    }
  }, []);

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
      CITIES.map((city, index) => (
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
    []
  );

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
                ["==", ["get", "name"], "Austria"],
                "#d2eb64",
                ["==", ["get", "name"], hoveredCountry],
                "#218161", // hoverana
                "#f8f8f8", // ostale o kojima nema clanaka
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
              <Link to={`/destinacija/${popupInfo["city"]}`} target="_new">
                {popupInfo["city"]}
              </Link>
            </div>
            <Link to={`/destinacija/${popupInfo["city"]}`} target="_new">
              <img
                width="100%"
                src="https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/06/26/18/porto-main.jpg"
              />
            </Link>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default DestinationsMap;
