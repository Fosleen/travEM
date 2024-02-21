import "./BlogStats.scss";
import icon1 from "../../../../assets/images/world-icon.png";
import icon2 from "../../../../assets/images/globe-icon.png";
import icon3 from "../../../../assets/images/article-icon.png";
import icon4 from "../../../../assets/images/plane-ticket-icon.png";
import icon5 from "../../../../assets/images/vlogging-icon.png";
import icon6 from "../../../../assets/images/walk-icon.png";
import BlogStatsItem from "../../atoms/BlogStatsItem";
import { HomepageData } from "../../../../common/types";
import { FC, useEffect, useState } from "react";
import { Nullable } from "primereact/ts-helpers";
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stats = await getHomepageStats();
      setBlogStats(stats);
    } catch (error) {
      console.error("Error occured while fetching homepage stats:", error);
    }
  };

  return (
    <div className="blog-stats-container">
      {blogStats && (
        <>
          <BlogStatsItem
            icon={icon1}
            value={blogStats.continents_nmbr.toString()}
            text={"kontinenta"}
          />
          <BlogStatsItem
            icon={icon2}
            value={blogStats.countries_nmbr.toString()}
            text={"države"}
          />
          <BlogStatsItem
            icon={icon3}
            value={blogStats.articles_nmbr.toString()}
            text={"članaka"}
          />
          <BlogStatsItem
            icon={icon4}
            value={homepageContent.flights_nmbr}
            text={"letova avionom"}
          />
          <BlogStatsItem
            icon={icon5}
            value={homepageContent.videos_nmbr}
            text={"videa"}
          />
          <BlogStatsItem
            icon={icon6}
            value={homepageContent.distance_nmbr}
            text={"prijeđenih kilometara"}
          />
        </>
      )}
    </div>
  );
};

export default BlogStats;
