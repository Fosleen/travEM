import "./BlogStats.scss";
import BlogStatsItem from "../../atoms/BlogStatsItem";
import { HomepageData, Nullable } from "../../../../common/types";
import { FC, useEffect, useState } from "react";
import { getHomepageStats } from "../../../../api/homepage";

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
            icon="/images/world-icon.png"
            value={blogStats.continents_nmbr.toString()}
            text="kontinenta"
          />
          <BlogStatsItem
            icon="/images/globe-icon.png"
            value={blogStats.countries_nmbr.toString()}
            text="države"
          />
          <BlogStatsItem
            icon="/images/article-icon.png"
            value={blogStats.articles_nmbr.toString()}
            text="članaka"
          />
          <BlogStatsItem
            icon="/images/plane-ticket-icon.png"
            value={homepageContent.flights_nmbr}
            text="letova avionom"
          />
          <BlogStatsItem
            icon="/images/vlogging-icon.png"
            value={homepageContent.videos_nmbr}
            text="videa"
          />
          <BlogStatsItem
            icon="/images/walk-icon.png"
            value={homepageContent.distance_nmbr}
            text="prijeđenih kilometara"
          />
        </>
      )}
    </div>
  );
};

export default BlogStats;