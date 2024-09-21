import { useContext } from "react";
import { FriendSearch } from "src/components/FriendSearch";
import { FriendList } from "src/components/FriendsharingList";
import { MapComponent } from "src/components/MapMarkerComponent";
import { PendingFriendRequests } from "src/components/PendingFriendRequests";
import { MapWithMarker } from "src/components/PickLocation";
import { AuthContext } from "src/context/auth.context";

export function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Profile page</h1>
      <MapComponent />
      {user && <FriendList userId={user._id} />} 
      {user && <FriendSearch userId={user._id} />}
      {user && <MapWithMarker userId={user._id} />}
      <PendingFriendRequests />
    </div>
  );
}

export default ProfilePage;
