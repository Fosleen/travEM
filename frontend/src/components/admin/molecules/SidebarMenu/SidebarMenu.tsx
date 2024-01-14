import SidebarMenuItem from "../../atoms/SidebarMenuItem";
import logo from "../../../../assets/images/travem-logo-grey.png";
import "./SidebarMenu.scss";
import { Link } from "react-router-dom";

const SidebarMenu = () => {
  return (
    <div className="sidebar-menu-container">
      <Link to="/admin" className="sidebar-menu-logo">
        <img src={logo} alt="travem-logo-grey" />
      </Link>
      <div className="sidebar-menu-items">
        <SidebarMenuItem text={"Članci"} />
        <SidebarMenuItem text={"Države"} />
        <SidebarMenuItem text={"Mjesta"} />
        <Link to="admin/meni-uredi-pocetnu">
          <SidebarMenuItem text={"Sadržaj"} />
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
