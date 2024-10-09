import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import Loading from "../Loading/Loading";

interface IsAnonProps {
  children: ReactElement;
}

function IsAnon({ children }: IsAnonProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default IsAnon;
