// @ts-nocheck

import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";
import ArticleFragment from "../../../components/user/molecules/ArticleFragment/ArticleFragment";
import ArticleHero from "../../../components/user/molecules/ArticleHero";
import ArticleTableOfContents from "../../../components/user/molecules/ArticleTableOfContents/ArticleTableOfContents";

import "./Article.scss";
import Gallery from "react-photo-gallery";
import ArticleReadMore from "../../../components/user/atoms/ArticleReadMore/ArticleReadMore";
import Location from "../../../assets/images/location.png";
import CountryPlaces from "../../../components/user/molecules/CountryPlaces";
import { useEffect, useState } from "react";
import { getArticleById, getRecommendedArticles } from "../../../api/article";
import { useParams } from "react-router-dom";
import { getCountryPlaces } from "../../../api/countries";
import { ThreeDots } from "react-loader-spinner";
import React from "react";

const Article = () => {
  const { id } = useParams();

  const [articleContent, setArticleContent] = useState([]);

  const [recommendedArticles, setRecommendedArticles] = useState([]);

  const [countryPlaces, setCountryPlaces] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const contentPromise = getArticleById(id);
      const content = await contentPromise;

      const recommendedArticlesPromise = contentPromise.then((content) =>
        getRecommendedArticles(id, content.articleTypeId)
      );
      const recommendedArticles = await recommendedArticlesPromise;

      const placesPromise = contentPromise.then((content) =>
        getCountryPlaces(content.placeId)
      );
      const places = await placesPromise;

      setArticleContent(content);
      setRecommendedArticles(recommendedArticles);
      setCountryPlaces(places);
      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred while fetching homepage data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <div className="article-container">
            <ArticleHero article={articleContent} />
          </div>
          <div className="article-location-parent">
            {articleContent.articleTypeId === 1 && articleContent.place && (
              <div className="article-location">
                <img src={Location} alt="" />
                <h4>
                  {articleContent.place.name}, {articleContent.country.name}
                </h4>
              </div>
            )}
          </div>
          <ArticleTableOfContents
            article={articleContent}
            key={articleContent}
          />
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
          <div className="article-gallery-text-wrapper">
            {articleContent?.gallery_images.length > 0 && (
              <h3>Slika govori 1000 riječi</h3>
            )}

            {articleContent.articleTypeId === 1 && articleContent.place && (
              <div className="article-location">
                <img src={Location} alt="" />
                <h4>
                  {articleContent.place.name}, {articleContent.country.name}
                </h4>
              </div>
            )}
          </div>
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
          {countryPlaces.length !== 0 && (
            <CountryPlaces hasPadding={false} places={countryPlaces} />
          )}
          <div className="article-text-articles-wrapper">
            <h2>Povezani članci</h2>
          </div>
          <div className="article-connected-articles-wrapper">
            {recommendedArticles.map((article) => (
              <HorizontalPostItemBig key={article.id} data={article} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Article;
