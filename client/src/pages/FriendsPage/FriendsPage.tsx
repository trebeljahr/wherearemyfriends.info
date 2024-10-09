import { FriendSearch } from "src/components/FriendSearch";
import { FriendList } from "src/components/FriendsharingList";
import { PendingFriendRequests } from "src/components/PendingFriendRequests";

export const FriendsPage = () => {
  return (
    <>
      <h1>Profile page</h1>

      <FriendList />
      <FriendSearch />
      <PendingFriendRequests />
    </>
  );
};
