import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { FullscreenLoader } from "./Loading/Spinner";

interface IsPrivateProps {
  children: ReactElement;
}

export function IsPrivate({ children }: IsPrivateProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
