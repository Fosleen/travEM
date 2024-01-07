import "./Homepage.scss";
import HomepageHero from "../../../components/user/molecules/HomepageHero";
import FavoritePosts from "../../../components/user/molecules/FavoritePosts";
import HomepageBanner from "../../../components/user/molecules/HomepageBanner";
import OtherPosts from "../../../components/user/molecules/OtherPosts";
import BlogStats from "../../../components/user/molecules/BlogStats";
import RecommendedaMapDestinations from "../../../components/user/molecules/RecommendedaMapDestinations";
import MapNew from "../../../components/organisms/Map/Map";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <HomepageHero />
      <FavoritePosts />
      <HomepageBanner />
      <RecommendedaMapDestinations />
      <MapNew />
      <BlogStats />
      <OtherPosts />
    </div>
  );
};

export default Homepage;
