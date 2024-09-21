import React, { useState, useEffect } from "react";
import axios from "axios";

export const backendURL = process.env.REACT_APP_SERVER_URL;

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  sharingState: "full" | "city" | "country" | "none";
};

type FriendListProps = {
  userId: string; // User ID of the current user
};

export const FriendList: React.FC<FriendListProps> = ({ userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch friends and their privacy settings from the backend
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/friends/${userId}`);
        setFriends(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  // Update privacy settings on the server
  const handleSharingStateChange = async (
    friendId: string,
    newState: "full" | "city" | "country" | "none"
  ) => {
    try {
      await axios.put(`${backendURL}/api/friends/${userId}/privacy`, {
        friendId,
        newVisibility: newState,
      });

      // Update the state locally after the successful API request
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === friendId
            ? { ...friend, sharingState: newState }
            : friend
        )
      );
    } catch (error) {
      console.error("Error updating privacy setting:", error);
    }
  };

  if (loading) return <div>Loading friends...</div>;

  return (
    <div className="space-y-6">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center p-4 border rounded-lg shadow-sm"
        >
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-medium">{friend.name}</h3>
            <select
              value={friend.sharingState}
              onChange={(e) =>
                handleSharingStateChange(
                  friend.id,
                  e.target.value as "full" | "city" | "country" | "none"
                )
              }
              className="mt-2 p-2 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="full">Share Full Location</option>
              <option value="city">Share City</option>
              <option value="country">Share Country</option>
              <option value="none">Share No Data</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
