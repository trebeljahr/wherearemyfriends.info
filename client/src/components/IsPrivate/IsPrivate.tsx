import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import Loading from "../Loading/Loading";

interface IsPrivateProps {
  children: ReactElement;
}

function IsPrivate({ children }: IsPrivateProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default IsPrivate;
