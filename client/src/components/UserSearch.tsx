import { useState } from "react";
import { userService } from "../services/user.service";
import { useAuth } from "../context/auth.context";

export const SendFriendRequest = ({
  friendId,
  setFriendId = () => {},
}: {
  friendId: string | null;
  setFriendId?: (_id: string | null) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const addFriend = async () => {
    if (!friendId) return;

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

  if (!friendId) return null;

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

export const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchForUser = async () => {
    try {
      setLoading(true);
      const foundUser = await userService.searchForUser(username);
      if (foundUser) {
        setOtherUserId(foundUser._id);
        setMessage(`User found: ${foundUser.username}`);
      } else {
        setMessage("No user found with that username.");
      }
    } catch (error: any) {
      console.error("Error searching for friend:", error);
      setMessage("Error: " + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter friend's username"
          className="p-2 border border-gray-300 rounded-lg"
        />

        <button
          onClick={searchForUser}
          disabled={loading}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {message && <p className="mb-4">{message}</p>}

        <SendFriendRequest
          friendId={otherUserId}
          setFriendId={setOtherUserId}
        />
      </div>
    </>
  );
};
