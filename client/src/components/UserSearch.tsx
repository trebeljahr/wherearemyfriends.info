import { useState } from "react";
import { userService } from "src/services/user.service";

export const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [friendId, setFriendId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchForUser = async () => {
    try {
      setLoading(true);
      const foundFriend = await userService.searchForUser(username);
      if (foundFriend) {
        setFriendId(foundFriend._id);
        setMessage(`User found: ${foundFriend.username}`);
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

  const addFriend = async () => {
    if (!friendId) return;

    try {
      setLoading(true);
      const data = await userService.makeFriendRequest(friendId);
      setMessage(data.message);
      setFriendId(null);
    } catch (error: any) {
      console.error("Error adding friend:", error);
      setMessage("Error: " + error.response.data.message);
      setFriendId(null);
    } finally {
      setLoading(false);
      setFriendId(null);
    }
  };

  return (
    <div className="friend-search">
      <h2 className="text-xl mb-4">Add a New Friend</h2>
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
      </div>

      {message && <p className="mb-4">{message}</p>}

      {friendId && (
        <button
          onClick={addFriend}
          disabled={loading}
          className="p-2 bg-green-500 text-white rounded-lg"
        >
          {loading ? "Adding..." : "Add Friend"}
        </button>
      )}
    </div>
  );
};
