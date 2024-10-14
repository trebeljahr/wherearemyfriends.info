import { FriendSearch } from "src/components/FriendSearch";
import { LandingPage } from "src/components/LandingPage";
import { MapWithFriendMarkers } from "src/components/MapWithFriendMarkers";
import { useAuth } from "src/context/auth.context";

function HomePageForLoggedInUsers() {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Home page</h1>
      <h2>Here are your friends on the map</h2>

      <MapWithFriendMarkers />
      <FriendSearch />
    </div>
  );
}

export function HomePage() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <HomePageForLoggedInUsers /> : <LandingPage />;
}
