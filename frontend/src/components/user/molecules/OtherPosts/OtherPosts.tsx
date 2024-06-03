import { FC } from "react";
import HorizontalPostItem from "../../atoms/HorizontalPostItem";
import VerticalPostItem from "../../atoms/VerticalPostItem";
import "./OtherPosts.scss";
import { Article } from "../../../../common/types";

const OtherPosts: FC<{
  verticalArticles: Array<Article>;
  horizontalArticles: Array<Article>;
}> = ({ verticalArticles, horizontalArticles }) => {
  return (
    <div className="other-posts-container">
      <h2>Omiljeni putopisi</h2>
      <div className="other-posts-wrapper">
        <div className="other-posts-left">
          {horizontalArticles.map((el, index) => (
            <HorizontalPostItem isSmall={true} article={el} key={index} />
          ))}
        </div>
        <div className="other-posts-right">
          {verticalArticles.map((el, index) => (
            <VerticalPostItem article={el} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherPosts;
