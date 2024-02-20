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

const Article = () => {
  const { id } = useParams();

  const [articleContent, setArticleContent] = useState([]);

  const [recommendedArticles, setRecommendedArticles] = useState([]);

  const [countryPlaces, setCountryPlaces] = useState([]);

  const fetchData = async () => {
    try {
      const content = await getArticleById(id);

      const recommendedArticles = await getRecommendedArticles(
        id,
        content.articleTypeId
      );

      const places = await getCountryPlaces(content.placeId);

      setArticleContent(content);
      setRecommendedArticles(recommendedArticles);
      setCountryPlaces(places);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="article-container">
        <ArticleHero article={articleContent} />
      </div>
      <div className="article-location-parent">
        <div className="article-location">
          <img src={Location} alt="" />
          {articleContent.articleTypeId === 1 && articleContent.place && (
            <h4>
              {articleContent.place.name}, {articleContent.country.name}
            </h4>
          )}
        </div>
      </div>

      <ArticleTableOfContents article={articleContent} />

      <div className="article-content">
        {articleContent?.sections?.map((section) => {
          return (
            <>
              <ArticleFragment section={section} />
              {section.link_title !== "" && (
                <ArticleReadMore section={section} />
              )}
            </>
          );
        })}

        <ArticleFragment article={articleContent} />
      </div>

      <div className="article-gallery-text-wrapper">
        <h3>Slika govori 1000 riječi</h3>
        <div className="article-location">
          <img src={Location} alt="" />
          {articleContent.articleTypeId === 1 && articleContent.place && (
            <h4>
              {articleContent.place.name}, {articleContent.country.name}
            </h4>
          )}
        </div>
      </div>

      <div className="article-gallery-wrapper">
        {articleContent?.gallery_images && (
          <Gallery
            photos={articleContent.gallery_images.map((image) => {
              return {
                src: image.url,
                width: image.width,
                height: image.height,
              };
            })}
          />
        )}
      </div>
      <CountryPlaces hasPadding={false} places={countryPlaces} />
      <div className="article-text-articles-wrapper">
        <h2>Povezani članci</h2>
      </div>

      <div className="article-connected-articles-wrapper">
        {recommendedArticles.map((article) => (
          <HorizontalPostItemBig article={article} key={article.id} />
        ))}
      </div>
    </div>
  );
};

export default Article;
