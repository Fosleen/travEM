import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import Header from "../molecules/Header";
import Footer from "../molecules/Footer";
import Newsletter from "../molecules/Newsletter";
import "./UserViewLayout.scss";
import ScrollToTop from "../../atoms/ScrollToTop/ScrollToTop";

const UserViewLayout = () => {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname.startsWith("/destinacija") ||
    location.pathname.startsWith("/clanak");

  return (
    <main className="user-view-layout-container">
      <ScrollToTop />
      <Header />
      <div
        className={`user-view-layout-page ${
          isHomePage == false && "max-width"
        }`}
      >
        <Outlet />
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default UserViewLayout;
