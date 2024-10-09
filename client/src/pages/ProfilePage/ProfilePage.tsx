import { useContext } from "react";
import { FriendSearch } from "src/components/FriendSearch";
import { FriendList } from "src/components/FriendsharingList";
import { MapWithFriendMarkers } from "src/components/MapMarkerComponent";
import { PendingFriendRequests } from "src/components/PendingFriendRequests";
import { MapWithMarker } from "src/components/PickLocation";
import { ProfilePictureUpload } from "src/components/ProfilePictureUpload";
import { AuthContext } from "src/context/auth.context";

export function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Profile page</h1>
      <MapWithFriendMarkers />
      {user && <FriendList userId={user._id} />} 
      {user && <FriendSearch userId={user._id} />}
      {user && <MapWithMarker userId={user._id} />}
      <PendingFriendRequests />
      <ProfilePictureUpload />
    </div>
  );
}

export default ProfilePage;
