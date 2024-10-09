import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { FaBars, FaX } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useAuth } from "src/context/auth.context";
import { FoldableUserLogo } from "../FoldableUserLogo";
import { CustomNavLink } from "./CustomNavlink";

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const PreconfiguredNavlink: typeof NavLink = forwardRef(({ ...props }, _) => {
    return (
      <CustomNavLink
        {...props}
        className="h-fit"
        onClick={() => setIsOpen(false)}
      />
    );
  });

  const links = (
    <>
      {user ? (
        <>
          <PreconfiguredNavlink to="/">Home</PreconfiguredNavlink>
          <PreconfiguredNavlink to="/profile">Profile</PreconfiguredNavlink>
          <PreconfiguredNavlink to="/friends">Friends</PreconfiguredNavlink>
        </>
      ) : (
        <>
          <PreconfiguredNavlink to="/login">Login</PreconfiguredNavlink>
          <PreconfiguredNavlink to="/signup">Signup</PreconfiguredNavlink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-lg w-screen px-4 sm:px-6 lg:px-8 absolute top-0 z-[1200]">
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

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <FoldableUserLogo />

          <div className="flex items-center space-x-4">{links}</div>
        </div>

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-gray-800 overflow-hidden z-10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <FoldableUserLogo />

              {links}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
