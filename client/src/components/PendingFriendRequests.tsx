import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/auth.context";
import { assembleImageUrl } from "../lib/consts";
import { userService } from "../services/user.service";

export const DisplaySingleFriendRequest = ({
  request,
  setPendingRequests = () => {},
}: {
  request: UserRequest;
  setPendingRequests?: Dispatch<SetStateAction<UserRequest[]>>;
}) => {
  const { user, refreshUser } = useAuth();

  const handleAccept = async (requesterId: string) => {
    if (!user) {
      return;
    }

    try {
      await userService.acceptFriendRequest(requesterId);
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requesterId)
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

      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requesterId)
      );
    } catch (err) {
      alert("Failed to decline friend request.");
    }
  };

  return (
    <li key={request.id} className="mb-4 flex items-center">
      <img
        src={assembleImageUrl(request.profilePicture)}
        alt={`${request.username}'s avatar`}
        className="w-12 h-12 rounded-full"
      />
      <span className="ml-4">{request.username}</span>
      <div className="mt-2 ml-auto">
        <button
          onClick={() => handleAccept(request.id)}
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => handleDecline(request.id)}
          className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600"
        >
          Decline
        </button>
      </div>
    </li>
  );
};

type UserRequest = {
  id: string;
  username: string;
  profilePicture: string;
};

export const PendingFriendRequests = () => {
  const { user } = useAuth();

  const [pendingRequests, setPendingRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!user) {
        return;
      }

      try {
        const data = await userService.fetchPendingRequests();
        setPendingRequests(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pending friend requests.");
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [user]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : pendingRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <DisplaySingleFriendRequest
              request={request}
              setPendingRequests={setPendingRequests}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
