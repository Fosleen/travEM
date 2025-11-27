// app/admin/layout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarMenu from "@/components/admin/molecules/SidebarMenu";
import ScrollToTop from "@/components/atoms/ScrollToTop";
import { AuthProvider } from "@/Context/AuthContext";
import "@/components/admin/templates/AdminViewLayout.scss";

// Token expiration helper
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

  useEffect(() => {
    // Check authentication on client side only
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      
      // Allow access to login page without token
      if (pathname === "/admin/login") {
        return;
      }

      // Redirect to login if no token or token expired
      if (!token || isTokenExpired(token)) {
        router.push("/admin/login");
      }
    }
  }, [pathname, router]);

  // If on login page, don't show sidebar
  if (pathname === "/admin/login") {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="admin-view-layout-container">
        <ScrollToTop />
        <div className="admin-view-sidebar">
          <SidebarMenu />
        </div>
        <div className="admin-view-content">{children}</div>
      </div>
    </AuthProvider>
  );
}