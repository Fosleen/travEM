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
  badgeVariant?: "default" | "hit";
  badgeEndText?: string;
  badgeEndVariant?: "default" | "hit";
}> = ({
  mapItem = false,
  filterMenuItem = false,
  name = "",
  iconUrl,
  countryName = null,
  planeTickets = false,
  badgeText,
  badgeVariant = "default",
  badgeEndText,
  badgeEndVariant = "default",
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
        (badgeText || badgeEndText) && "has-badge"
      } ${hasLongName && "long-name"}`}
    >
      {badgeText && (
        <span className={`destination-item-badge ${badgeVariant}`}>
          {badgeText}
        </span>
      )}
      {badgeEndText && (
        <span
          className={`destination-item-badge destination-item-badge--end ${badgeEndVariant}`}
        >
          {badgeEndText}
        </span>
      )}
      {filterMenuItem && (
        <img className="flag-icon" src={iconUrl} alt="destination-image" />
      )}
      <p>{name}</p>
      {mapItem && <img src={iconUrl} alt="destination-image" />}
    </Link>
  );
};

export default DestinationItem;
