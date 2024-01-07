import { Link } from "react-router-dom";
import icon from "../../../../assets/images/building-icon.png";
import flag from "../../../../assets/images/croatian-flag.png";
import "./DestinationItem.scss";

const DestinationItem = ({ mapItem = false, filterMenuItem = false }) => {
  return (
    <Link
      to="/"
      className={`destination-item-container ${
        (mapItem || filterMenuItem) && "has-icon flag"
      }`}
    >
      {filterMenuItem && <img src={flag} alt="destination-image" />}
      <p>London</p>
      {mapItem && <img src={icon} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
