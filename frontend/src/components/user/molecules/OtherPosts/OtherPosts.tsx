import HorizontalPostItem from "../../atoms/HorizontalPostItem";
import VerticalPostItem from "../../atoms/VerticalPostItem";
import "./OtherPosts.scss";

const OtherPosts = () => {
  return (
    <div className="other-posts-container">
      <h2>Omiljeni putopisi</h2>
      <div className="other-posts-wrapper">
        <div className="other-posts-left">
          <HorizontalPostItem isSmall={true} />
          <HorizontalPostItem isSmall={true} />
          <HorizontalPostItem isSmall={true} />
          <HorizontalPostItem isSmall={true} />
        </div>
        <div className="other-posts-right">
          <VerticalPostItem />
          <VerticalPostItem />
          <VerticalPostItem />
        </div>
      </div>
    </div>
  );
};

export default OtherPosts;
