import React, { createContext, useContext, useEffect, useState } from "react";
import { SharingState } from "src/components/FriendsharingList";
import { SingleLocation } from "src/services/user.service";
import authService from "../services/auth.service";

export type UserType = {
  email: string;
  username: string;
  profilePicture: string;
  location: {
    exact?: SingleLocation;
    city?: SingleLocation;
    country?: SingleLocation;
  };
  privacySettings: {
    friendId: string;
    visibility: SharingState;
  }[];
  friends: UserType[];
  _id: string;
};

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserType | null;
  authToken: string | null;
  storeToken: (token: string) => void;
  authenticateUser: () => Promise<void>;
  logOutUser: () => void;
}

const AuthContext = createContext({} as AuthContextType);

function AuthProviderWrapper(props: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
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
      } catch (error) {
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
        authToken,
        storeToken,
        authenticateUser,
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
