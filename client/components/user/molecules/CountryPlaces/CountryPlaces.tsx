// @ts-nocheck

import "./CountryPlaces.scss";
import Image from "next/image";
import Link from "next/link";
import { getCountryGenitive } from "@/utils/countryGrammar";

const chunkPlacesForDesktop = (places) => {
  const total = places.length;

  if (total <= 4) return [places];
  if (total === 5) return [places.slice(0, 2), places.slice(2)];
  if (total === 6) return [places.slice(0, 3), places.slice(3)];
  if (total === 7) return [places.slice(0, 3), places.slice(3)];
  if (total === 8) return [places.slice(0, 4), places.slice(4)];

  const rows = [];
  let remaining = [...places];

  while (remaining.length > 0) {
    const left = remaining.length;

    if (left === 5) {
      rows.push(remaining.slice(0, 2));
      rows.push(remaining.slice(2));
      break;
    }

    if (left === 6) {
      rows.push(remaining.slice(0, 3));
      rows.push(remaining.slice(3));
      break;
    }

    if (left === 7) {
      rows.push(remaining.slice(0, 3));
      rows.push(remaining.slice(3));
      break;
    }

    if (left === 8) {
      rows.push(remaining.slice(0, 4));
      rows.push(remaining.slice(4));
      break;
    }

    if (left <= 4) {
      rows.push(remaining);
      break;
    }

    rows.push(remaining.slice(0, 4));
    remaining = remaining.slice(4);
  }

  return rows;
};

const CountryPlaces = ({ places = [], countryName }) => {
  if (!places?.length) return null;

  const countryNameInGenitive = getCountryGenitive(countryName);
  const desktopRows = chunkPlacesForDesktop(places);

  const getPlaceHref = (placeName) =>
    `/destinacija/${encodeURIComponent(
      countryName.toLowerCase()
    )}/${encodeURIComponent(placeName.toLowerCase())}`;

  return (
    <section className="country-places-container">
      <div className="country-places-header">
        <h2>Istražite gradove {countryNameInGenitive}</h2>
      </div>

      {/* Mobile / tablet */}
      <div className="country-places-list country-places-list-mobile">
        {places.map((el, index) => (
          <Link
            href={getPlaceHref(el.name)}
            className="country-place-card country-place-card-mobile"
            key={el.id || el.name || index}
          >
            <div className="country-place-card-image">
              <Image
                src={el.main_image_url}
                alt={el.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1199px) 50vw, 25vw"
              />
            </div>

            <div className="country-place-card-overlay">
              <div className="country-place-card-content">
                <h3>{el.name}</h3>

                {el.description && <p>{el.description}</p>}

                <span className="country-place-card-cta">
                  Otkrij više
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop */}
      <div className="country-places-desktop">
        {desktopRows.map((row, rowIndex) => (
          <div
            className={`country-places-row country-places-row-${row.length}`}
            key={rowIndex}
          >
            {row.map((el, index) => (
              <Link
                href={getPlaceHref(el.name)}
                className="country-place-card country-place-card-desktop"
                key={el.id || `${el.name}-${rowIndex}-${index}`}
              >
                <div className="country-place-card-image">
                  <Image
                    src={el.main_image_url}
                    alt={el.name}
                    fill
                    sizes="(max-width: 768px) 82vw, (max-width: 1199px) 40vw, 25vw"
                  />
                </div>

                <div className="country-place-card-overlay">
                  <h3>{el.name}</h3>
                  {el.description && <p>{el.description}</p>}
                  <span className="country-place-card-cta">Otkrij više</span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CountryPlaces;