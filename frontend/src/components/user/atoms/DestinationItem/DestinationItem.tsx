import { Link } from "react-router-dom";
import icon from "../../../../assets/images/building-icon.png";
import "./DestinationItem.scss";

const DestinationItem = ({ mapItem = false }) => {
  return (
    <Link
      to="/"
      className={`destination-item-container ${mapItem && "has-icon"}`}
    >
      <p>London</p>
      {mapItem && <img src={icon} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
