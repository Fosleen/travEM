// @ts-nocheck

import { useEffect, useState } from "react";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./AirplaneTickets.scss";
import {
  getArticlesByType,
  getRecommendedArticles,
} from "../../../api/article";
import { useParams } from "react-router";
import RecommendedPosts from "../../../components/user/molecules/RecommendedPosts";

const AirplaneTickets = () => {
  const [airplaneTickets, setAirplaneTickets] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [idForRecommended, setIdForRecommended] = useState(null);

  const { name } = useParams();

  useEffect(() => {
    fetchData();
  }, [name]);

  const fetchData = async () => {
    try {
      const data = await getArticlesByType(1, 12, 2);

      // Filter articles based on the name from the URL
      console.log("Articles su", data);

      const filteredTickets = data.data.filter(
        (article) => article.airport_city.name.toLowerCase() == name
      );

      setAirplaneTickets(filteredTickets);

      const recommendedArticlesData = await getRecommendedArticles(1, 2);

      setRecommendedArticles(recommendedArticlesData);

      const idForRecommended = recommendedArticlesData[0].id;
      setIdForRecommended(idForRecommended);

      setLoading(false);
    } catch (error) {
      console.error("Error occurred while fetching articles:", error);
    }
  };

  return (
    <div className="airplane-tickets-parent-wrapper">
      <div className="airplane-tickets-text-wrapper">
        <h2>Aviokarte {name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      </div>
      <div className="airplane-tickets-grid-wrapper">
        {!loading && airplaneTickets.length > 0 ? (
          airplaneTickets.map((article) => (
            <HorizontalPostItemBig key={article.id} data={article} />
          ))
        ) : (
          <h2>Trenutno nema aviokarti za ovo mjesto</h2>
        )}
      </div>
      <div className="airplane-tickets-text-articles-wrapper">
        <h2>Povezani članci</h2>
      </div>
      {idForRecommended && <RecommendedPosts type="2" id={idForRecommended} />}{" "}
    </div>
  );
};

export default AirplaneTickets;
