import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "src/context/auth.context";
import { assembleImageUrl } from "./MapWithFriendMarkers";

export const FoldableUserLogo = () => {
  const { user, logOutUser } = useAuth();
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-2 flex justify-start items-center flex-col">
      <img
        className="mx-2 w-10 h-10 rounded-full"
        src={assembleImageUrl(user.profilePicture)}
        alt="profile pic"
        onClick={toggleOpen}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <button onClick={logOutUser}>Logout</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
