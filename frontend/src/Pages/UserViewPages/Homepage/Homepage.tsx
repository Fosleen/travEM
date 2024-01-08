import "./Homepage.scss";
import HomepageHero from "../../../components/user/molecules/HomepageHero";
import FavoritePosts from "../../../components/user/molecules/FavoritePosts";
import HomepageBanner from "../../../components/user/molecules/HomepageBanner";
import OtherPosts from "../../../components/user/molecules/OtherPosts";
import BlogStats from "../../../components/user/molecules/BlogStats";
import Map from "../../../components/organisms/Map/Map";
import RecommendedMapDestinations from "../../../components/user/molecules/RecommendedMapDestinations";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <HomepageHero />
      <FavoritePosts />
      <HomepageBanner />
      <RecommendedMapDestinations />
      <Map />
      <BlogStats />
      <OtherPosts />
    </div>
  );
};

export default Homepage;
