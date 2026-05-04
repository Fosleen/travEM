// @ts-nocheck
"use client";

import MainCountryPost from "../../atoms/MainCountryPost";
import DestinationHero from "../../molecules/DestinationHero";
import "./DestinationCountry.scss";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";
import CountryPlaces from "../../molecules/CountryPlaces";
import VisaInfo from "../../molecules/VisaInfo";
import DestinationVideos from "../../molecules/DestinationVideos";
import RecommendedPosts from "../../molecules/RecommendedPosts";
import Characteristics from "../../atoms/Characteristics";
import Specificities from "../../atoms/Specificities";
import { CountriesData } from "@/common/types";

import BestTimeToVisit from "../../molecules/BestTimeToVisit/BestTimeToVisit";

interface DestinationCountryProps {
  initialCountry: CountriesData;
  initialFavoriteArticle: any;
  countryName: string;
}

const safeDecodeURIComponent = (value: string) => {
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
};

const DestinationCountry = ({
  initialCountry,
  initialFavoriteArticle,
  countryName,
}: DestinationCountryProps) => {
  const country = initialCountry;
  const favoriteArticle = initialFavoriteArticle;

  const decodedCountryName = safeDecodeURIComponent(countryName);

  return (
    <div className="destination-country-page-container">
      {country.color && (
        <DestinationHero
          name={country.name}
          main_image_url={country.main_image_url}
          description={country.description}
          color={country.color.hex_value}
        />
      )}

      <div className="destination-country-places-container">
        {country && country.places && country.places.length > 0 && (
          <CountryPlaces places={country.places} countryName={country.name} />
        )}
      </div>

      <BestTimeToVisit
        countrySlug={decodedCountryName || country.name}
        countryId={country.id}
      />

      <div className="destination-country-visa-info-container">
        <VisaInfo countryId={country.id} countryName={country.name} />
      </div>

      <div className="destination-country-upper-container">
        {country.characteristics && (
          <div className="destination-country-upper-container-item">
            <Characteristics characteristics={country.characteristics} />
          </div>
        )}

        {favoriteArticle && (
          <div className="destination-country-upper-container-item">
            <MainCountryPost article={favoriteArticle} />
          </div>
        )}
      </div>

      {country.articles && country.articles.length > 0 && (
        <div className="destination-country-posts-container">
          <h2>Pročitajte naše članke</h2>

          <div className="destination-country-posts">
            {country.articles.map((el, index) => (
              <HorizontalPostItemBig
                thin
                hasDate={false}
                data={el}
                key={index}
              />
            ))}
          </div>
        </div>
      )}

      {country.specificities && country.specificities.length > 0 && (
        <div className="destination-country-highlights-container">
          <Specificities
            iconNmbr={"1"}
            specificities={country.specificities[0]}
          />
          <Specificities
            iconNmbr={"2"}
            specificities={country.specificities[1]}
          />
        </div>
      )}

      {country.videos && country.videos.length > 0 && (
        <div className="destination-country-videos-container">
          <h2>Vlogovi i video putopisi</h2>

          <div className="destination-country-videos">
            <DestinationVideos data={country.videos} />
          </div>
        </div>
      )}

      <div className="destination-country-posts-container">
        <RecommendedPosts type={"country-page"} id={country.id} />
      </div>
    </div>
  );
};

export default DestinationCountry;