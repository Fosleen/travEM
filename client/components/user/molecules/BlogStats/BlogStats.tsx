import "./BlogStats.scss";
import BlogStatsItem from "../../atoms/BlogStatsItem";
import { HomepageData, Nullable } from "../../../../common/types";
import { FC, useEffect, useState } from "react";
import { getHomepageStats } from "../../../../utils/homepage";

const BlogStats: FC<{ homepageContent: HomepageData }> = ({
  homepageContent,
}) => {
  const [blogStats, setBlogStats] = useState<
    Nullable<{
      continents_nmbr: number;
      countries_nmbr: number;
      articles_nmbr: number;
    }>
  >(null);

  useEffect(() => {
    getHomepageStats().then(setBlogStats).catch(console.error);
  }, []);

  return (
    <div className="blog-stats-container">
      {blogStats && (
        <>
          <BlogStatsItem
            lottieSrc="/lottie/stats-map.json"
            value={blogStats.continents_nmbr.toString()}
            text="kontinenta"
          />
          <BlogStatsItem
            lottieSrc="/lottie/stats-globe.json"
            value={blogStats.countries_nmbr.toString()}
            text="države"
          />
          <BlogStatsItem
            lottieSrc="/lottie/stats-article.json"
            value={blogStats.articles_nmbr.toString()}
            text="članaka"
          />
          <BlogStatsItem
            lottieSrc="/lottie/stats-ticket.json"
            value={homepageContent.flights_nmbr}
            text="letova avionom"
          />
          <BlogStatsItem
            lottieSrc="/lottie/stats-camera.json"
            value={homepageContent.videos_nmbr}
            text="videa"
          />
          <BlogStatsItem
            lottieSrc="/lottie/stats-walk.json"
            value={homepageContent.distance_nmbr}
            text="prijeđenih kilometara"
          />
        </>
      )}
    </div>
  );
};

export default BlogStats;
