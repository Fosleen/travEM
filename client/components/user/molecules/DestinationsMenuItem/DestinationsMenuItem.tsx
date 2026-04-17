// @ts-nocheck

import { CaretRight } from "@phosphor-icons/react";
import DestinationItem from "../../atoms/DestinationItem";
import "./DestinationsMenuItem.scss";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
import { getCountriesByContinent } from "../../../../utils/countries";
import { getPlacesByCountry } from "../../../../utils/places";
import { CountryContext } from "@/context/CountryContext";

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/ž/g, "z")
    .replace(/š/g, "s")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};

const normalizePlacesResponse = (response: any) => {
  if (!response) return [];

  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.rows)) return response.rows;
  if (Array.isArray(response.places)) return response.places;

  return [];
};

const DestinationsMenuItem: FC<{
  title: string;
  id: number;
}> = ({ title, id }) => {
  const [countries, setCountries] = useState([]);
  const [placesByCountry, setPlacesByCountry] = useState<Record<number, any[]>>(
    {}
  );

  const {
    countriesByContinentContextData,
    setCountriesByContinentContextData,
  } = useContext(CountryContext);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchPlacesForCountries = async (countriesData: any[]) => {
    try {
      const entries = await Promise.all(
        countriesData.map(async (country) => {
          try {
            const response = await getPlacesByCountry(country.id);
            const places = normalizePlacesResponse(response);

            return [country.id, places];
          } catch (error) {
            console.error(
              `Error while fetching places for country ${country.id}:`,
              error
            );
            return [country.id, []];
          }
        })
      );

      const mappedPlaces = Object.fromEntries(entries);
      setPlacesByCountry(mappedPlaces);
    } catch (error) {
      console.error("Error while fetching places:", error);
    }
  };

  const fetchData = async () => {
    try {
      let data: any = [];

      if (!countriesByContinentContextData) {
        data = await getCountriesByContinent(id);
        setCountriesByContinentContextData((prevState) => [
          ...(prevState || []),
          {
            id: id,
            data: data,
          },
        ]);
      } else {
        const continentData = countriesByContinentContextData.find(
          (el) => el.id === id
        );

        if (continentData) {
          data = continentData.data;
        } else {
          data = await getCountriesByContinent(id);
          setCountriesByContinentContextData((prevState) => [
            ...(prevState || []),
            {
              id: id,
              data: data,
            },
          ]);
        }
      }

      setCountries(data);
      fetchPlacesForCountries(data);
    } catch (error) {
      console.error("Error while fetching:", error);
    }
  };

  return (
    <div className="destinations-menu-item-container">
      <div className="destinations-menu-item-header">
        <Link href={`/kontinent/${id}`}>
          <h2>{title}</h2>
          <CaretRight size={32} color="#1abb6f" weight="duotone" />
        </Link>
      </div>
      <hr />

      {countries && (
        <div className="destinations-menu-items">
          {countries
            .sort(
              (
                a: { id: number; name: string; flag_image_url: string },
                b: { id: number; name: string; flag_image_url: string }
              ) => a.name.localeCompare(b.name)
            )
            .map(
              (
                el: { id: number; name: string; flag_image_url: string },
                index
              ) => {
                const places = placesByCountry[el.id] || [];
                const countrySlug = slugify(el.name);

                return (
                  <div className="destination-country-block" key={index}>
                    <div
                      className={`destination-country-group-surface ${
                        places.length > 0
                          ? "destination-country-group-surface--with-cities"
                          : ""
                      }`}
                    >
                      <DestinationItem
                        filterMenuItem
                        name={el.name}
                        iconUrl={el.flag_image_url}
                      />

                      <div className="destination-city-slot">
                        {places.length > 0 ? (
                          <div className="destination-city-chips">
                            {places.map((place: { id: number; name: string }) => (
                              <Link
                                key={place.id}
                                href={`/destinacija/${countrySlug}/${slugify(
                                  place.name
                                )}`}
                                className="destination-city-chip"
                              >
                                {place.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="destination-city-placeholder" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      )}
    </div>
  );
};

export default DestinationsMenuItem;