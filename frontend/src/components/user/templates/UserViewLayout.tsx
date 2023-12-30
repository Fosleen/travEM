import { Outlet } from "react-router";
import Header from "../molecules/Header";
import Footer from "../molecules/Footer";
import Newsletter from "../molecules/Newsletter";
import "./UserViewLayout.scss";

const UserViewLayout = () => {
  return (
    <main className="user-view-layout-container">
      <Header />
      <div className="user-view-layout-page">
        <Outlet />
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default UserViewLayout;
