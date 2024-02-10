// @ts-nocheck

import MainCountryPost from "../../../components/user/atoms/MainCountryPost";
import DestinationHero from "../../../components/user/molecules/DestinationHero";
import "./DestinationCountry.scss";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";
import CountryPlaces from "../../../components/user/molecules/CountryPlaces";
import VisaInfo from "../../../components/user/molecules/VisaInfo";
import DestinationVideos from "../../../components/user/molecules/DestinationVideos";
import RecommendedPosts from "../../../components/user/molecules/RecommendedPosts";
import { useParams } from "react-router-dom";
import { getCountriesByName, getCountryById } from "../../../api/countries";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { getFavoriteArticleByCountry } from "../../../api/article";
import Characteristics from "../../../components/user/atoms/Characteristics";
import Specificities from "../../../components/user/atoms/Specificities";
import { CountriesData } from "../../../common/types";

const DestinationCountry = () => {
  const [country, setCountry] = useState<CountriesData | null>();
  const [favoriteArticle, setFavoriteArticle] = useState(null);
  const { countryName } = useParams();

  const fetchData = async () => {
    try {
      const tempData = await getCountriesByName(countryName!, 1, 1);
      const countryId = tempData.data[0].id;
      const countryData = await getCountryById(countryId);
      const favoriteArticleData = await getFavoriteArticleByCountry(countryId);

      setCountry(countryData);
      if ("id" in favoriteArticleData) {
        setFavoriteArticle(favoriteArticleData);
      }
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCountry(null);
    fetchData();
  }, [countryName]);

  return (
    <>
      {country ? (
        <div className="destination-country-page-container">
          {country.color && (
            <DestinationHero
              name={countryName}
              main_image_url={country.main_image_url}
              description={country.description}
              color={country.color.hex_value}
            />
          )}
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
                    article={el}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="destination-country-places-container">
            {country && country.places && (
              <CountryPlaces
                places={country.places}
                countryName={countryName}
              />
            )}
          </div>
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

          <div className="destination-country-visa-info-container">
            <VisaInfo countryId={country.id} />
          </div>
          {country.videos.length > 0 && (
            <div className="destination-country-videos-container">
              <h2>Vlogovi i video putopisi</h2>
              <div className="destination-country-videos">
                <DestinationVideos data={country.videos} />
              </div>
            </div>
          )}
          <div className="destination-country-posts-container">
            <RecommendedPosts />
          </div>
        </div>
      ) : (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      )}
    </>
  );
};

export default DestinationCountry;
