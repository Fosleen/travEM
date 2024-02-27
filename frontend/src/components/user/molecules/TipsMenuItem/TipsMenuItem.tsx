import { Link } from "react-router-dom";
import "./TipsMenuItem.scss";
import { convertToSlug } from "../../../../utils/global";
import { FC } from "react";

const TipsMenuItem: FC<{ title: string; icon: string }> = ({ title, icon }) => {
  return (
    <Link
      to={`/savjeti/${convertToSlug(title)}`}
      className="tips-menu-item-container"
    >
      <h2>{title}</h2>
      <img src={icon} alt="icon" className="icon-top-left" />
      <img src={icon} alt="icon" className="icon-bottom-right" />
    </Link>
  );
};

export default TipsMenuItem;
