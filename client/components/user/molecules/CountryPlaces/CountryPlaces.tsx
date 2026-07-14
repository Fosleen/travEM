// @ts-nocheck

import "./CountryPlaces.scss";
import Image from "next/image";
import Link from "next/link";
import { getCountryGenitive } from "@/utils/countryGrammar";

const TAIL_SPLIT = {
  5: 2,
  6: 3,
  7: 3,
  8: 4,
};

const chunkPlacesForDesktop = (places) => {
  const rows = [];
  let remaining = [...places];

  while (remaining.length > 0) {
    const left = remaining.length;

    if (left <= 4) {
      rows.push(remaining);
      break;
    }

    if (TAIL_SPLIT[left]) {
      const splitIndex = TAIL_SPLIT[left];
      rows.push(remaining.slice(0, splitIndex));
      rows.push(remaining.slice(splitIndex));
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
        <h2>Istražite mjesta {countryNameInGenitive}</h2>
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