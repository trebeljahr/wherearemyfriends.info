import { useAuth } from "src/context/auth.context";
import { userService } from "src/services/user.service";
import { assembleImageUrl } from "./MapWithFriendMarkers";
import { FaTrash } from "react-icons/fa6";

export const backendURL = process.env.REACT_APP_SERVER_URL;

export type SharingState = "exact" | "city" | "country" | "none";

export const FriendList = () => {
  const { user, authenticateUser } = useAuth();

  // Update privacy settings on the server
  const handleSharingStateChange = async (
    friendId: string,
    newState: SharingState
  ) => {
    try {
      await userService.updateFriendPrivacy(friendId, newState);
      await authenticateUser();
    } catch (error) {
      console.error("Error updating privacy setting:", error);
    }
  };

  if (!user) {
    return null;
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await userService.removeFriend(friendId);
      await authenticateUser();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="space-y-6">
      {user.friends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center p-4 border rounded-lg shadow-sm not-prose space-x-4"
        >
          <img
            src={assembleImageUrl(friend.profilePicture)}
            alt={friend.username}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-medium">{friend.username}</h3>
            <select
              value={
                user.privacySettings.find(
                  (setting) => setting.friendId === friend._id
                )?.visibility
              }
              onChange={(e) =>
                handleSharingStateChange(
                  friend._id,
                  e.target.value as SharingState
                )
              }
              className="mt-2 p-2 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="exact">Share Full Location</option>
              <option value="city">Share City</option>
              <option value="country">Share Country</option>
              <option value="none">Share No Data</option>
            </select>
          </div>
          <div className="flex items-center">
            <button
              className="w-10 self-start h-10 bg-red-500 text-white p-1 rounded-full flex justify-center items-center"
              onClick={() => handleRemoveFriend(friend._id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
