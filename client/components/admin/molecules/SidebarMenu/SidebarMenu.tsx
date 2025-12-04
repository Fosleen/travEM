"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SignOut } from "@phosphor-icons/react";
import SidebarMenuItem from "../../atoms/SidebarMenuItem";
import "./SidebarMenu.scss";

const SidebarMenu = () => {
  const [expirationTime, setExpirationTime] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  useEffect(() => {
    const jwtExpiration = localStorage.getItem("jwtExpiration");

    if (jwtExpiration) {
      const expirationDate = new Date(Number(jwtExpiration) * 1000);
      setExpirationTime(
        expirationDate.toLocaleString("en-GB", { hour12: false })
      );
    }

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const storedExpiration = localStorage.getItem("jwtExpiration");

      if (storedExpiration && currentTime > Number(storedExpiration)) {
        handleLogout();
      }
    }, 900000); // Check every 15 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar-menu-container">
      <div>
        <Link href="/admin" className="sidebar-menu-logo">
          <Image
            src="/images/travem-logo-grey.webp"
            alt="travem-logo-grey"
            width={80}
            height={50}
            priority
          />
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
          <SignOut size={32} /> Odjava
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
