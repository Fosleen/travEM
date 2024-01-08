import { Link } from "react-router-dom";
import "./TipsMenuItem.scss";

const TipsMenuItem = ({ title, icon }) => {
  function convertToSlug(sentence: string) {
    return sentence.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <Link to={convertToSlug(title)} className="tips-menu-item-container">
      <h2>{title}</h2>
      <img src={icon} alt="icon" className="icon-top-left" />
      <img src={icon} alt="icon" className="icon-bottom-right" />
    </Link>
  );
};

export default TipsMenuItem;
