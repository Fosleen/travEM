// @ts-nocheck

import { useEffect, useState } from "react";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./AirplaneTickets.scss";
import {
  getArticlesByType,
  getRecommendedArticles,
} from "../../../api/article";
import { ThreeDots } from "react-loader-spinner";

const AirplaneTickets = () => {
  const [airplaneTickets, setAirplaneTickets] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendedArticles, setRecommendedArticles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getArticlesByType(1, 12, 2);
      const recommendedArticlesData = await getRecommendedArticles(1, 2);

      setAirplaneTickets(data.data);
      setRecommendedArticles(recommendedArticlesData);

      setLoading(false);
    } catch (error) {
      console.error("Error occurred while fetching articles:", error);
    }
  };

  const renderArticlesByCity = () => {
    const articlesByCity = {};
    airplaneTickets.forEach((article) => {
      const cityName = article.airport_city.name;
      if (!articlesByCity[cityName]) {
        articlesByCity[cityName] = [];
      }
      articlesByCity[cityName].push(article);
    });

    return Object.entries(articlesByCity).map(([cityName, articles]) => (
      <div key={cityName}>
        <div className="airplane-tickets-text-wrapper">
          <h2>{`Aviokarte ${cityName}`}</h2>
        </div>
        <div className="airplane-tickets-grid-wrapper">
          {!loading && articles ? (
            articles.map((article) => (
              <HorizontalPostItemBig key={article.id} data={article} />
            ))
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
      </div>
    ));
  };

  return (
    <div className="airplane-tickets-parent-wrapper">
      {renderArticlesByCity()}
      <div className="airplane-tickets-text-articles-wrapper">
        <h2>Povezani članci</h2>
      </div>
      <div className="airplane-tickets-connected-articles-wrapper">
        {recommendedArticles?.map((article) => (
          <HorizontalPostItemBig key={article.id} data={article} />
        ))}
      </div>
    </div>
  );
};

export default AirplaneTickets;
