import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { assembleImageUrl } from "../MapMarkerComponent";

export function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>

      {user && (
        <>
          <button onClick={logOutUser}>Logout</button>

          <Link to="/profile">
            <button>Profile</button>
            <img
              src={assembleImageUrl(user.profilePicture)}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              alt="profile pic"
            />
          </Link>

          <span>{user && user.username}</span>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup">
            {" "}
            <button>Sign Up</button>{" "}
          </Link>
          <Link to="/login">
            {" "}
            <button>Login</button>{" "}
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
