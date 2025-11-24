import { Link } from "react-router-dom";
import "./EditHomepageMenuItem.scss";
import { FC } from "react";

const EditHomepageMenuItem: FC<{ text: string; url: string }> = ({
  text,
  url,
}) => {
  return (
    <Link to={url} className="edit-homepage-menu-item-container">
      <p>{text}</p>
    </Link>
  );
};

export default EditHomepageMenuItem;
