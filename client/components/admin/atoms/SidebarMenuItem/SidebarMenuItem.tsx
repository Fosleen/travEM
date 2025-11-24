import Link from "next/link";
import "./SidebarMenuItem.scss";
import {
  Article,
  GlobeHemisphereWest,
  Buildings,
  Info,
} from "@phosphor-icons/react/dist/ssr";
import { FC } from "react";
import { SidebarMenuItemProps } from "../../../../common/types";
import { Users } from "@phosphor-icons/react";

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ text }) => {
  return (
    <Link
      href={`/admin/${text.toLowerCase()}`}
      className="sidebar-menu-item-container"
    >
      {text == "Članci" && <Article size={32} />}
      {text == "Države" && <GlobeHemisphereWest size={32} />}
      {text == "Mjesta" && <Buildings size={32} />}
      {text == "Sadržaj" && <Info size={32} />}
      {text == "Newsletter" && <Users size={32} />}

      {text}
    </Link>
  );
};

export default SidebarMenuItem;
