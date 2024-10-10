import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import { FriendsPage } from "./pages/FriendsPage";

function App() {
  return (
    <div className="prose prose-a:no-underline w-screen min-h-screen max-w-none flex flex-col">
      <Navbar />

      <main className="px-4 sm:px-6 lg:px-8 w-screen min-h-screen bg-gray-100 flex-grow pb-24">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/profile"
            element={
              <IsPrivate>
                <ProfilePage />
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

export default App;
