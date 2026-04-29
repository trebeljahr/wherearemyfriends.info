import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import type { AuthContextType, LoggedInUser } from "../lib/types";
import authService from "../services/auth.service";

const AuthContext = createContext({} as AuthContextType);

function AuthProviderWrapper(props: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const storeToken = (token: string) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const user = await authService.verify();
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
        setAuthToken(storedToken);
      } catch (_error) {
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        authToken,
        storeToken,
        authenticateUser,
        refreshUser: authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext, AuthProviderWrapper, useAuth };
