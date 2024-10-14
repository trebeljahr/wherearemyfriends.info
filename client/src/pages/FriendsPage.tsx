import { UserSearch } from "src/components/UserSearch";
import { FriendList } from "src/components/FriendsharingList";
import { PendingFriendRequests } from "src/components/PendingFriendRequests";

export const FriendsPage = () => {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Friends page</h1>

      <FriendList />
      <UserSearch />
      <PendingFriendRequests />
    </div>
  );
};
