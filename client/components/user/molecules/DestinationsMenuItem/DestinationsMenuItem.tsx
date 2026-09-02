// @ts-nocheck

import { CaretRight, Compass } from "@phosphor-icons/react";
import DestinationItem from "../../atoms/DestinationItem";
import "./DestinationsMenuItem.scss";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
import { getCountriesByContinent } from "../../../../utils/countries";
import { getPlacesByCountry } from "../../../../utils/places";
import { CountryContext } from "@/context/CountryContext";
import { toUrlSlug } from "@/utils/url";

const PLACES_CACHE_KEY = "destinations-menu-places-cache-v2";
const PLACES_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 sata
const MOBILE_VISIBLE_COUNTRIES_COUNT = 5;

const normalizePlacesResponse = (response: any) => {
  if (!response) return [];

  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.rows)) return response.rows;
  if (Array.isArray(response.places)) return response.places;

  return [];
};

const getCachedPlaces = () => {
  if (typeof window === "undefined") return {};

  try {
    const rawCache = localStorage.getItem(PLACES_CACHE_KEY);

    if (!rawCache) return {};

    const parsedCache = JSON.parse(rawCache);

    if (!parsedCache?.createdAt || !parsedCache?.data) {
      localStorage.removeItem(PLACES_CACHE_KEY);
      return {};
    }

    const isExpired = Date.now() - parsedCache.createdAt > PLACES_CACHE_TTL;

    if (isExpired) {
      localStorage.removeItem(PLACES_CACHE_KEY);
      return {};
    }

    return parsedCache.data;
  } catch (error) {
    console.error("Error while reading places cache:", error);
    localStorage.removeItem(PLACES_CACHE_KEY);
    return {};
  }
};

const setCachedPlaces = (placesData: Record<number, any[]>) => {
  if (typeof window === "undefined") return;

  try {
    const existingCache = getCachedPlaces();
    const successfulPlaces = Object.fromEntries(
      Object.entries(placesData).filter(
        ([, places]) => Array.isArray(places) && places.length > 0
      )
    );

    if (Object.keys(successfulPlaces).length === 0) return;

    localStorage.setItem(
      PLACES_CACHE_KEY,
      JSON.stringify({
        createdAt: Date.now(),
        data: {
          ...existingCache,
          ...successfulPlaces,
        },
      })
    );
  } catch (error) {
    console.error("Error while saving places cache:", error);
  }
};

const getCountryCountLabel = (count: number) => {
  if (count === 1) return "državu";

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    [2, 3, 4].includes(lastDigit) &&
    ![12, 13, 14].includes(lastTwoDigits)
  ) {
    return "države";
  }

  return "država";
};

const getContinentGenitive = (continentName: string) => {
  const normalizedName = continentName.trim().toLowerCase();

  const continentGenitives: Record<string, string> = {
    europa: "Europe",
    azija: "Azije",
    afrika: "Afrike",
    "sjeverna amerika": "Sjeverne Amerike",
    "sj. amerika": "Sjeverne Amerike",
    "južna amerika": "Južne Amerike",
    "j. amerika": "Južne Amerike",
    australija: "Australije",
    oceanija: "Oceanije",
    antarktika: "Antarktike",
  };

  return continentGenitives[normalizedName] || continentName;
};

const DestinationsMenuItem: FC<{
  title: string;
  id: number;
}> = ({ title, id }) => {
  const [countries, setCountries] = useState([]);
  const [placesByCountry, setPlacesByCountry] = useState<Record<number, any[]>>(
    {}
  );
  const [isMobileCountriesExpanded, setIsMobileCountriesExpanded] =
    useState(false);

  const {
    countriesByContinentContextData,
    setCountriesByContinentContextData,
  } = useContext(CountryContext);

  useEffect(() => {
    fetchData();
    setIsMobileCountriesExpanded(false);
  }, [id]);

  const fetchPlacesForCountries = async (countriesData: any[]) => {
    try {
      const cachedPlaces = getCachedPlaces();

      const initialPlacesFromCache = countriesData.reduce(
        (acc: Record<number, any[]>, country) => {
          if (
            Array.isArray(cachedPlaces[country.id]) &&
            cachedPlaces[country.id].length > 0
          ) {
            acc[country.id] = cachedPlaces[country.id];
          }

          return acc;
        },
        {}
      );

      if (Object.keys(initialPlacesFromCache).length > 0) {
        setPlacesByCountry((prevState) => ({
          ...prevState,
          ...initialPlacesFromCache,
        }));
      }

      const countriesWithoutCache = countriesData.filter(
        (country) =>
          !Array.isArray(cachedPlaces[country.id]) ||
          cachedPlaces[country.id].length === 0
      );

      if (countriesWithoutCache.length === 0) {
        return;
      }

      const entries = await Promise.all(
        countriesWithoutCache.map(async (country) => {
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

      setPlacesByCountry((prevState) => ({
        ...prevState,
        ...mappedPlaces,
      }));

      setCachedPlaces(mappedPlaces);
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

  const sortedCountries = countries
    ? [...countries].sort(
        (
          a: { id: number; name: string; flag_image_url: string; is_new?: boolean },
          b: { id: number; name: string; flag_image_url: string; is_new?: boolean }
        ) => a.name.localeCompare(b.name)
      )
    : [];

  const mobileVisibleCountries = sortedCountries.slice(
    0,
    MOBILE_VISIBLE_COUNTRIES_COUNT
  );

  const mobileHiddenCountries = sortedCountries.slice(
    MOBILE_VISIBLE_COUNTRIES_COUNT
  );

  const hiddenCountriesCount = mobileHiddenCountries.length;
  const continentGenitive = getContinentGenitive(title);

  const renderCountryBlock = (
    el: { id: number; name: string; flag_image_url: string; is_new?: boolean; is_hit?: boolean },
    index?: number
  ) => {
    const places = placesByCountry[el.id] || [];
    const countrySlug = toUrlSlug(el.name);

    return (
      <div
        className={`destination-country-block ${
          places.length > 0
            ? "destination-country-block--with-cities"
            : "destination-country-block--no-cities"
        }`}
        key={el.id}
        style={
          typeof index === "number"
            ? ({ "--destination-reveal-index": index } as React.CSSProperties)
            : undefined
        }
      >
        {places.length > 0 ? (
          <div className="destination-country-group-surface destination-country-group-surface--with-cities">
            <DestinationItem
              filterMenuItem
              name={el.name}
              iconUrl={el.flag_image_url}
              badgeText={el.is_new ? "Novo" : undefined}
              badgeEndText={el.is_hit ? "Hit" : undefined}
              badgeEndVariant="hit"
            />

            <div className="destination-city-slot">
              <div className="destination-city-chips">
                {places.map((place: { id: number; name: string }) => (
                  <Link
                    key={place.id}
                    href={`/destinacija/${countrySlug}/${toUrlSlug(place.name)}`}
                    className="destination-city-chip"
                  >
                    {place.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <DestinationItem
            filterMenuItem
            name={el.name}
            iconUrl={el.flag_image_url}
            badgeText={el.is_new ? "Novo" : undefined}
            badgeEndText={el.is_hit ? "Hit" : undefined}
            badgeEndVariant="hit"
          />
        )}
      </div>
    );
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
        <>
          <div className="destinations-menu-items destinations-menu-items--desktop">
            {sortedCountries.map((country) => renderCountryBlock(country))}
          </div>

          <div className="destinations-menu-items destinations-menu-items--mobile">
            {mobileVisibleCountries.map((country) => renderCountryBlock(country))}

            {hiddenCountriesCount > 0 && (
              <>
                <div
                  className={`destinations-menu-hidden-countries ${
                    isMobileCountriesExpanded
                      ? "destinations-menu-hidden-countries--expanded"
                      : ""
                  }`}
                >
                  {mobileHiddenCountries.map((country, index) =>
                    renderCountryBlock(country, index)
                  )}
                </div>

                <button
                  type="button"
                  className={`destinations-menu-show-more ${
                    isMobileCountriesExpanded
                      ? "destinations-menu-show-more--expanded"
                      : ""
                  }`}
                  onClick={() =>
                    setIsMobileCountriesExpanded((prevState) => !prevState)
                  }
                  aria-expanded={isMobileCountriesExpanded}
                >
                  <span className="destinations-menu-show-more-icon">
                    <Compass size={20} color="#2da580" weight="duotone" />
                  </span>

                  <span>
                    {isMobileCountriesExpanded
                      ? `Prikaži manje država ${continentGenitive}`
                      : `Otkrij još ${hiddenCountriesCount} ${getCountryCountLabel(
                          hiddenCountriesCount
                        )} ${continentGenitive}`}
                  </span>

                  <CaretRight
                    className="destinations-menu-show-more-arrow"
                    size={22}
                    color="#2da580"
                    weight="bold"
                  />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationsMenuItem;
