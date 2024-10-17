import { FaTrash } from "react-icons/fa6";
import { useAuth } from "../context/auth.context";
import { SharingState } from "../lib/types";
import { userService } from "../services/user.service";
import { ChangeEventHandler } from "react";

const PrivacyOptionComponent = ({
  value,
  onChange,
}: {
  value: SharingState | undefined;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className="p-2 mx-2 border border-gray-300 rounded-lg shadow-sm"
    >
      <option value="exact">
        {/* <FaMapPin className="w-2 h-2" /> */}
        sharing your exact location
      </option>
      <option value="city">
        {/* <FaCity /> */}
        sharing your city location
      </option>
      <option value="country">
        {/* <FaMap /> */}
        sharing your country location
      </option>
      {/* <FaExclamationTriangle /> */}
      <option value="none">sharing absolutely no location</option>
    </select>
  );
};

export const FriendsPrivacySettings = () => {
  const { user, refreshUser } = useAuth();

  const handleSharingStateChange = async (
    friendId: string,
    newState: SharingState
  ) => {
    try {
      await userService.updateFriendPrivacy(friendId, newState);
      await refreshUser();
    } catch (error) {
      console.error("Error updating privacy setting:", error);
    }
  };

  const updateDefaultPrivacy = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    try {
      await userService.updateDefaultPrivacy(e.target.value as SharingState);
      await refreshUser();
    } catch (error) {
      console.error("Error updating default privacy setting:", error);
    }
  };

  if (!user) {
    return null;
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await userService.removeFriend(friendId);
      await refreshUser();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="space-y-6">
      {user.friends.length === 0 && (
        <p className="text-lg">You have no friends yet.</p>
      )}

      <div className="w-full flex items-center p-4 border rounded-lg shadow-sm not-prose space-x-4 flex-wrap">
        <p>You are</p>
        <PrivacyOptionComponent
          value={user.defaultPrivacy}
          onChange={updateDefaultPrivacy}
        />
        <p>per default with new friends.</p>
      </div>

      {user.friends.map((friend) => (
        <div
          key={friend._id}
          className="w-full flex items-center p-4 border rounded-lg shadow-sm not-prose space-x-4 flex-wrap"
        >
          <img
            src={friend.profilePicture}
            alt={friend.username}
            className="w-10 h-10 rounded-full"
          />

          <p>you are</p>
          <PrivacyOptionComponent
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
          />

          <p>
            with <b>{friend.username}</b>
          </p>

          <div className="flex items-center justify-self-end self-end">
            <p className="mr-2">Remove friend?</p>
            <button
              className="w-10 h-10 bg-red-400 text-white p-1 rounded-full flex justify-center items-center"
              onClick={() => handleRemoveFriend(friend._id)}
              aria-label="Remove friend"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
