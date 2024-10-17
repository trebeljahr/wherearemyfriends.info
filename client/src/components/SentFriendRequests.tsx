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
      <h2 className="text-2xl font-bold mb-4">Sent Friend Requests</h2>

      {user.sentFriendRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.sentFriendRequests.map((potentialFriend) => (
            <div
              key={potentialFriend._id}
              className="w-full flex items-center p-4 bg-white border rounded-lg shadow-sm space-x-4"
            >
              <img
                src={potentialFriend.profilePicture}
                alt={`${potentialFriend.username}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p>
                  Waiting for approval from <b>{potentialFriend.username}</b>
                </p>
              </div>
              <button onClick={() => revokeFriendRequest(potentialFriend._id)}>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500">
                  <FaTrash className="w-4 h-4" />
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
