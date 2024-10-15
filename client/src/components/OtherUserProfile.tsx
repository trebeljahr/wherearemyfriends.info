import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OtherUser } from "../lib/types";
import { userService } from "../services/user.service";
import { assembleImageUrl } from "../lib/consts";
import { SendFriendRequest } from "./UserSearch";
import { useAuth } from "../context/auth.context";
import { DisplaySingleFriendRequest } from "./PendingFriendRequests";

export const OtherUserProfile: React.FC = () => {
  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!username) return;
        const otherUser = await userService.getUserProfile(username);
        setOtherUser(otherUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [username]);

  // const sendFriendRequest = async () => {
  //   try {
  //     if (!id) await userService.makeFriendRequest(id);
  //     setFriendRequestStatus("sent");
  //   } catch (error) {
  //     console.error("Error sending friend request:", error);
  //     setFriendRequestStatus("error");
  //   }
  // };

  if (!otherUser) {
    return <div>Loading...</div>;
  }

  const alreadyFriends = user?.friends
    .map(({ _id }) => _id)
    .includes(otherUser._id);
  const sameUser = user?._id === otherUser._id;
  const alreadySentFriendRequest = user?.sentFriendRequests.includes(
    otherUser._id
  );
  const alreadyReceivedFriendRequest = user?.pendingFriendRequests.includes(
    otherUser._id
  );

  return (
    <div className="py-24 min-h-screen rounded-lg p-6">
      <h1>Profile Page</h1>
      <img
        src={assembleImageUrl(otherUser.profilePicture)}
        alt={`${otherUser.username}'s profile`}
        className="w-32 h-32 rounded-full mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">
        <b>username:</b> {otherUser.username}
      </h2>

      {alreadyFriends ? (
        <p>You are already friends with this user</p>
      ) : sameUser ? (
        <p>This is you.</p>
      ) : alreadySentFriendRequest ? (
        <p>Friend request already sent</p>
      ) : alreadyReceivedFriendRequest ? (
        <div>
          <p>You already have a friend request from this person. Accept it?</p>
          <DisplaySingleFriendRequest
            request={{
              id: otherUser._id,
              username: otherUser.username,
              profilePicture: otherUser.profilePicture,
            }}
          />
        </div>
      ) : (
        <SendFriendRequest friendId={otherUser._id} />
      )}
      {/* <button
        onClick={sendFriendRequest}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        disabled={friendRequestStatus === "sent"}
      >
        {friendRequestStatus === "sent" ? (
          <>
            <FaCheckCircle className="mr-2" /> Friend Request Sent
          </>
        ) : (
          "Send Friend Request"
        )}
      </button>
      {friendRequestStatus === "error" && (
        <p className="text-red-500 text-center mt-2">
          Failed to send friend request.
        </p>
      )} */}
    </div>
  );
};
