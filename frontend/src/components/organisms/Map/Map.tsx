import { useMemo } from "react";
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

const MapNew = () => {
  const CITIES = [
    {
      city: "Paris",
      state: "Île-de-France",
      latitude: 48.8566,
      longitude: 2.3522,
      image: "url_to_image_for_paris",
    },
    {
      city: "London",
      state: "England",
      latitude: 51.509865,
      longitude: -0.118092,
      image: "url_to_image_for_london",
    },
    {
      city: "Berlin",
      state: "Berlin",
      latitude: 52.52,
      longitude: 13.405,
      image: "url_to_image_for_berlin",
    },
    {
      city: "Rome",
      state: "Lazio",
      latitude: 41.9028,
      longitude: 12.4964,
      image: "url_to_image_for_rome",
    },
    {
      city: "Barcelona",
      state: "Catalonia",
      latitude: 41.3851,
      longitude: 2.1734,
      image: "url_to_image_for_barcelona",
    },
    {
      city: "Vienna",
      state: "Vienna",
      latitude: 48.8566,
      longitude: 16.3522,
      image: "url_to_image_for_vienna",
    },
    {
      city: "Athens",
      state: "Attica",
      latitude: 37.9838,
      longitude: 23.7275,
      image: "url_to_image_for_athens",
    },
    {
      city: "Prague",
      state: "Prague",
      latitude: 50.0755,
      longitude: 14.4378,
      image: "url_to_image_for_prague",
    },
    {
      city: "Stockholm",
      state: "Stockholm",
      latitude: 59.3293,
      longitude: 18.0686,
      image: "url_to_image_for_stockholm",
    },
    {
      city: "Lisbon",
      state: "Lisbon",
      latitude: 38.7223,
      longitude: -9.1393,
      image: "url_to_image_for_lisbon",
    },
  ];

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
          latitude: 51.1657, // Latitude for the center of Europe
          longitude: 10.4515, // Longitude for the center of Europe
          zoom: 3, // Adjust the zoom level as needed
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        mapboxAccessToken="pk.eyJ1IjoidHJhdmVtIiwiYSI6ImNscjN6b21hZzFwYzYyaW15NHR1MGF2c3YifQ.i0zgKxn9bundlWQQasv_rA"
        scrollZoom={false}
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
