import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "src/context/auth.context";
import { assembleImageUrl } from "./MapWithFriendMarkers";

export const FoldableUserLogo = () => {
  const { user, logOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null!);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative mx-2 flex items-center" ref={menuRef}>
      <img
        className="w-10 h-10 rounded-full cursor-pointer"
        src={assembleImageUrl(user.profilePicture)}
        alt="profile pic"
        onClick={toggleOpen}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden"
          >
            <button
              onClick={logOutUser}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
