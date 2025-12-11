// @ts-nocheck
"use client";

import DestinationHero from "../../molecules/DestinationHero";
import DestinationPosts from "../../molecules/DestinationPosts";
import DestinationVideos from "../../molecules/DestinationVideos";
import RecommendedPosts from "../../molecules/RecommendedPosts";
import "./DestinationPlace.scss";

interface Article {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  main_image_url: string;
  date_written?: string;
}

interface Country {
  id: number;
  name: string;
}

interface Place {
  id: number;
  name: string;
  description: string;
  main_image_url: string;
  articles: Article[];
  videos: string[];
  country: Country;
}

interface DestinationPlaceProps {
  initialPlace: Place;
  placeName: string;
}

const DestinationPlace = ({
  initialPlace,
  placeName,
}: DestinationPlaceProps) => {
  const place = initialPlace;

  return (
    <div className="destination-place-page-container">
      <DestinationHero
        name={place.name}
        description={place.description}
        main_image_url={place.main_image_url}
      />

      {place.articles && place.articles.length > 0 && (
        <div className="destination-place-posts-container">
          <h2>Saznajte više</h2>
          <div className="destination-place-posts">
            <DestinationPosts data={place.articles} />
          </div>
        </div>
      )}

      {place.videos && place.videos.length > 0 && (
        <div className="destination-place-videos-container">
          <h2>Vlogovi i video putopisi</h2>
          <div className="destination-place-videos">
            <DestinationVideos data={place.videos} />
          </div>
        </div>
      )}

      <div className="destination-place-posts-container">
        <RecommendedPosts type={"place-page"} id={place.id} />
      </div>
    </div>
  );
};

export default DestinationPlace;
