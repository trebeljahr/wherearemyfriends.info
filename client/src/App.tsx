import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
import SignupPage from "./pages/SignupPage/SignupPage.js";
import LoginPage from "./pages/LoginPage/LoginPage.js";

import Navbar from "./components/Navbar/Navbar.js";
import IsPrivate from "./components/IsPrivate/IsPrivate.js";
import IsAnon from "./components/IsAnon/IsAnon.js";

function App() {
  return (
    <div className="App">
      <Navbar />

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
    </div>
  );
}

export default App;
