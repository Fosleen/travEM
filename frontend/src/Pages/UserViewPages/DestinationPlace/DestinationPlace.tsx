import DestinationHero from "../../../components/user/molecules/DestinationHero";
import DestinationPosts from "../../../components/user/molecules/DestinationPosts";
import DestinationVideos from "../../../components/user/molecules/DestinationVideos";
import RecommendedPosts from "../../../components/user/molecules/RecommendedPosts";
import "./DestinationPlace.scss";

const DestinationPlace = () => {
  return (
    <div className="destination-place-page-container">
      <DestinationHero />
      <div className="destination-place-posts-container">
        <h2>Saznajte više</h2>
        <div className="destination-place-posts">
          <DestinationPosts />
        </div>
      </div>
      <div className="destination-place-videos-container">
        <h2>Vlogovi i video putopisi</h2>
        <div className="destination-place-videos">
          <DestinationVideos />
        </div>
      </div>
      <div className="destination-place-posts-container">
        <RecommendedPosts />
      </div>
    </div>
  );
};

export default DestinationPlace;
