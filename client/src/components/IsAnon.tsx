import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { LoadingSpinner } from "./Loading/Spinner";

interface IsAnonProps {
  children: ReactElement;
}

function IsAnon({ children }: IsAnonProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default IsAnon;
