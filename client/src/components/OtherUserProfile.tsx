import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OtherUser } from "../lib/types";
import { userService } from "../services/user.service";
import { useAuth } from "../context/auth.context";
import { DisplaySingleFriendRequest } from "./DisplaySingleFriendRequest";
import { SendFriendRequest } from "./SendFriendRequest";
import { DefaultPrivacySettingForOtherUser } from "./DefaultPrivacySetting";

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

  if (!otherUser) {
    return <div>Loading...</div>;
  }

  const alreadyFriends = user?.friends
    .map(({ _id }) => _id)
    .includes(otherUser._id);
  const sameUser = user?._id === otherUser._id;
  const alreadySentFriendRequest = user?.sentFriendRequests
    .map(({ _id }) => _id)
    .includes(otherUser._id);
  const alreadyReceivedFriendRequest = user?.receivedFriendRequests
    .map(({ _id }) => _id)
    .includes(otherUser._id);

  return (
    <div className="py-24 min-h-screen rounded-lg p-6">
      <h1>Profile Page</h1>
      <img
        src={otherUser.profilePicture}
        alt={`${otherUser.username}'s profile`}
        className="w-32 h-32 rounded-full mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">
        <b>username:</b> {otherUser.username}{" "}
        {sameUser && <span className="ml-2 font-thin">(This is you)</span>}
      </h2>

      <DefaultPrivacySettingForOtherUser otherUser={otherUser} />

      {alreadyFriends ? (
        <p>You are already friends with this user</p>
      ) : alreadySentFriendRequest ? (
        <p>Friend request already sent</p>
      ) : alreadyReceivedFriendRequest ? (
        <div>
          <p>You already have a friend request from this person. Accept it?</p>
          <DisplaySingleFriendRequest request={otherUser} />
        </div>
      ) : (
        !sameUser && <SendFriendRequest friendId={otherUser._id} />
      )}
    </div>
  );
};
