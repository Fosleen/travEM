import { Link } from "react-router-dom";
import "./TipsMenuItem.scss";
import { convertToSlug } from "../../../../utils/global";
import { FC, MouseEventHandler } from "react";

const TipsMenuItem: FC<{
  title: string;
  icon: string;
  onClick?: MouseEventHandler<HTMLElement>;
}> = ({ title, icon, onClick }) => {
  return (
    <Link
      to={`/savjeti/${convertToSlug(title)}`}
      className="tips-menu-item-container"
      onClick={onClick}
    >
      <h2>{title}</h2>
      <img src={icon} alt="icon" className="icon-top-left" />
      <img src={icon} alt="icon" className="icon-bottom-right" />
    </Link>
  );
};

export default TipsMenuItem;
