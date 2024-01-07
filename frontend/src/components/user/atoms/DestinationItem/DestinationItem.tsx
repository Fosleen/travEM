import { Link } from "react-router-dom";
import icon from "../../../../assets/images/building-icon.png";
import flag from "../../../../assets/images/croatian-flag.png";
import "./DestinationItem.scss";

const DestinationItem = ({
  mapItem = false,
  filterMenuItem = false,
  name = "London",
}) => {
  return (
    <Link
      to={`/destinacija/${name.toLowerCase()}`}
      className={`destination-item-container ${
        (mapItem || filterMenuItem) && "has-icon flag"
      }`}
    >
      {filterMenuItem && <img src={flag} alt="destination-image" />}
      <p>{name}</p>
      {mapItem && <img src={icon} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
