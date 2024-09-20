import React, { useState } from "react";

type SharingState = "full" | "city" | "country" | "none";

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  sharingState: SharingState;
};

type FriendListProps = {
  friends: Friend[];
  onSharingStateChange: (id: string, newState: SharingState) => void;
};

export const FriendList: React.FC<FriendListProps> = ({
  friends,
  onSharingStateChange,
}) => {
  const [sharingStates, setSharingStates] = useState(() =>
    friends.reduce((acc, friend) => {
      acc[friend.id] = friend.sharingState;
      return acc;
    }, {} as Record<string, SharingState>)
  );

  const handleSharingChange = (friendId: string, newState: SharingState) => {
    setSharingStates((prevStates) => ({
      ...prevStates,
      [friendId]: newState,
    }));
    onSharingStateChange(friendId, newState);
  };

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
              value={sharingStates[friend.id]}
              onChange={(e) =>
                handleSharingChange(friend.id, e.target.value as SharingState)
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
