import "./BlogStatsItem.scss";

const BlogStatsItem = ({ icon }) => {
  return (
    <div className="blog-stats-item-container">
      <div className="blog-stats-item-wrapper">
        <div className="blog-stats-item-image">
          <img src={icon} alt="icon" />
        </div>
        <div className="blog-stats-item-value">
          <p>150k</p>
        </div>
      </div>
      <p>prijeđenih kilometara</p>
    </div>
  );
};

export default BlogStatsItem;
