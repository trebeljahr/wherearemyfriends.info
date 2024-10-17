import { Dispatch, SetStateAction } from "react";
import { useAuth } from "../context/auth.context";
import { OtherUser } from "../lib/types";
import { userService } from "../services/user.service";

export const DisplaySingleFriendRequest = ({
  request,
  setRequests = () => {},
}: {
  request: OtherUser;
  setRequests?: Dispatch<SetStateAction<OtherUser[]>>;
}) => {
  const { user, refreshUser } = useAuth();

  const handleAccept = async (requesterId: string) => {
    if (!user) {
      return;
    }

    try {
      await userService.acceptFriendRequest(requesterId);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requesterId)
      );
      await refreshUser();
    } catch (err) {
      alert("Failed to accept friend request.");
    }
  };

  const handleDecline = async (requesterId: string) => {
    if (!user) {
      return;
    }

    try {
      await userService.declineFriendRequest(requesterId);

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requesterId)
      );
    } catch (err) {
      alert("Failed to decline friend request.");
    }
  };

  return (
    <li key={request._id} className="mb-4 flex items-center">
      <img
        src={request.profilePicture}
        alt={`${request.username}'s avatar`}
        className="w-12 h-12 rounded-full"
      />
      <span className="ml-4">{request.username}</span>
      <div className="mt-2 ml-auto">
        <button
          onClick={() => handleAccept(request._id)}
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => handleDecline(request._id)}
          className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600"
        >
          Decline
        </button>
      </div>
    </li>
  );
};
