import "./BlogStats.scss";

const icon1 = "/images/world-icon.png";
const icon2 = "/images/globe-icon.png";
const icon3 = "/images/article-icon.png";
const icon4 = "/images/plane-ticket-icon.png";
const icon5 = "/images/vlogging-icon.png";
const icon6 = "/images/walk-icon.png";

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
            icon={icon1}
            value={blogStats.continents_nmbr.toString()}
            text="kontinenta"
          />
          <BlogStatsItem
            icon={icon2}
            value={blogStats.countries_nmbr.toString()}
            text="države"
          />
          <BlogStatsItem
            icon={icon3}
            value={blogStats.articles_nmbr.toString()}
            text="članaka"
          />
          <BlogStatsItem
            icon={icon4}
            value={homepageContent.flights_nmbr}
            text="letova avionom"
          />
          <BlogStatsItem
            icon={icon5}
            value={homepageContent.videos_nmbr}
            text="videa"
          />
          <BlogStatsItem
            icon={icon6}
            value={homepageContent.distance_nmbr}
            text="prijeđenih kilometara"
          />
        </>
      )}
    </div>
  );
};

export default BlogStats;
