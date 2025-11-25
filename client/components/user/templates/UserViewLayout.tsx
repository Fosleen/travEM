"use client";

import { usePathname } from "next/navigation";
import Header from "../organisms/Header";
import Footer from "../molecules/Footer";
import Newsletter from "../molecules/Newsletter";
import "./UserViewLayout.scss";
import ScrollToTop from "../../atoms/ScrollToTop";
import { useState } from "react";

const UserViewLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isHomePage =
    pathname === "/" ||
    pathname === "/pocetna" ||
    pathname.startsWith("/destinacija") ||
    pathname.startsWith("/clanak");

  const [isPlaneTicketsMenuShown, setIsPlaneTicketsMenuShown] = useState(false);
  const [isDestinationsMenuShown, setIsDestinationsMenuShown] = useState(false);
  const [isTipsMenuShown, setIsTipsMenuShown] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  return (
    <main className="user-view-layout-container">
      <ScrollToTop />
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
      <div className={`user-view-layout-page ${!isHomePage && "max-width"}`}>
        {children}
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
