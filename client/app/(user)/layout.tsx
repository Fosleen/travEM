"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/user/organisms/Header";
import Footer from "@/components/user/molecules/Footer";
import Newsletter from "@/components/user/molecules/Newsletter";
import ScrollToTop from "@/components/atoms/ScrollToTop";
import { ArticleProvider } from "@/context/ArticleContext";
import "../../components/user/templates/UserViewLayout.scss";
import { PlaneTicketsProvider } from "@/context/PlaneTicketsMenuContext";
import { ContinentProvider } from "@/context/ContinentContext";
import { CountryProvider } from "@/context/CountryContext";

export default function UserViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" ||
    pathname.startsWith("/destinacija") ||
    pathname.startsWith("/clanak");
  const [isPlaneTicketsMenuShown, setIsPlaneTicketsMenuShown] = useState(false);
  const [isDestinationsMenuShown, setIsDestinationsMenuShown] = useState(false);
  const [isTipsMenuShown, setIsTipsMenuShown] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  return (
    <ArticleProvider>
      <PlaneTicketsProvider>
        <ContinentProvider>
          <CountryProvider>
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
              <div
                className={`user-view-layout-page ${
                  !isHomePage ? "max-width" : ""
                }`}
              >
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
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </main>
          </CountryProvider>
        </ContinentProvider>
      </PlaneTicketsProvider>
    </ArticleProvider>
  );
}
