import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { FullscreenLoader } from "./Loading/Spinner";

interface IsAnonProps {
  children: ReactElement;
}

export function IsAnon({ children }: IsAnonProps) {
  const { isLoggedIn, isLoading } = useAuth();

  console.log("IsAnon is rendered");
  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (isLoggedIn) {
    console.log("Redirecting to location page from IsAnon");
    return <Navigate to="/location" />;
  }

  return children;
}
