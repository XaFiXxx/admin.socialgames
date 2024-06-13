import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: !!Cookies.get("token"),
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
    token: Cookies.get("token") || "",
  });

  useEffect(() => {
    const user = Cookies.get("user");
    const token = Cookies.get("token");

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(user),
        token: token,
      });
    }
  }, []);

  const login = (user, token) => {
    const expirationMinutes = 5 / 1440; // Expiration des cookies à 5 minutes pour les tests
    Cookies.set("token", token, { expires: expirationMinutes });
    Cookies.set("user", JSON.stringify(user), { expires: expirationMinutes });
    setAuth({
      isAuthenticated: true,
      user: user,
      token: token,
    });
  };

  const logout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuth({
      isAuthenticated: false,
      user: null,
      token: "",
    });
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
