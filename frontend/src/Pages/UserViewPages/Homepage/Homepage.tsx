import "./Homepage.scss";
import HomepageHero from "../../../components/user/molecules/HomepageHero";
import FavoritePosts from "../../../components/user/molecules/FavoritePosts";
import HomepageBanner from "../../../components/user/molecules/HomepageBanner";
import OtherPosts from "../../../components/user/molecules/OtherPosts";
import BlogStats from "../../../components/user/molecules/BlogStats";
import DestinationsMap from "../../../components/organisms/DestinationsMap/DestinationsMap";
import RecommendedMapDestinations from "../../../components/user/molecules/RecommendedMapDestinations";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <HomepageHero />
      <FavoritePosts />
      <HomepageBanner />
      <RecommendedMapDestinations />
      <DestinationsMap initialLatitude={51.1657} initialLongitude={10.4515} />
      <BlogStats />
      <OtherPosts />
    </div>
  );
};

export default Homepage;
