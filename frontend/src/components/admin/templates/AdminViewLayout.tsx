import { Outlet } from "react-router-dom";
import "./AdminViewLayout.scss";
import SidebarMenu from "../molecules/SidebarMenu";
import ScrollToTop from "../../atoms/ScrollToTop";

const AdminViewLayout = () => {
  return (
    <div className="admin-view-layout-container">
      <ScrollToTop />
      <div className="admin-view-sidebar">
        <SidebarMenu />
      </div>
      <div className="admin-view-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminViewLayout;
