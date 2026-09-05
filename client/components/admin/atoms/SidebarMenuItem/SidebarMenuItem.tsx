import Link from "next/link";
import "./SidebarMenuItem.scss";
import {
  Article,
  GlobeHemisphereWest,
  Buildings,
  Info,
  ChatCenteredText,
} from "@phosphor-icons/react/dist/ssr";
import { FC } from "react";
import { SidebarMenuItemProps } from "../../../../common/types";
import { Users } from "@phosphor-icons/react";

const normalize = (value: string) => {
  return value
    .toLowerCase()
    .replace(/č|ć/g, "c")
    .replace(/š/g, "s")
    .replace(/đ/g, "d")
    .replace(/ž/g, "z");
};

const WeddingRingsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="11" cy="19" r="7" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="21" cy="19" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path d="m17.5 8 3.5-4 3.5 4-3.5 3.5L17.5 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ text }) => {
  return (
    <Link
      href={`/admin/${normalize(text)}`}
      className="sidebar-menu-item-container"
    >
      {text == "Članci" && <Article size={32} />}
      {text == "Države" && <GlobeHemisphereWest size={32} />}
      {text == "Mjesta" && <Buildings size={32} />}
      {text == "Sadržaj" && <Info size={32} />}
      {text == "Newsletter" && <Users size={32} />}
      {text == "Komentari" && <ChatCenteredText size={32} />}
      {text == "BookMe" && <WeddingRingsIcon />}

      {text}
    </Link>
  );
};

export default SidebarMenuItem;
