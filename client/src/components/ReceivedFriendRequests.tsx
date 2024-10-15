import { useEffect, useState } from "react";
import { useAuth } from "../context/auth.context";
import { OtherUser } from "../lib/types";
import { userService } from "../services/user.service";
import { DisplaySingleFriendRequest } from "./DisplaySingleFriendRequest";

export const ReceivedFriendRequests = () => {
  const { user } = useAuth();

  const [receivedRequests, setReceivedRequests] = useState<OtherUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!user) {
        return;
      }

      try {
        const data = await userService.fetchReceivedRequests();
        setReceivedRequests(data);
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
      ) : receivedRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <ul>
          {receivedRequests.map((request) => (
            <DisplaySingleFriendRequest
              request={request}
              setRequests={setReceivedRequests}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
