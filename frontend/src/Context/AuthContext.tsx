//@ts-nocheck
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext({
  accessToken: null,
  user: null,
  setAccessToken: () => {},
});

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("jwt")
  );
  const [user, setUser] = useState(null); // Initialize user state as null

  const navigate = useNavigate();

  useEffect(() => {
    // Decode the token to get user information
    const token = localStorage.getItem("jwt");
    if (token) {
      // Parse the token and set user state
      try {
        const tokenDecoded = JSON.parse(atob(token.split(".")[1]));
        setUser(tokenDecoded.user);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
      navigate("/login");
    }
  }, [accessToken, navigate]);

  return (
    <AuthContext.Provider value={{ accessToken, user, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
