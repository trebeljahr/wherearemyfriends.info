import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "./FriendsharingList";
import { userService } from "src/services/user.service";

type FriendSearchProps = {
  userId: string; // ID of the current user
};

export const FriendSearch: React.FC<FriendSearchProps> = ({ userId }) => {
  const [username, setUsername] = useState("");
  const [friendId, setFriendId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Search for the friend by username
  const searchForFriend = async () => {
    try {
      setLoading(true);
      const foundFriend = await userService.searchForFriend(username);
      if (foundFriend) {
        setFriendId(foundFriend._id);
        setMessage(`Friend found: ${foundFriend.username}`);
      } else {
        setMessage("No friend found with that username.");
      }
    } catch (error) {
      console.error("Error searching for friend:", error);
      setMessage("Error searching for friend.");
    } finally {
      setLoading(false);
    }
  };

  // Add the friend to the user's friend list
  const addFriend = async () => {
    if (!friendId) return;

    try {
      setLoading(true);
      const data = await userService.makeFriendRequest(friendId);
      setMessage(data.message);
    } catch (error) {
      console.error("Error adding friend:", error);
      setMessage("Error adding friend.");
    } finally {
      setLoading(false);
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
          onClick={searchForFriend}
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
