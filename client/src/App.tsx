import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MyLocationPage } from "./pages/MyLocationPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { Navbar } from "./components/Navbar";
import { IsPrivate } from "./components/IsPrivate";
import { IsAnon } from "./components/IsAnon";
import { FriendsPage } from "./pages/FriendsPage";
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage";

export function App() {
  return (
    <div className="prose prose-a:no-underline w-screen min-h-screen max-w-none flex flex-col">
      <Navbar />

      <main className="w-screen min-h-screen bg-gray-100 flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/location"
            element={
              <IsPrivate>
                <MyLocationPage />
              </IsPrivate>
            }
          />

          <Route
            path="/friends"
            element={
              <IsPrivate>
                <FriendsPage />
              </IsPrivate>
            }
          />

          <Route
            path="/signup"
            element={
              <IsAnon>
                <SignupPage />
              </IsAnon>
            }
          />

          <Route
            path="/settings"
            element={
              <IsPrivate>
                <ProfileSettingsPage />
              </IsPrivate>
            }
          />

          <Route
            path="/login"
            element={
              <IsAnon>
                <LoginPage />
              </IsAnon>
            }
          />
        </Routes>
      </main>
      <footer className="text-center text-white py-4 bg-gray-900">
        <p>&copy; {new Date().getFullYear()} wherearemyfriends.info</p>
      </footer>
    </div>
  );
}
