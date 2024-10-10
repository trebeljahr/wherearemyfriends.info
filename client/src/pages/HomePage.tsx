import { FriendSearch } from "src/components/FriendSearch";
import { MapWithFriendMarkers } from "src/components/MapWithFriendMarkers";
import { useAuth } from "src/context/auth.context";

function HomePageForNonLoggedInUsers() {
  return (
    <div>
      <h2>Log in to see your friends on the map</h2>
    </div>
  );
}

function HomePageForLoggedInUsers() {
  return (
    <div>
      <FriendSearch />
      <MapWithFriendMarkers />
    </div>
  );
}

export function HomePage() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="pt-24">
      <h1>Home page</h1>
      {isLoggedIn ? (
        <HomePageForLoggedInUsers />
      ) : (
        <HomePageForNonLoggedInUsers />
      )}
    </div>
  );
}
