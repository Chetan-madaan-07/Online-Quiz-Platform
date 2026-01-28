import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";
import StatsSection from "./components/statsSection";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Profile from "./pages/profile";
import Campaign from "./pages/campaign";
import LevelPlay from "./pages/levelPlay";
import Rankings from "./pages/rankings";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <StatsSection />
            </>
          }
        />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/campaign/level/:levelNumber" element={<LevelPlay />} />
        <Route path="/rankings" element={<Rankings />} />
      </Routes>
    </div>
  );
}

export default App;









