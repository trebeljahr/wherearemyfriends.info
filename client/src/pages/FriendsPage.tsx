import { UserSearch } from "../components/UserSearch";
import { FriendsPrivacySettings } from "../components/FriendsharingList";
import { ReceivedFriendRequests } from "../components/ReceivedFriendRequests";
import { MapWithFriendMarkers } from "../components/MapWithFriendMarkers";
import { SentFriendRequests } from "../components/SentFriendRequests";

export const FriendsPage = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Friends page</h1>

      <MapWithFriendMarkers />

      <h2 className="text-2xl font-bold mb-4">Location Privacy Settings</h2>
      <FriendsPrivacySettings />

      <h2 className="text-2xl font-bold mb-4">Add a New Friend</h2>
      <UserSearch />

      <h2 className="text-2xl font-bold mb-4">Received Friend Requests</h2>
      <ReceivedFriendRequests />

      <h2 className="text-2xl font-bold mb-4">Sent Friend Requests</h2>
      <SentFriendRequests />
    </div>
  );
};
