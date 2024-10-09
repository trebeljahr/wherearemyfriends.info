import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { assembleImageUrl } from "../MapWithFriendMarkers";

export function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>

      {user && (
        <>
          <Link to="/profile">
            <button>Profile</button>
          </Link>

          <Link to="/friends">
            <button>Friends</button>
          </Link>

          <div>
            <span>{user.username}</span>
            <img
              src={assembleImageUrl(user.profilePicture)}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              alt="profile pic"
            />
            <button onClick={logOutUser}>Logout</button>
          </div>
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
