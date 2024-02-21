import { Link } from "react-router-dom";
import "./DestinationItem.scss";
import { FC } from "react";

const DestinationItem: FC<{
  mapItem?: boolean;
  filterMenuItem?: boolean;
  name?: string;
  iconUrl?: string;
  countryName?: string;
}> = ({
  mapItem = false,
  filterMenuItem = false,
  name = "",
  iconUrl,
  countryName = null,
}) => {
  return (
    <Link
      to={
        countryName
          ? `/destinacija/${countryName.toLowerCase()}/${name.toLowerCase()}`
          : `/destinacija/${name.toLowerCase()}`
      }
      className={`destination-item-container ${
        (mapItem || filterMenuItem) && "has-icon full-width"
      } ${filterMenuItem && "flag"} ${mapItem && "sights"}`}
    >
      {filterMenuItem && (
        <img className="flag-icon" src={iconUrl} alt="destination-image" />
      )}
      <p>{name}</p>
      {mapItem && <img src={iconUrl} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
