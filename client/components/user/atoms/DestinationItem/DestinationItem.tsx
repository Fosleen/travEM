import Link from "next/link";
import "./DestinationItem.scss";
import { FC } from "react";

const DestinationItem: FC<{
  mapItem?: boolean;
  filterMenuItem?: boolean;
  name?: string;
  iconUrl?: string;
  countryName?: string;
  planeTickets?: boolean;
}> = ({
  mapItem = false,
  filterMenuItem = false,
  name = "",
  iconUrl,
  countryName = null,
  planeTickets = false,
}) => {
  const destinationPath = planeTickets
    ? `/aviokarte/${name.toLowerCase()}`
    : countryName
    ? `/destinacija/${countryName.toLowerCase()}/${name.toLowerCase()}`
    : `/destinacija/${name.toLowerCase()}`;

  return (
    <Link
      href={destinationPath}
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
