import { motion } from "framer-motion";
import { useState } from "react";
import { FaBars, FaX } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useAuth } from "src/context/auth.context";
import { assembleImageUrl } from "../MapWithFriendMarkers";

const Navbar = () => {
  const { user, logOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const UserStuff = user && (
    <div className="mx-2 flex justify-center items-center">
      <span>Welcome, {user.username}</span>
      <img
        className="mx-2 w-10 h-10 rounded-full"
        src={assembleImageUrl(user.profilePicture)}
        alt="profile pic"
      />
      <button onClick={logOutUser}>Logout</button>
    </div>
  );

  const links = (
    <>
      {user ? (
        <>
          <CustomNavLink to="/">Home</CustomNavLink>
          <CustomNavLink to="/profile">Profile</CustomNavLink>
          <CustomNavLink to="/friends">Friends</CustomNavLink>
        </>
      ) : (
        <>
          <CustomNavLink to="/login">Login</CustomNavLink>
          <CustomNavLink to="/signup">Signup</CustomNavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-lg w-screen px-4 sm:px-6 lg:px-8 absolute top-0">
      <div className="flex items-center justify-between h-16">
        <NavLink to="/" className="text-white">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full"
              src="/favicon/android-chrome-192x192.png"
              alt="logo favicon"
            />
            <div className="text-xl font-bold mx-2">wherearemyfriends.info</div>
          </div>
        </NavLink>

        {UserStuff}

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">{links}</div>

        {/* Mobile Menu Icon */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isOpen ? <FaX size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          className="md:hidden bg-gray-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{links}</div>
        </motion.div>
      )}
    </nav>
  );
};

const CustomNavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
          isActive
            ? "text-white bg-blue-600"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default Navbar;
