import { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import Loading from "../Loading/Loading";

interface IsAnonProps {
  children: ReactElement;
}

function IsAnon({ children }: IsAnonProps) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If the authentication is still loading ⏳
  if (isLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    // If the user is logged in, navigate to home page ❌
    return <Navigate to="/" />;
  }

  // If the user is not logged in, allow to see the page ✅
  return children;
}

export default IsAnon;
