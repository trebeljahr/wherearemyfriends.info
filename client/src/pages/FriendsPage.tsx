import { FriendSearch } from "../components/FriendSearch";
import { FriendsPrivacySettings } from "../components/FriendsharingList";
import { MapWithFriendMarkers } from "../components/MapWithFriendMarkers";
import { ReceivedFriendRequests } from "../components/ReceivedFriendRequests";
import { SentFriendRequests } from "../components/SentFriendRequests";
import { UserSearch } from "../components/UserSearch";

export const FriendsPage = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 w-screen">
      <h1>Friends page</h1>

      <h2 className="text-2xl font-bold mb-4">Search Friends by Location</h2>
      <FriendSearch />

      <MapWithFriendMarkers />
      <FriendsPrivacySettings />
      <UserSearch />
      <SentFriendRequests />
      <ReceivedFriendRequests />
    </div>
  );
};
