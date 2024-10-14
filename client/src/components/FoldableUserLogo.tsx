import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "src/context/auth.context";
import { assembleImageUrl } from "src/lib/createAvatarMarkerMaplibreGL";

export const useCloseWhenClickedOutside = ({
  ref,
  open,
  setOpen,
}: {
  ref: React.RefObject<HTMLElement>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    },
    [ref, setOpen]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);
};

export const FoldableUserLogo = () => {
  const { user, logOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null!);

  useCloseWhenClickedOutside({ ref: menuRef, open, setOpen });
  const handleLogout = () => {
    logOutUser();
    setOpen(false);
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative mx-2 not-prose flex items-center" ref={menuRef}>
      <img
        className="w-8 h-8 rounded-full cursor-pointer"
        src={assembleImageUrl(user.profilePicture)}
        alt="profile pic"
        onClick={toggleOpen}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute right-0 top-[152%] md:top-[132%] w-fit text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden"
          >
            <div className="w-52 px-4 py-2">
              <p>
                Welcome <b>{user.username}</b>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
