// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import ArticleFragment from "../../../components/user/molecules/ArticleFragment";
import ArticleHero from "../../../components/user/molecules/ArticleHero";
import ArticleTableOfContents from "../../../components/user/molecules/ArticleTableOfContents";
import { Helmet } from "react-helmet";
import "./Article.scss";
import Gallery from "react-photo-gallery";
import ArticleReadMore from "../../../components/user/atoms/ArticleReadMore";
import Location from "../../../assets/images/location.png";
import CountryPlaces from "../../../components/user/molecules/CountryPlaces";
import { useEffect, useState } from "react";
import { getArticleById } from "../../../api/article";
import { useNavigate, useParams } from "react-router-dom";
import { getCountryPlaces } from "../../../api/countries";
import { ThreeDots } from "react-loader-spinner";
import React from "react";
import RecommendedPosts from "../../../components/user/molecules/RecommendedPosts";
import { Adsense } from "@ctrl/react-adsense";
import Ad from "../../../components/atoms/Ad";

const Article = () => {
  const { id } = useParams();
  const [articleContent, setArticleContent] = useState([]);
  const [countryPlaces, setCountryPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metaKeywords, setMetaKeywords] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const contentPromise = getArticleById(id);
      const content = await contentPromise;
      const placesPromise = contentPromise.then((content) =>
        getCountryPlaces(content.placeId)
      );
      const places = await placesPromise;

      setArticleContent(content);
      setCountryPlaces(places);
      setIsLoading(false);
      setMetaKeywords(`putujem s travem, ${content.metatags}`);
      setTitle(content.title);
    } catch (error) {
      console.error("Error occurred while fetching homepage data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCountryClick = () => {
    navigate(`/destinacija/${articleContent.country.name.toLowerCase()}`);
  };

  const handlePlaceClick = () => {
    navigate(
      `/destinacija/${articleContent.country.name.toLowerCase()}/${articleContent.place.name.toLowerCase()}`
    );
  };

  return (
    <>
      {isLoading ? (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      ) : (
        <div>
          <Helmet>
            <meta name="keywords" content={metaKeywords} />
            <title>{title}</title>
          </Helmet>
          <div className="article-container">
            <ArticleHero article={articleContent} />
          </div>
          <div className="article-location-parent">
            <div className="article-location-container">
              {articleContent.articleTypeId === 1 && (
                <div className="article-location">
                  <img src={Location} alt="" />
                  <h4 onClick={handlePlaceClick} className="article-location">
                    {articleContent.place && `${articleContent.place.name}, `}
                  </h4>
                  <h4 onClick={handleCountryClick} className="article-location">
                    {articleContent.country.name}
                  </h4>
                </div>
              )}
            </div>
          </div>
          <ArticleTableOfContents
            article={articleContent}
            key={articleContent}
          />
          <Adsense client="ca-pub-3489990178681903" slot="7259870550" />
          <div className="article-content">
            {articleContent?.sections?.map((section, index) => (
              <React.Fragment key={index}>
                <ArticleFragment section={section} index={index} />
                {section.link_title !== "" && (
                  <ArticleReadMore section={section} />
                )}
              </React.Fragment>
            ))}
            <ArticleFragment article={articleContent} />
          </div>
          <Adsense
            client="ca-pub-3489990178681903"
            slot="7259870551"
            style={{ width: 500, height: 300 }}
            format=""
          />
          <div className="article-gallery-text-wrapper">
            {articleContent?.gallery_images.length > 0 && (
              <h3>Slika govori 1000 riječi</h3>
            )}

            {articleContent.articleTypeId === 1 && (
              <div className="article-location-container">
                <img src={Location} alt="" />
                <h4 onClick={handlePlaceClick} className="article-location">
                  {articleContent.place && `${articleContent.place.name}, `}
                </h4>
                <h4 onClick={handleCountryClick} className="article-location">
                  {articleContent.country.name}
                </h4>
              </div>
            )}
          </div>
          <Ad dataAdSlot="12345678" />
          <div className="article-gallery-wrapper">
            {articleContent?.gallery_images && (
              <Gallery
                photos={articleContent.gallery_images.map((image) => ({
                  src: image.url,
                  width: image.width,
                  height: image.height,
                }))}
              />
            )}
          </div>
          <Adsense
            client="ca-pub-3489990178681903"
            slot="7259870552"
            style={{ display: "block" }}
            layout="in-article"
            format="fluid"
          />
          {countryPlaces.length !== 0 && (
            <CountryPlaces hasPadding={false} places={countryPlaces} />
          )}
          <div className="article-connected-articles-wrapper">
            <RecommendedPosts id={id} type={articleContent.articleTypeId} />
          </div>
        </div>
      )}
    </>
  );
};

export default Article;
