import SidebarMenuItem from "../../atoms/SidebarMenuItem";
import logo from "../../../../assets/images/travem-logo-grey.png";
import "./SidebarMenu.scss";
import { Link, useNavigate } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };
  return (
    <div>
      <div className="sidebar-menu-container">
        <div>
          <Link to="/admin" className="sidebar-menu-logo">
            <img src={logo} alt="travem-logo-grey" />
          </Link>
          <div className="sidebar-menu-items">
            <SidebarMenuItem text={"Članci"} />
            <SidebarMenuItem text={"Države"} />
            <SidebarMenuItem text={"Mjesta"} />
            <SidebarMenuItem text={"Sadržaj"} />
          </div>
        </div>
      </div>
      <div
        className="sidebar-menu-item-container"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      >
        <SignOut size={32} onClick={handleLogout} /> odjava
      </div>
    </div>
  );
};

export default SidebarMenu;
