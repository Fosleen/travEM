import "./RecommendedPosts.scss";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";
import { FC, useEffect, useState } from "react";
import { getRecommendedArticles } from "../../../../utils/article";
import { Article } from "../../../../common/types";
import ReactGA from "react-ga4";

const RecommendedPosts: FC<{ id: number; type: string }> = ({ id, type }) => {
  const [articles, setArticles] = useState<Array<Article> | null>(null);

  const fetchData = async () => {
    try {
      const data = await getRecommendedArticles(id, type);
      setArticles(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (index: number) => {
    ReactGA.event({
      category: "Navigation",
      action: "Clicked recommended article",
      label: `Selected recommended article with index ${index}`,
      nonInteraction: false, // user activates it = interaction
    });
  };

  return (
    <div className="recommended-posts-container">
      <h2>Povezani članci</h2>
      {articles ? (
        <div className="recommended-posts last">
          {articles.map((el, index) => {
            return (
              <div onClick={() => handleClick(index)} key={index}>
                <HorizontalPostItemBig thin hasDate={false} data={el} />
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecommendedPosts;
