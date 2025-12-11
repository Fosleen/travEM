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
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  setAccessToken: () => {},
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      setAccessToken(token);

      if (token) {
        try {
          const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
          setUser({
            id: tokenDecoded.id,
            username: tokenDecoded.username,
          });
        } catch (error) {
          console.error("Error decoding token:", error);
          setUser(null);

          if (!pathname?.includes("/login")) {
            router.push("/login");
          }
        }
      } else {
        setUser(null);

        if (!pathname?.includes("/login")) {
          router.push("/login");
        }
      }
    }
  }, [accessToken, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ accessToken, user, setAccessToken, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
