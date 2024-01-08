import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import Header from "../organisms/Header";
import Footer from "../molecules/Footer";
import Newsletter from "../molecules/Newsletter";
import "./UserViewLayout.scss";
import { useState } from "react";

const UserViewLayout = () => {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname.startsWith("/destinacija") ||
    location.pathname.startsWith("/clanak");

  const [isPlaneTicketsMenuShown, setIsPlaneTicketsMenuShown] = useState(false);
  const [isDestinationsMenuShown, setIsDestinationsMenuShown] = useState(false);
  const [isTipsMenuShown, setIsTipsMenuShown] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  return (
    <main className="user-view-layout-container">
      <Header
        isPlaneTicketsMenuShown={isPlaneTicketsMenuShown}
        setIsPlaneTicketsMenuShown={setIsPlaneTicketsMenuShown}
        isDestinationsMenuShown={isDestinationsMenuShown}
        setIsDestinationsMenuShown={setIsDestinationsMenuShown}
        isTipsMenuShown={isTipsMenuShown}
        setIsTipsMenuShown={setIsTipsMenuShown}
        setOpenNav={setOpenNav}
        openNav={openNav}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      <div
        className={`user-view-layout-page ${
          isHomePage == false && "max-width"
        }`}
      >
        <Outlet />
      </div>
      <Newsletter />
      <Footer
        setIsPlaneTicketsMenuShown={setIsPlaneTicketsMenuShown}
        setIsDestinationsMenuShown={setIsDestinationsMenuShown}
        setIsTipsMenuShown={setIsTipsMenuShown}
        setOpenNav={setOpenNav}
        setSelectedSubcategory={setSelectedSubcategory}
      />
    </main>
  );
};

export default UserViewLayout;
