import { useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { SendFriendRequest } from "./SendFriendRequest";

export const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!otherUserId) {
      setUsername("");
      setMessage("");
      setLoading(false);
    }
  }, [otherUserId]);

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
        <h2 className="text-2xl font-bold mb-4">Add a New Friend</h2>

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

        {otherUserId && (
          <SendFriendRequest
            friendId={otherUserId}
            setFriendId={setOtherUserId}
          />
        )}
      </div>
    </>
  );
};
