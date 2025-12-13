"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarMenu from "@/components/admin/molecules/SidebarMenu";
import ScrollToTop from "@/components/atoms/ScrollToTop";
import "@/components/admin/templates/AdminViewLayout.scss";
import { AuthProvider } from "@/context/AuthContext";

function isTokenExpired(token: string | null) {
  if (!token) return true;
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      const checkAuth = () => {
        const token = localStorage.getItem("jwt");

        if (pathname === "/login") {
          if (isMounted) setIsChecking(false);
          return;
        }

        if (!token || isTokenExpired(token)) {
          router.push("/login");
        } else {
          if (isMounted) setIsChecking(false);
        }
      };

      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (pathname === "/login") {
    return (
      <AuthProvider>
        {children}
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
      </AuthProvider>
    );
  }

  if (isChecking) {
    return null;
  }

  return (
    <AuthProvider>
      <div className="admin-view-layout-container">
        <ScrollToTop />
        <div className="admin-view-sidebar">
          <SidebarMenu />
        </div>
        <div className="admin-view-content">{children}</div>
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
      </div>
    </AuthProvider>
  );
}
