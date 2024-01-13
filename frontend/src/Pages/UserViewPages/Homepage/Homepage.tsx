import "./Homepage.scss";
import HomepageHero from "../../../components/user/molecules/HomepageHero";
import FavoritePosts from "../../../components/user/molecules/FavoritePosts";
import HomepageBanner from "../../../components/user/molecules/HomepageBanner";
import OtherPosts from "../../../components/user/molecules/OtherPosts";
import BlogStats from "../../../components/user/molecules/BlogStats";
import DestinationsMap from "../../../components/organisms/DestinationsMap/DestinationsMap";
import RecommendedMapDestinations from "../../../components/user/molecules/RecommendedMapDestinations";
import { getHomepage } from "../../../api/homepage";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { HomepageData } from "../../../common/types";

const Homepage = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );

  const fetchData = async () => {
    try {
      const content = await getHomepage();
      setHomepageContent(content);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="homepage-container">
      {homepageContent ? (
        <>
          <HomepageHero homepageContent={homepageContent} />
          <FavoritePosts />
          <HomepageBanner homepageContent={homepageContent} />
          <RecommendedMapDestinations />
          <DestinationsMap
            initialLatitude={51.1657}
            initialLongitude={10.4515}
          />
          <BlogStats homepageContent={homepageContent} />
          <OtherPosts />
        </>
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

export default Homepage;
