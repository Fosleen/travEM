import "./RecommendedPosts.scss";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";
import { FC, useEffect, useState } from "react";
import { getRecommendedArticles } from "../../../../api/article";
import { ThreeDots } from "react-loader-spinner";
import { Article } from "../../../../common/types";
import ReactGA from "react-ga4";

const RecommendedPosts: FC<{ id: number; type: string }> = ({ id, type }) => {
  const [articles, setArticles] = useState<Array<Article> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getRecommendedArticles(id, type);
      setArticles(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

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
    </div>
  );
};

export default RecommendedPosts;
