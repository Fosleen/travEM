import { Key } from "react";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";
import "./DestinationPosts.scss";

const DestinationPosts = ({ data }) => {
  return (
    <div className="destination-posts-container">
      {data.map((el, index) => (
        <HorizontalPostItemBig key={index} thin article={el} />
      ))}
    </div>
  );
};

export default DestinationPosts;
