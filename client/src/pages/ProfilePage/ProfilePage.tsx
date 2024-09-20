import { Friend, FriendList } from "src/components/FriendsharingList";
import { MapComponent } from "src/components/MapMarkerComponent";

// Example usage of the FriendList component:
const friendsData: Friend[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/50/50",
    sharingState: "full",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://picsum.photos/51/50",
    sharingState: "city",
  },
  {
    id: "3",
    name: "Alice Johnson",
    avatar: "https://picsum.photos/52/50",
    sharingState: "country",
  },
];

const handleSharingStateChange = (
  id: string,
  newState: "full" | "city" | "country" | "none"
) => {
  console.log(`Friend with ID ${id} is now sharing ${newState} location.`);
};

export function ProfilePage() {
  return (
    <div>
      <h1>Profile page</h1>
      <MapComponent />
      <FriendList
        friends={friendsData}
        onSharingStateChange={handleSharingStateChange}
      />
    </div>
  );
}

export default ProfilePage;
