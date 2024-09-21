import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";

export type UserType = {
  email: string;
  username: string;
  _id: string;
};

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: null | UserType;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
}

const AuthContext = React.createContext({} as AuthContextType);

function AuthProviderWrapper(props: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token: string) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const response = await authService.verify();
        const user = response.data;
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
      } catch (error) {
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      // If the token is not available
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    // Upon logout, remove the token from the localStorage
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    // Run this code once the AuthProviderWrapper component in the App loads for the first time.
    // This effect runs when the application and the AuthProviderWrapper component load for the first time.
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
