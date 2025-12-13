"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  setAccessToken: () => {},
  setUser: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

function getInitialAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem("jwt");

  if (!token) {
    return { token: null, user: null };
  }

  try {
    const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
    return {
      token,
      user: {
        id: tokenDecoded.id,
        username: tokenDecoded.username,
      },
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { token: null, user: null };
  }
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const initialAuth = getInitialAuth();
  const [accessToken, setAccessToken] = useState<string | null>(
    initialAuth.token
  );
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("jwt");
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !accessToken &&
      !pathname?.includes("/login")
    ) {
      router.push("/login");
    }
  }, [accessToken, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ accessToken, user, setAccessToken, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
