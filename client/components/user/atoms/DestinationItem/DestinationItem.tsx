import Link from "next/link";
import "./DestinationItem.scss";
import { FC } from "react";
import { toUrlSlug } from "@/utils/url";

const DestinationItem: FC<{
  mapItem?: boolean;
  filterMenuItem?: boolean;
  name?: string;
  iconUrl?: string;
  countryName?: string;
  planeTickets?: boolean;
  badgeText?: string;
}> = ({
  mapItem = false,
  filterMenuItem = false,
  name = "",
  iconUrl,
  countryName = null,
  planeTickets = false,
  badgeText,
}) => {
  const destinationPath = planeTickets
    ? `/aviokarte/${toUrlSlug(name)}`
    : countryName
    ? `/destinacija/${toUrlSlug(countryName)}/${toUrlSlug(name)}`
    : `/destinacija/${toUrlSlug(name)}`;
  const hasLongName = Array.from(name.trim()).length > 10;

  return (
    <Link
      href={destinationPath}
      className={`destination-item-container ${
        (mapItem || filterMenuItem) && "has-icon full-width"
      } ${filterMenuItem && "flag"} ${mapItem && "sights"} ${
        badgeText && "has-badge"
      } ${hasLongName && "long-name"}`}
    >
      {badgeText && <span className="destination-item-badge">{badgeText}</span>}
      {filterMenuItem && (
        <img className="flag-icon" src={iconUrl} alt="destination-image" />
      )}
      <p>{name}</p>
      {mapItem && <img src={iconUrl} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
