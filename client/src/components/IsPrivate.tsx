import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { LoadingSpinner } from "./Loading/LoadingSpinner";

interface IsPrivateProps {
  children: ReactElement;
}

function IsPrivate({ children }: IsPrivateProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default IsPrivate;
