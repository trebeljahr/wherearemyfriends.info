import { useState } from "react";
import { useAuth } from "../context/auth.context";
import { getErrorMessage } from "../lib/types";
import { userService } from "../services/user.service";

export const SendFriendRequest = ({
  friendId,
  setFriendId = () => {},
}: {
  friendId: string;
  setFriendId?: (_id: string | null) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const addFriend = async () => {
    try {
      setLoading(true);
      const data = await userService.makeFriendRequest(friendId);
      setMessage(data.message);
      setFriendId(null);
      await refreshUser();
    } catch (error) {
      console.error("Error adding friend:", error);
      setMessage("Error: " + getErrorMessage(error));
      setFriendId(null);
    } finally {
      setLoading(false);
      setFriendId(null);
    }
  };

  return message ? (
    <p className="mb-4">{message}</p>
  ) : (
    <button
      type="button"
      onClick={addFriend}
      disabled={loading}
      className="p-2 bg-green-500 text-white rounded-lg"
    >
      {loading ? "Adding..." : "Add Friend"}
    </button>
  );
};
