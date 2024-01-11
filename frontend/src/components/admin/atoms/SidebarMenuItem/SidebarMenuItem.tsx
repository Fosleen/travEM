import { Link } from "react-router-dom";
import "./SidebarMenuItem.scss";
import {
  Article,
  GlobeHemisphereWest,
  Buildings,
  Info,
} from "@phosphor-icons/react/dist/ssr";
import { FC } from "react";

interface SidebarMenuItemProps {
  text: string;
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ text }) => {
  return (
    <Link
      to={`/admin/${text.toLowerCase()}`}
      className="sidebar-menu-item-container"
    >
      {text == "Članci" && <Article size={32} />}
      {text == "Države" && <GlobeHemisphereWest size={32} />}
      {text == "Mjesta" && <Buildings size={32} />}
      {text == "Sadržaj" && <Info size={32} />}
      {text}
    </Link>
  );
};

export default SidebarMenuItem;
