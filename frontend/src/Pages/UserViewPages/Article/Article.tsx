// @ts-nocheck

import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";
import ArticleFragment from "../../../components/user/molecules/ArticleFragment/ArticleFragment";
import ArticleHero from "../../../components/user/molecules/ArticleHero";
import ArticleTableOfContents from "../../../components/user/molecules/ArticleTableOfContents/ArticleTableOfContents";
import Grid1 from "../../../assets/images/grid1.png";
import Grid2 from "../../../assets/images/grid2.png";
import Grid3 from "../../../assets/images/grid3.png";
import Grid5 from "../../../assets/images/grid5.png";
import "./Article.scss";
import Gallery from "react-photo-gallery";
import ArticleReadMore from "../../../components/user/atoms/ArticleReadMore/ArticleReadMore";
import Location from "../../../assets/images/location.png";
import CountryPlaces from "../../../components/user/molecules/CountryPlaces";
import { useEffect, useState } from "react";
import { getArticleById } from "../../../api/article";
import { useParams } from "react-router-dom";

const Article = () => {
  const photos = [
    {
      src: Grid1, //larger width means more columns
      width: 2,
      height: 2,
    },
    {
      src: Grid2,
      width: 2,
      height: 2,
    },
    {
      src: Grid3,
      width: 3,
      height: 1,
    },
    {
      src: Grid2,
      width: 2,
      height: 2,
    },
    {
      src: Grid5,
      width: 3,
      height: 1,
    },
    {
      src: Grid1,
      width: 2,
      height: 2,
    },
  ];

  const { id } = useParams();

  const [articleContent, setArticleContent] = useState({});

  const fetchData = async () => {
    try {
      const content = await getArticleById(id);

      console.log("Podaci o ovom clanku su", content);
      setArticleContent(content);
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
          {articleContent.articleTypeId === 1 && (
            <h4>
              {articleContent.place}, {articleContent.country.name}
            </h4>
          )}
        </div>
      </div>

      <ArticleTableOfContents article={articleContent} />

      <div className="article-content">
        {articleContent?.sections?.map((section) => {
          {
            console.log("Section je", section);
          }
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
          {articleContent.articleTypeId === 1 && (
            <h4>
              {articleContent.place}, {articleContent.country.name}
            </h4>
          )}
        </div>
      </div>

      <div className="article-gallery-wrapper">
        {console.log("Article content koji se gubi je", articleContent)}
        {articleContent?.gallery_images && (
          <Gallery
            photos={articleContent.gallery_images.map((image) => {
              console.log(
                "Width and height are",
                image.width,
                image.height,
                "obicni image je",
                image
              );

              console.log(
                "Gallery image je",

                image
              );
              return {
                src: image.url,
                width: image.width,
                height: image.height,
              };
            })}
          />
        )}
      </div>
      <CountryPlaces hasPadding={false} />
      <div className="article-text-articles-wrapper">
        <h2>Povezani članci</h2>
      </div>

      <div className="article-connected-articles-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
    </div>
  );
};

export default Article;
