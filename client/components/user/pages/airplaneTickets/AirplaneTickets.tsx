// components/user/pages/airplaneTickets/AirplaneTickets.tsx
"use client";

import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import RecommendedPosts from "../../molecules/RecommendedPosts";
import "./AirplaneTickets.scss";

type Article = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  main_image_url: string;
  airport_city: {
    id: number;
    name: string;
  };
};

type AirplaneTicketsProps = {
  initialTickets: Article[];
  cityName: string;
  recommendedId: number | null;
};

const AirplaneTickets = ({
  initialTickets,
  cityName,
  recommendedId,
}: AirplaneTicketsProps) => {
  // Format city name: capitalize each word
  const formattedCityName = cityName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="airplane-tickets-parent-wrapper">
      <div className="airplane-tickets-text-wrapper">
        <h1>Aviokarte {formattedCityName}</h1>
      </div>
      <div className="airplane-tickets-grid-wrapper">
        {initialTickets.length > 0 ? (
          initialTickets.map((article) => (
            <HorizontalPostItemBig key={article.id} data={article} />
          ))
        ) : (
          <div className="no-tickets-message">
            <h2>Trenutno nema aviokarti za ovo mjesto</h2>
          </div>
        )}
      </div>
      {recommendedId && <RecommendedPosts type="article" id={recommendedId} />}
    </div>
  );
};

export default AirplaneTickets;
