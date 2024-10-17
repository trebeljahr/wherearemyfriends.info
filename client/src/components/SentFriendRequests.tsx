import { FaTrash } from "react-icons/fa6";
import { useAuth } from "../context/auth.context";
import { userService } from "../services/user.service";

export const SentFriendRequests = () => {
  const { user, refreshUser } = useAuth();

  if (!user) {
    return null;
  }

  const revokeFriendRequest = async (friendId: string) => {
    try {
      await userService.revokeFriendRequest(friendId);
      await refreshUser();
    } catch (error) {
      console.error("Failed to revoke friend request:", error);
    }
  };

  return (
    <div>
      {user.sentFriendRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <div>
          {user.sentFriendRequests.map((potentialFriend) => (
            <div key={potentialFriend._id} className="flex items-center my-4">
              <img
                src={potentialFriend.profilePicture}
                alt={`${potentialFriend.username}'s profile`}
                className="w-10 h-10 rounded-full my-0 mr-4"
              />
              <p className="my-0">
                Waiting for approval from request to{" "}
                <b>{potentialFriend.username}</b>
              </p>
              <button onClick={() => revokeFriendRequest(potentialFriend._id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
