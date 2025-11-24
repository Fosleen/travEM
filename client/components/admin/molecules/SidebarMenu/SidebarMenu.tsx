//@ts-nocheck

import SidebarMenuItem from "../../atoms/SidebarMenuItem";
import logo from "../../../../assets/images/travem-logo-grey.avif";
import "./SidebarMenu.scss";
import { Link, useNavigate } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const SidebarMenu = () => {
  const [expirationTime, setExpirationTime] = useState("");

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const jwtExpiration = localStorage.getItem("jwtExpiration");
    if (jwtExpiration) {
      const expirationDate = new Date(jwtExpiration * 1000);
      setExpirationTime(
        expirationDate.toLocaleString("en-GB", { hour12: false })
      );
    }

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > jwtExpiration) {
        handleLogout();
      }
    }, 900000); //svakih 15 minuta se provjerava

    return () => clearInterval(interval);
  }, []);

  return (
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
          <SidebarMenuItem text={"Newsletter"} />
        </div>
      </div>
      <div className="sidebar-menu-items">
        <div style={{ padding: "16px" }}>
          Token ističe u: <br /> {expirationTime}
        </div>
        <div
          className="sidebar-menu-item-container"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <SignOut size={32} onClick={handleLogout} /> Odjava
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
