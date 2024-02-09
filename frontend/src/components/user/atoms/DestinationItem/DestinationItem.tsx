import { Link } from "react-router-dom";
import icon from "../../../../assets/images/building-icon.png";
import "./DestinationItem.scss";
import { FC } from "react";

const DestinationItem: FC<{
  mapItem?: boolean;
  filterMenuItem?: boolean;
  name?: string;
  flagUrl?: string;
  countryName?: string;
}> = ({
  mapItem = false,
  filterMenuItem = false,
  name = "London",
  flagUrl,
  countryName = null,
}) => {
  return (
    <Link
      to={
        countryName
          ? `/destinacija/${countryName}/${name.toLowerCase()}`
          : `/destinacija/${name.toLowerCase()}`
      }
      className={`destination-item-container ${
        (mapItem || filterMenuItem) && "has-icon full-width"
      } ${filterMenuItem && "flag"} ${mapItem && "sights"}`}
    >
      {filterMenuItem && (
        <img className="flag-icon" src={flagUrl} alt="destination-image" />
      )}
      <p>{name}</p>
      {mapItem && <img src={icon} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
