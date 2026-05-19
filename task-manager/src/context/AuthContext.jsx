import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isAuthenticated = Boolean(token);

  const login = async (formData) => {
    const authData = await loginUser(formData);

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));

    setToken(authData.token);
    setUser(authData.user);

    return authData.user;
  };

  const register = async (formData) => {
    return registerUser(formData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
