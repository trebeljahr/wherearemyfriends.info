import { MapWithFriendMarkers } from "src/components/MapWithFriendMarkers";
import { useAuth } from "src/context/auth.context";

function HomePageForNonLoggedInUsers() {
  return (
    <div>
      <h2>Log in to see your friends on the map</h2>
    </div>
  );
}

export function HomePage() {
  const { isLoggedIn } = useAuth();
  return (
    <div>
      <h1>Home page</h1>
      {isLoggedIn ? <MapWithFriendMarkers /> : <HomePageForNonLoggedInUsers />}
    </div>
  );
}

export default HomePage;
