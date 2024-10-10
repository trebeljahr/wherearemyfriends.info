import { FriendSearch } from "src/components/FriendSearch";
import { MapWithFriendMarkers } from "src/components/MapWithFriendMarkers";
import { useAuth } from "src/context/auth.context";

function HomePageForNonLoggedInUsers() {
  return (
    <div>
      <h1>Home page</h1>
      <h2>Log in to see your friends on the map</h2>
    </div>
  );
}

function HomePageForLoggedInUsers() {
  return (
    <div>
      <h1>Home page</h1>
      <h2>Here are your friends on the map</h2>

      <MapWithFriendMarkers />
      <FriendSearch />
    </div>
  );
}

export function HomePage() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="pt-24">
      {isLoggedIn ? (
        <HomePageForLoggedInUsers />
      ) : (
        <HomePageForNonLoggedInUsers />
      )}
    </div>
  );
}
