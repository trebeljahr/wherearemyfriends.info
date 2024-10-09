import { FriendSearch } from "src/components/FriendSearch";
import { FriendList } from "src/components/FriendsharingList";
import { PendingFriendRequests } from "src/components/PendingFriendRequests";

export const FriendsPage = () => {
  return (
    <div className="pt-24">
      <h1>Friends page</h1>

      <FriendList />
      <FriendSearch />
      <PendingFriendRequests />
    </div>
  );
};
