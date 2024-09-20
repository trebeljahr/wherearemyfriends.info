import { ReactElement, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { Navigate } from "react-router-dom";
import Loading from "../Loading/Loading";

interface IsPrivateProps {
  children: ReactElement;
}

function IsPrivate({ children }: IsPrivateProps) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default IsPrivate;
