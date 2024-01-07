import { useCallback, useMemo, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../../atoms/Pin/Pin";
import "./Map.scss";
import CITIES from "./cities";

const MapNew = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const [cursor, setCursor] = useState<string>("auto");

  const onClick = useCallback((event) => {
    const feature = event.features && event.features[0];

    if (feature) {
      window.alert(`Clicked layer ${feature.layer.id}`); // eslint-disable-line no-alert
    }
  }, []);

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <div className="map-parent-wrapper">
      <Map
        initialViewState={{
          latitude: 51.1657,
          longitude: 10.4515,
          zoom: 3,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken="pk.eyJ1IjoidHJhdmVtIiwiYSI6ImNscjN6b21hZzFwYzYyaW15NHR1MGF2c3YifQ.i0zgKxn9bundlWQQasv_rA"
        scrollZoom={false}
        onClick={onClick}
        cursor={cursor}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}
      </Map>
    </div>
  );
};

export default MapNew;
