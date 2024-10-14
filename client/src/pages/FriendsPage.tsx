import { UserSearch } from "src/components/UserSearch";
import { FriendsPrivacySettings } from "src/components/FriendsharingList";
import { PendingFriendRequests } from "src/components/PendingFriendRequests";
import { MapWithFriendMarkers } from "src/components/MapWithFriendMarkers";

export const FriendsPage = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Friends page</h1>

      <MapWithFriendMarkers />

      <h2 className="text-2xl font-bold mb-4">Location Privacy Settings</h2>
      <FriendsPrivacySettings />

      <h2 className="text-2xl font-bold mb-4">Add a New Friend</h2>
      <UserSearch />

      <h2 className="text-2xl font-bold mb-4">Pending Friend Requests</h2>
      <PendingFriendRequests />
    </div>
  );
};
