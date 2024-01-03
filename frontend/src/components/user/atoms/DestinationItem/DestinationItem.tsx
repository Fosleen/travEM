import { Link } from "react-router-dom";
import "./DestinationItem.scss";

const DestinationItem = () => {
  return (
    <Link to="/" className="destination-item-container">
      London
    </Link>
  );
};

export default DestinationItem;
