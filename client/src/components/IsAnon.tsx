import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { FullscreenLoader } from "./Loading/Spinner";

interface IsAnonProps {
  children: ReactElement;
}

export function IsAnon({ children }: IsAnonProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}
