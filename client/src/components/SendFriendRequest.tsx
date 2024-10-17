import { useState } from "react";
import { useAuth } from "../context/auth.context";
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
    } catch (error: any) {
      console.error("Error adding friend:", error);
      setMessage("Error: " + error.response.data.message);
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
      onClick={addFriend}
      disabled={loading}
      className="p-2 bg-green-500 text-white rounded-lg"
    >
      {loading ? "Adding..." : "Add Friend"}
    </button>
  );
};
